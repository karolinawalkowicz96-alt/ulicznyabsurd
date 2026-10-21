import { paymentSettings, stripeKeyMode } from './stripe-config';
import { shippingTotal } from './shop-shipping';
import { isDeliveryCountry } from './delivery-countries';
import { legalContractText, legalVersion } from './legal-contract';
import { randomBytes, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db, transaction } from './shop-db';
import { hash } from './shop-auth';
import { defaultSettings, seedProducts } from './shop-seed';
import { ShopOrder, ShopProduct, ShopSettings, shopSizes } from './shop-types';

export async function getSettings():Promise<ShopSettings>{
  const stored=(await db().query('SELECT data FROM shop_settings WHERE id=1')).rows[0]?.data||{};
  return paymentSettings({...defaultSettings,...stored});
}
export function deliveryPrice(settings:ShopSettings,delivery:string,test=settings.testMode){
  if(delivery==='international')return settings.internationalShippingReady ? 11900 : null;
  if(test)return delivery==='locker'?1499:delivery==='courier'?1899:9900;
  if(delivery==='locker'&&settings.lockerActive)return settings.lockerPrice;
  if(delivery==='courier'&&settings.courierActive)return settings.courierPrice;
  return null;
}
export async function getCatalog(includeHidden=false){
  let settings=defaultSettings;let products=seedProducts;let configured=false;
  if(process.env.DATABASE_URL){settings=await getSettings();const result=await db().query('SELECT p.data,v.size,v.stock,v.test_stock FROM shop_products p JOIN shop_variants v ON p.id=v.product_id ORDER BY (p.data->>\'sortOrder\')::int');const mapped=new Map<string,ShopProduct>();for(const row of result.rows){const p=mapped.get(row.data.id)||{...row.data,variants:[]};p.variants.push({size:row.size,stock:row.stock,effectiveStock:settings.testMode?row.test_stock:row.stock,available:!p.soldOut&&p.active&&(settings.testMode?row.test_stock>0:p.priceApproved&&row.stock>0)});mapped.set(p.id,p);}products=[...mapped.values()];configured=true;}
  products=products.filter(p=>includeHidden||!p.hidden).map(p=>({...p,effectivePrice:settings.testMode?(p.price??12900):p.price,testPrice:settings.testMode?12900:undefined,variants:p.variants.map(v=>({...v,available:configured&&(v.available??false)}))}));
  return {products,settings,configured};
}

