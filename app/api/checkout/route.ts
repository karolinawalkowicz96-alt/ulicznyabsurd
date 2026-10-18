import {product} from '@/lib/catalog';import {checkedItems,reserve,stripe} from '@/lib/checkout';import {hasRedis,json,limited,readBody,redis,sameOrigin,sha256} from '@/lib/server';
export async function POST(r:Request){
 if(!sameOrigin(r))return json({error:'Niedozwolone źródło żądania.'},403);
 let d,items;try{d=await readBody(r);items=checkedItems(d.items);}catch{return json({error:'Koszyk zawiera nieprawidłowe dane lub niedostępny rozmiar.'},400);}
 if(process.env.STORE_LIVE!=='true'||!product.verified||!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET||!process.env.PUBLIC_SITE_URL||!hasRedis()||process.env.LEGAL_APPROVED!=='true')return json({error:'To podgląd sklepu. Zamówienia i płatności nie są jeszcze aktywne. Koszyk pozostaje zapisany.'},503);
 const shipping=Number(process.env.SHIPPING_PRICE_GROSZE);if(!Number.isSafeInteger(shipping)||shipping<0||!process.env.SHIPPING_NAME)return json({error:'Nie skonfigurowano dostawy.'},503);
 const id=d.requestId;if(typeof id!=='string'||!/^[a-f\d-]{36}$/i.test(id))return json({error:'Nieprawidłowy identyfikator próby płatności.'},400);
 try{
  const ip=r.headers.get('x-vercel-forwarded-for')||r.headers.get('cf-connecting-ip')||'unknown';if(await limited(`checkout:${await sha256(ip)}`,20,3600))return json({error:'Za dużo prób płatności. Spróbuj później.'},429);
  const total=items.reduce((n,i)=>n+i.quantity*product.price,shipping),fingerprint=await sha256(JSON.stringify({items,total}));
  const order=await reserve({id,fingerprint,items,total,status:'reserved',createdAt:new Date().toISOString()});
  if(order.status!=='reserved')return json({error:'Ta próba została zakończona. Rozpocznij nowe zamówienie.'},409);
  if(order.url)return json({url:order.url});
  const base=process.env.PUBLIC_SITE_URL.replace(/\/$/,'');
  const body=new URLSearchParams({mode:'payment',success_url:`${base}/zamowienie?status=powrot`,cancel_url:`${base}/zamowienie?status=anulowano`,'metadata[order_id]':id,client_reference_id:id,'shipping_address_collection[allowed_countries][0]':'PL',expires_at:String(Math.floor(Date.parse(order.createdAt)/1000)+3600),'shipping_options[0][shipping_rate_data][type]':'fixed_amount','shipping_options[0][shipping_rate_data][fixed_amount][amount]':String(shipping),'shipping_options[0][shipping_rate_data][fixed_amount][currency]':'pln','shipping_options[0][shipping_rate_data][display_name]':process.env.SHIPPING_NAME});
  // Enabled methods are selected in Stripe Dashboard; BLIK/cards, P24 only after eligibility approval.
  items.forEach((item,i)=>{body.set(`line_items[${i}][price_data][currency]`,'pln');body.set(`line_items[${i}][price_data][unit_amount]`,String(product.price));body.set(`line_items[${i}][price_data][product_data][name]`,`${product.name} / ${item.size}`);body.set(`line_items[${i}][quantity]`,String(item.quantity));});
  const session=await stripe('checkout/sessions',body,`ua-checkout-${id}`);
  if(typeof session.url!=='string'||!session.url.startsWith('https://checkout.stripe.com/'))throw Error('PAYMENT_PROVIDER_ERROR');
  // Merge session data atomically: a webhook may already have transitioned the order.
  await redis('EVAL',"local o=cjson.decode(redis.call('GET',KEYS[1]));o.sessionId=ARGV[1];o.url=ARGV[2];redis.call('SET',KEYS[1],cjson.encode(o));return 1",1,`ua:order:${id}`,session.id,session.url);
  return json({url:session.url});
 }catch{return json({error:'Nie udało się rozpocząć płatności lub wariant jest niedostępny. Ponów próbę. Nie potwierdzono zamówienia.'},503);}
}
