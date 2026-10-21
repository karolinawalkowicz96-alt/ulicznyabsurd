'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Check, CreditCard, MapPin, PackageCheck, ShoppingBag } from 'lucide-react';
import { useShop, ShopHeader, priceOf, type Catalog } from './Shop';
import { money } from '@/lib/catalog';
import type { ShopOrder } from '@/lib/shop-types';

const statusLabel:Record<string,string>={new:'przyjęte',confirmed:'potwierdzone',processing:'w realizacji',packed:'spakowane',shipped:'wysłane',delivered:'doręczone',completed:'zakończone',cancelled:'anulowane',returned:'zwrócone',pending:'oczekuje',paid:'opłacone',unpaid:'nieopłacone',failed:'nieudane'};

export default function Checkout(){
  const {items,setItems,catalog,setCatalog,ready,catalogReady}=useShop();
  const settings=catalog.settings;
  const test=Boolean(settings.testMode);
  const courierActive=Boolean(settings.courierActive);
  const lockerActive=Boolean(settings.lockerActive);
  const codActive=Boolean(settings.codActive);
  const stripeActive=Boolean(settings.stripeActive);
  const [delivery,setDelivery]=useState<'courier'|'locker'>('courier');
  const [payment,setPayment]=useState<'cod'|'stripe'>('cod');
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [order,setOrder]=useState<ShopOrder|null>(null);const [loadingOrder,setLoadingOrder]=useState(false);

  useEffect(()=>{if(!courierActive&&lockerActive)setDelivery('locker');if(!codActive&&stripeActive)setPayment('stripe');},[courierActive,lockerActive,codActive,stripeActive]);
  // Receipt loading begins after reading the browser URL; synchronize the initial loading indicator.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{const token=new URLSearchParams(location.search).get('token');if(token){setLoadingOrder(true);fetch(`/api/shop/orders?token=${encodeURIComponent(token)}`,{cache:'no-store'}).then(async r=>{const d=await r.json() as {order:ShopOrder;error?:string};if(!r.ok)throw Error(d.error||'Nie można odczytać zamówienia.');setOrder(d.order);if(d.order.payment==='stripe'&&d.order.paymentStatus==='paid')setItems([]);}).catch(e=>setError(e.message)).finally(()=>setLoadingOrder(false));}},[setItems]);

  const subtotal=useMemo(()=>items.reduce((s,i)=>s+i.quantity*(priceOf(catalog.products.find(p=>p.id===i.id)||{price:0} as never)||0),0),[items,catalog.products]);
  const baseShipping=test?(delivery==='locker'?1499:1899):Number(delivery==='locker'?settings.lockerPrice:settings.courierPrice)||0;
  const shipping=baseShipping+(payment==='cod'?Number(settings.codSurcharge||0):0);
  const codConfirmed=test||Boolean(delivery==='locker'?settings.lockerCodConfirmed:settings.courierCodConfirmed);
  const deliveryAvailable=delivery==='locker'?lockerActive:courierActive;
  const paymentAvailable=payment==='cod'?codActive&&codConfirmed:stripeActive;
  const checkoutAvailable=catalog.configured&&deliveryAvailable&&paymentAvailable&&(test||Boolean(settings.salesActive));

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();if(busy||!checkoutAvailable)return;setError('');setBusy(true);
    try{
      const data=Object.fromEntries(new FormData(e.currentTarget));
      const payload={items,expectedTotal:subtotal+shipping,customer:{firstName:data.firstName,lastName:data.lastName,email:data.email,phone:data.phone,country:'PL',street:data.street||'',postalCode:data.postalCode,city:data.city,locker:data.locker||'',notes:data.notes||'',invoice:data.invoice||''},delivery,payment,acceptedTerms:data.acceptedTerms==='on',testAcknowledged:test&&data.acceptedTerms==='on'};
      const signature=JSON.stringify(payload);let attempt:{signature:string;key:string}|undefined;try{attempt=JSON.parse(sessionStorage.getItem('ua-order-attempt')||'null')}catch{}
      if(!attempt||attempt.signature!==signature)attempt={signature,key:crypto.randomUUID()};sessionStorage.setItem('ua-order-attempt',JSON.stringify(attempt));
      const response=await fetch('/api/shop/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,idempotencyKey:attempt.key})});
      const result=await response.json() as ShopOrder & {order?:ShopOrder;error?:string};
      if(!response.ok){try{const fresh=await fetch('/api/shop/catalog',{cache:'no-store'});if(fresh.ok)setCatalog(await fresh.json() as Catalog);}catch{}throw Error(result.error||'Nie udało się zapisać zamówienia.');}
      const saved=result.order||result;setOrder(saved);if(saved.token)history.replaceState(null,'',`/zamowienie?token=${encodeURIComponent(saved.token)}`);
      if(payment==='stripe'){const pay=await fetch('/api/shop/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:saved.id,token:saved.token})});const next=await pay.json() as {url?:string;error?:string};if(!pay.ok||!next.url)throw Error(next.error||'Zamówienie zapisane, ale nie udało się otworzyć płatności.');window.location.assign(next.url);return;}
      setItems([]);
    }catch(e){setError(e instanceof Error?e.message:'Błąd zamówienia.')}finally{setBusy(false)}
  }
  async function retryPayment(){if(!order?.token||busy)return;setBusy(true);setError('');try{const r=await fetch('/api/shop/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:order.id,token:order.token})});const d=await r.json() as {url?:string;error?:string};if(!r.ok||!d.url)throw Error(d.error||'Nie można rozpocząć płatności.');location.assign(d.url);}catch(e){setError(e instanceof Error?e.message:'Nie można rozpocząć płatności.');}finally{setBusy(false)}}

  return <><ShopHeader/><main className="section shop-checkout"><div className="checkout-top"><span className="eyebrow">ULICZNY ABSURD / ZAMÓWIENIE</span><div className="checkout-steps" aria-label="Etapy zamówienia"><span className="done"><b>01</b>Koszyk</span><span className={order?'done':'active'}><b>02</b>Dostawa i płatność</span><span className={order?'active':''}><b>03</b>Potwierdzenie</span></div></div>
  {loadingOrder?<p role="status">Wczytujemy zamówienie…</p>:order?<Confirmation order={order} busy={busy} retryPayment={retryPayment}/>:<>
    <div className="checkout-heading"><div><h1>JESZCZE CHWILA.<br/>I NOSISZ ABSURD.</h1><p>Sprawdź dane, wybierz dostawę i płatność. Przed złożeniem zamówienia zobaczysz pełną kwotę.</p></div></div>

    {catalogReady&&!catalog.configured&&<p className="error">Sklep oczekuje na konfigurację bazy danych. Zamówienia są tymczasowo niedostępne.</p>}
    {catalogReady&&!test&&!Boolean(settings.salesActive)&&<p className="form-notice">Zamówienia są chwilowo niedostępne. Skontaktuj się z nami: <a href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com</a>.</p>}
    {!ready||!catalogReady?<p role="status">Wczytywanie sklepu i koszyka…</p>:!items.length?<div className="checkout-empty"><ShoppingBag size={46}/><h2>Koszyk jest pusty.</h2><Link className="button dark" href="/#kolekcja">Wybierz koszulkę</Link></div>:<div className="shop-checkout-grid">
      <form className="checkout-form" onSubmit={submit}>
        <section className="checkout-card"><div className="checkout-card-title"><span>01</span><div><h2>Dane do dostawy</h2><p>Dostarczamy na terenie Polski.</p></div></div>
          <div className="form-row"><label>Imię<input name="firstName" required minLength={2} maxLength={80} autoComplete="given-name"/></label><label>Nazwisko<input name="lastName" required minLength={2} maxLength={80} autoComplete="family-name"/></label></div>
          <div className="form-row"><label>E-mail<input name="email" type="email" required maxLength={200} autoComplete="email"/></label><label>Telefon<input name="phone" type="tel" required pattern="[+0-9 ()\-]{7,20}" autoComplete="tel"/></label></div>
          <div className="country-static"><MapPin size={18}/><span><small>Kraj dostawy</small><strong>Polska</strong></span></div>
        </section>

        <section className="checkout-card"><div className="checkout-card-title"><span>02</span><div><h2>Dostawa</h2><p>Wybierz wygodny sposób odbioru.</p></div></div>
          <div className="choice-grid" role="radiogroup" aria-label="Metoda dostawy">
            {courierActive&&<Choice checked={delivery==='courier'} onChange={()=>setDelivery('courier')} name="delivery" value="courier" title="Kurier" meta={money(test?1899:Number(settings.courierPrice)||0)} icon={<PackageCheck/>}/>}
            {lockerActive&&<Choice checked={delivery==='locker'} onChange={()=>setDelivery('locker')} name="delivery" value="locker" title="Automat paczkowy" meta={money(test?1499:Number(settings.lockerPrice)||0)} icon={<MapPin/>}/>}
          </div>
          {!courierActive&&!lockerActive&&<p className="error">Sprzedawca nie aktywował jeszcze żadnej zweryfikowanej metody dostawy.</p>}
          {delivery==='locker'?<label>Identyfikator automatu paczkowego<input name="locker" required minLength={3} maxLength={30} placeholder="Np. WAW01M" autoComplete="off"/></label>:<label>Ulica, numer budynku / lokalu<input name="street" required maxLength={200} autoComplete="street-address"/></label>}
          <div className="form-row"><label>Kod pocztowy<input name="postalCode" required pattern="[0-9]{2}-[0-9]{3}" placeholder="00-000" maxLength={6} autoComplete="postal-code"/></label><label>Miasto<input name="city" required minLength={2} maxLength={100} autoComplete="address-level2"/></label></div>
          <label>Uwagi do zamówienia <small>(opcjonalnie)</small><textarea name="notes" maxLength={2000} rows={3}/></label>
          <details className="checkout-details"><summary>Dane do dokumentu sprzedaży (opcjonalnie)</summary><label>Nazwa / dane i adres; identyfikator podatkowy, jeżeli dotyczy<textarea name="invoice" maxLength={1000} rows={3}/></label></details>
        </section>

        <section className="checkout-card"><div className="checkout-card-title"><span>03</span><div><h2>Płatność</h2><p>{test?'Zamówienie próbne — bez pobierania płatności.':'Wybierz sposób płatności.'}</p></div></div>
          <div className="choice-grid" role="radiogroup" aria-label="Metoda płatności">
            {codActive&&<Choice checked={payment==='cod'} onChange={()=>setPayment('cod')} name="payment" value="cod" title={test?'Za pobraniem — próba':'Za pobraniem'} meta={Number(settings.codSurcharge)>0?`+ ${money(Number(settings.codSurcharge))}`:(test?'bez płatności i wysyłki':'przy odbiorze')} icon={<PackageCheck/>}/>}
            {stripeActive&&<Choice checked={payment==='stripe'} onChange={()=>setPayment('stripe')} name="payment" value="stripe" title="Płatność online" meta="Stripe · dostępne metody konta" icon={<CreditCard/>}/>}
          </div>
          {!codActive&&!stripeActive&&<p className="error">Brak aktywnej metody płatności.</p>}
          {payment==='cod'&&!codConfirmed&&<p className="error">Pobranie dla tej metody dostawy nie zostało potwierdzone z przewoźnikiem.</p>}
          {payment==='stripe'&&<p className="checkout-help">Stripe pokaże wyłącznie metody dostępne dla tego konta i transakcji — np. kartę lub BLIK, jeśli BLIK jest aktywowany i dostępny.</p>}
        </section>

        <section className="checkout-card checkout-legal"><div className="checkout-card-title"><span>04</span><div><h2>Przed zamówieniem</h2><p>Najważniejsze informacje o sprzedawcy i umowie.</p></div></div>
          <div className="seller-box"><strong>ULICZNY ABSURD — Paweł Duszyński</strong><span>ul. Północna 24/2, 44-335 Jastrzębie-Zdrój</span><a href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com</a>{settings.sellerPhone?<a href={`tel:${String(settings.sellerPhone)}`}>{String(settings.sellerPhone)}</a>:<span className="seller-missing">Telefon zostanie uzupełniony przed uruchomieniem sprzedaży.</span>}</div>
          <p>Czas realizacji: 7 dni roboczych. Do tego należy doliczyć czas transportu. Standardowe koszulki z gotowym wzorem podlegają ustawowemu prawu odstąpienia na zasadach opisanych w <Link href="/zwroty" target="_blank">informacji o zwrotach</Link>.</p>
          {test&&<p className="checkout-test-note"><strong>Zamówienie testowe.</strong> Sprawdzisz cały proces za pobraniem. Nie wysyłamy towaru ani e-maili transakcyjnych i nie powstaje obowiązek zapłaty.</p>}<label className="shop-checkbox"><input type="checkbox" name="acceptedTerms" required/><span>{test?'Potwierdzam, że składam wyłącznie zamówienie testowe, bez wysyłki i obowiązku zapłaty. ':''}Zapoznałem/am się z <Link href="/regulamin" target="_blank">regulaminem sklepu</Link> i akceptuję jego warunki. <Link href="/prywatnosc" target="_blank">Polityka prywatności</Link> jest informacją o przetwarzaniu danych, a nie dodatkową zgodą.</span></label>
        </section>
        {error&&<p className="error" role="alert">{error}</p>}
        <button className="button dark checkout-submit" disabled={busy||!checkoutAvailable} type="submit">{busy?'Zapisywanie…':test?'Złóż zamówienie testowe':'Zamawiam z obowiązkiem zapłaty'}</button>
        {!checkoutAvailable&&<p className="checkout-help">Przycisk pozostaje nieaktywny, dopóki sklep, dostawa i wybrana płatność nie są rzeczywiście dostępne.</p>}
      </form>

      <aside className="shop-order-summary" aria-label="Podsumowanie zamówienia"><span className="eyebrow">TWOJE ZAMÓWIENIE</span><div className="summary-items">{items.map(i=>{const p=catalog.products.find(p=>p.id===i.id);return <div className="summary-item" key={i.id+i.size}>{p&&<img src={p.image} alt=""/>}<div><h3>{p?.name||'Produkt'}</h3><p>Rozmiar {i.size} · {i.quantity} szt.</p><strong>{p&&priceOf(p)!=null?money(i.quantity*priceOf(p)!):'Cena do potwierdzenia'}</strong></div></div>})}</div><div className="summary-lines"><p><span>Produkty</span><strong>{money(subtotal)}</strong></p><p><span>Dostawa{payment==='cod'&&Number(settings.codSurcharge)>0?' + pobranie':''}</span><strong>{money(shipping)}</strong></p><p className="summary-total"><span>Razem</span><strong>{money(subtotal+shipping)}</strong></p></div><div className="summary-note"><Check size={18}/><p>Cena i stan produktów są ponownie sprawdzane na serwerze przed zapisaniem zamówienia.</p></div></aside>
    </div>}
  </>}</main></>;
}

function Choice({checked,onChange,name,value,title,meta,icon}:{checked:boolean;onChange:()=>void;name:string;value:string;title:string;meta:string;icon:React.ReactNode}){return <label className={`checkout-choice ${checked?'selected':''}`}><input type="radio" name={name} value={value} checked={checked} onChange={onChange}/><span className="choice-icon">{icon}</span><span><strong>{title}</strong><small>{meta}</small></span><i aria-hidden="true">{checked?'✓':''}</i></label>}

function Confirmation({order,busy,retryPayment}:{order:ShopOrder;busy:boolean;retryPayment:()=>void}){return <section className="shop-confirmation"><div className="confirmation-mark"><Check size={40}/></div><span className="eyebrow">03 / POTWIERDZENIE</span><h1>{order.testMode?'PRÓBA ZAPISANA!':'DZIĘKUJEMY!'}</h1>{order.testMode&&<p className="checkout-test-note">To zamówienie testowe za pobraniem. Nie wysyłamy towaru ani e-maili transakcyjnych. Nie masz nic do zapłaty.</p>}<p className="confirmation-number">Numer zamówienia <strong>{order.number}</strong></p><div className="confirmation-grid"><div><small>Płatność</small><strong>{order.payment==='cod'?'Za pobraniem':'Online przez Stripe'}</strong><span>{statusLabel[order.paymentStatus]||order.paymentStatus}</span></div><div><small>Kwota</small><strong>{money(order.total)}</strong><span>{order.testMode?'kwota próbna — nie płacisz':order.paymentStatus==='paid'?'zapłacono':order.payment==='cod'?'do zapłaty przy odbiorze':'do zapłaty online'}</span></div><div><small>Status</small><strong>{statusLabel[order.status]||order.status}</strong><span>przesyłka: {statusLabel[order.shippingStatus]||order.shippingStatus}</span></div></div>{order.payment==='stripe'&&order.paymentStatus==='unpaid'&&order.status!=='cancelled'&&!order.stockRestored&&<button className="button dark" disabled={busy} onClick={retryPayment}>{busy?'Otwieramy płatność…':'Przejdź do płatności Stripe'}</button>}{!order.testMode&&<p>{order.notificationStatus==='sent'?'Potwierdzenie warunków zamówienia zostało wysłane e-mailem.':'Zamówienie zapisano. Potwierdzenie wyślemy e-mailem. W razie pytań napisz na ulicznyabsurd@gmail.com.'}</p>}<div className="confirmation-items">{order.items.map(i=><div className="summary-item" key={i.id+i.size}><img src={i.image} alt=""/><div><h3>{i.name}</h3><p>Rozmiar {i.size} · {i.quantity} szt.</p><strong>{money(i.price*i.quantity)}</strong></div></div>)}</div><div className="summary-lines"><p><span>Produkty</span><strong>{money(order.subtotal)}</strong></p><p><span>Dostawa</span><strong>{money(order.shipping)}</strong></p><p className="summary-total"><span>Razem</span><strong>{money(order.total)}</strong></p></div><Link href="/#kolekcja" className="button dark">Wróć do kolekcji</Link></section>}