export const orderInput=z.object({
  idempotencyKey:z.string().uuid(),items:z.array(z.object({id:z.string().min(1).max(100),size:z.enum(shopSizes),quantity:z.number().int().min(1).max(20)})).min(1).max(50),
  customer:z.object({firstName:z.string().trim().min(2).max(80),lastName:z.string().trim().min(2).max(80),email:z.string().email().max(200),phone:z.string().regex(/^[+\d ()-]{7,20}$/),country:z.string().refine(isDeliveryCountry,'Wybierz prawidłowy kraj dostawy'),street:z.string().trim().max(200).optional(),postalCode:z.string().trim().min(2).max(20),city:z.string().trim().min(2).max(100),locker:z.string().trim().max(40).optional(),notes:z.string().max(2000).optional(),invoice:z.string().max(1000).optional()}),
  delivery:z.enum(['courier','locker','international']),payment:z.enum(['cod','stripe']),expectedTotal:z.number().int().nonnegative().optional(),acceptedTerms:z.literal(true),testAcknowledged:z.boolean().optional()
});
const euCountries=new Set(['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE']);
function productReadyForSale(p:ShopProduct){
  const country=(p.manufacturerCountry||'').toUpperCase();
  const basic=Boolean(p.manufacturer&&p.manufacturerAddress&&p.manufacturerEmail&&p.composition&&p.gpsrReady&&country.length===2);
  const responsible=euCountries.has(country)||Boolean(p.responsiblePerson&&p.responsiblePersonAddress&&p.responsiblePersonEmail);
  return basic&&responsible;
}
export async function createOrder(raw:unknown){
  const input=orderInput.parse(raw);const requestHash=hash(JSON.stringify(input));
  return transaction(async c=>{
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[input.idempotencyKey]);
    const existing=(await c.query('SELECT data,request_hash FROM shop_orders WHERE idempotency_key=$1',[input.idempotencyKey])).rows[0];
    if(existing){if(existing.request_hash!==requestHash)throw new Error('Klucz zamówienia został już użyty dla innych danych.');return existing.data as ShopOrder;}
    const stored=(await c.query('SELECT data FROM shop_settings WHERE id=1 FOR SHARE')).rows[0]?.data;
    if(!stored)throw new Error('Najpierw uruchom migrację i seed.');
    const settings=paymentSettings({...defaultSettings,...stored} as ShopSettings);
    const testOrder=settings.testMode||(input.payment==='stripe'&&settings.stripeTestMode===true);
    if(testOrder&&input.testAcknowledged!==true)throw new Error('Potwierdź próbne zamówienie — bez wysyłki i bez obowiązku zapłaty.');
    if(!settings.testMode&&!settings.salesActive)throw new Error('Sprzedaż jest obecnie wyłączona.');
    if(input.payment==='cod'&&(process.env.COD_CHECKOUT_ENABLED==='false'||(!settings.testMode&&!settings.codActive)))throw new Error('Płatność za pobraniem jest wyłączona.');
    if(input.payment==='stripe'&&(!settings.stripeActive||!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET))throw new Error('Płatności online nie są skonfigurowane.');
    if(input.payment==='stripe'&&testOrder!==(stripeKeyMode()==='test'))throw new Error('Tryb klucza Stripe nie odpowiada trybowi sklepu.');
    if(!settings.testMode&&(!settings.legalReady||!settings.sellerPhone||!settings.fulfillmentDays||!settings.sizeChartApproved||!settings.shippingReady))throw new Error('Informacje wymagane do uruchomienia sprzedaży nie zostały uzupełnione.');
    const abroad=input.customer.country!=='PL';
    if(abroad!== (input.delivery==='international'))throw new Error('Sposób dostawy musi odpowiadać wybranemu krajowi.');
    if(input.customer.country==='PL'&&!/^\d{2}-\d{3}$/.test(input.customer.postalCode))throw new Error('Polski kod pocztowy musi mieć format 00-000.');
    if(abroad&&!settings.internationalShippingReady)throw new Error('Dostawy zagraniczne nie zostały jeszcze potwierdzone przez sprzedawcę.');
    if(abroad&&input.payment!=='stripe')throw new Error('Zamówienia zagraniczne wymagają aktywnej płatności online. Pobranie jest dostępne wyłącznie w Polsce.');
    const ship=deliveryPrice(settings,input.delivery,settings.testMode);
    if(ship===null)throw new Error('Wybrana metoda dostawy nie jest aktywna.');
    if(input.delivery==='locker'&&!/^[A-Z0-9_-]{3,30}$/i.test(input.customer.locker||''))throw new Error('Podaj poprawny identyfikator automatu paczkowego.');
    if(input.delivery!=='locker'&&!input.customer.street?.trim())throw new Error('Podaj ulicę i numer.');
    const confirmed=input.delivery==='courier'?settings.courierCodConfirmed:input.delivery==='locker'?settings.lockerCodConfirmed:false;
    if(input.payment==='cod'&&!settings.testMode&&!confirmed)throw new Error('Pobranie dla tej dostawy nie zostało potwierdzone z przewoźnikiem.');
    const merged=new Map<string,typeof input.items[number]>();for(const item of input.items){const key=item.id+':'+item.size;const old=merged.get(key);merged.set(key,{...item,quantity:item.quantity+(old?.quantity||0)});}
    const items:ShopOrder['items']=[];
    for(const item of [...merged.values()].sort((a,b)=>(a.id+a.size).localeCompare(b.id+b.size))){
      if(item.quantity>20)throw new Error('Maksymalnie 20 sztuk wariantu.');
      const row=(await c.query('SELECT p.data,v.stock,v.test_stock FROM shop_products p JOIN shop_variants v ON p.id=v.product_id WHERE p.id=$1 AND v.size=$2 FOR UPDATE OF p,v',[item.id,item.size])).rows[0];
      if(!row||!row.data.active||row.data.hidden||row.data.soldOut)throw new Error('Produkt niedostępny.');
      const p=row.data as ShopProduct;if(!settings.testMode&&!productReadyForSale(p))throw new Error('Produkt wymaga uzupełnienia i potwierdzenia informacji o składzie oraz bezpieczeństwie.');
      const price=settings.testMode?(p.price??12900):p.price;const stock=testOrder?row.test_stock:row.stock;
      if(price===null||(!settings.testMode&&!p.priceApproved))throw new Error('Cena produktu nie jest zatwierdzona.');if(stock===null||stock<item.quantity)throw new Error('Niewystarczająca liczba sztuk wybranego rozmiaru.');
      await c.query(`UPDATE shop_variants SET ${testOrder?'test_stock':'stock'}=${testOrder?'test_stock':'stock'}-$3 WHERE product_id=$1 AND size=$2`,[item.id,item.size,item.quantity]);items.push({...item,name:p.name,image:p.image,price});
    }
    const subtotal=items.reduce((n,i)=>n+i.price*i.quantity,0);const shipping=shippingTotal(settings,input.delivery,input.payment,settings.testMode);
    if(input.expectedTotal!==undefined&&input.expectedTotal!==subtotal+shipping)throw new Error('Cena lub dostawa uległa zmianie. Odśwież koszyk i potwierdź nową kwotę.');
    const token=randomBytes(32).toString('hex');const now=new Date().toISOString();
    const order:ShopOrder={id:randomUUID(),number:`${testOrder?'TEST':'UA'}-${now.slice(0,10).replaceAll('-','')}-${randomBytes(5).toString('hex').toUpperCase()}`,token,legalText:legalContractText,legalVersion,sellerPhone:settings.sellerPhone,fulfillmentDays:settings.fulfillmentDays,createdAt:now,testMode:testOrder,customer:input.customer,items,subtotal,shipping,total:subtotal+shipping,delivery:input.delivery,payment:input.payment,status:'new',paymentStatus:'unpaid',shippingStatus:'pending',returnStatus:'none',trackingNumber:'',carrier:input.delivery==='international'?'':'InPost',history:[{at:now,action:`Złożono zamówienie. ${input.payment==='cod'?'Płatność za pobraniem':'Stripe'}: nieopłacone. Regulamin: ${legalVersion}.`}],notificationStatus:testOrder?'test_not_sent':process.env.RESEND_API_KEY&&process.env.EMAIL_FROM?'pending':'not_configured',stockRestored:false};
    await c.query('INSERT INTO shop_orders(id,number,token_hash,idempotency_key,request_hash,data) VALUES($1,$2,$3,$4,$5,$6)',[order.id,order.number,hash(token),input.idempotencyKey,requestHash,JSON.stringify(order)]);
    if(!testOrder)for(const recipient of new Set([input.customer.email.toLowerCase(),'ulicznyabsurd@gmail.com']))await c.query('INSERT INTO shop_outbox(id,order_id,recipient,event) VALUES($1,$2,$3,$4)',[randomUUID(),order.id,recipient,'new']);
    return order;
  });
}
