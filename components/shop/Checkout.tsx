'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, MapPin, PackageCheck, ShoppingBag } from 'lucide-react';
import { useShop, ShopHeader, CountryPicker, priceOf, type Catalog } from './Shop';
import { deliveryCountryName } from '@/lib/delivery-countries';
import LockerPicker from './LockerPicker';
import { shippingTotal } from '@/lib/shop-shipping';
import { money } from '@/lib/catalog';
import type { ShopOrder } from '@/lib/shop-types';

const statusLabel:Record<string,string>={new:'przyjęte',confirmed:'potwierdzone',processing:'w realizacji',packed:'spakowane',shipped:'wysłane',delivered:'doręczone',completed:'zakończone',cancelled:'anulowane',returned:'zwrócone',pending:'oczekuje',paid:'opłacone',unpaid:'nieopłacone',failed:'nieudane',expired:'wygasła'};

export default function Checkout(){
  const {items,setItems,catalog,setCatalog,ready,catalogReady,destinationCountry,setDestinationCountry}=useShop();
  const settings=catalog.settings;
  const test=Boolean(settings.testMode);
  const courierActive=Boolean(settings.courierActive);
  const lockerActive=Boolean(settings.lockerActive);
  const stripeActive=Boolean(settings.stripeActive);
  const [preferredDelivery,setDelivery]=useState<'courier'|'locker'>('courier');
  const delivery=!courierActive&&lockerActive?'locker':preferredDelivery;
  const abroad=destinationCountry!=='PL';
  const selectedDelivery=abroad?'international':delivery;
  const payment='stripe' as const;
  const submitting=useRef(false);
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [order,setOrder]=useState<ShopOrder|null>(null);const [loadingOrder,setLoadingOrder]=useState(false);

  // Receipt loading begins after reading the browser URL; synchronize the initial loading indicator.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{const token=new URLSearchParams(location.search).get('token');if(token){setLoadingOrder(true);fetch(`/api/shop/orders?token=${encodeURIComponent(token)}`,{cache:'no-store'}).then(async r=>{const d=await r.json() as {order:ShopOrder;error?:string};if(!r.ok)throw Error(d.error||'Nie można odczytać zamówienia.');setOrder(d.order);if(d.order.payment==='stripe'&&d.order.paymentStatus==='paid'){setItems([]);sessionStorage.removeItem('ua-order-attempt');}}).catch(e=>setError(e.message)).finally(()=>setLoadingOrder(false));}},[setItems]);

  // A return from Stripe is not proof of payment. Poll our webhook-backed order state.
  useEffect(()=>{
    if(!order?.token||order.payment!=='stripe'||order.paymentStatus!=='unpaid')return;
    let stopped=false;let attempts=0;const token=order.token;
    const timer=setInterval(async()=>{
      if(++attempts>30){clearInterval(timer);return;}
      try{const response=await fetch(`/api/shop/orders?token=${encodeURIComponent(token)}`,{cache:'no-store'});
        if(!response.ok)return;const result=await response.json() as {order:ShopOrder};
        if(!stopped&&result.order.paymentStatus!=='unpaid'){setOrder(result.order);if(result.order.paymentStatus==='paid'){setItems([]);sessionStorage.removeItem('ua-order-attempt');}}
      }catch{/* A temporary network failure must not imply a paid order. */}
    },2000);
    return()=>{stopped=true;clearInterval(timer);};
  },[order?.token,order?.payment,order?.paymentStatus,setItems]);

  const subtotal=useMemo(()=>items.reduce((s,i)=>s+i.quantity*(priceOf(catalog.products.find(p=>p.id===i.id)||{price:0} as never)||0),0),[items,catalog.products]);
  const shipping=shippingTotal(settings,selectedDelivery,payment,test);
  const deliveryAvailable=abroad?Boolean(settings.internationalShippingReady):(delivery==='locker'?lockerActive:courierActive);
  const paymentAvailable=stripeActive;
  const checkoutAvailable=catalog.configured&&deliveryAvailable&&paymentAvailable&&(test||Boolean(settings.salesActive));

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();if(submitting.current||busy||!checkoutAvailable)return;submitting.current=true;setError('');setBusy(true);
    try{
      const data=Object.fromEntries(new FormData(e.currentTarget));
      const payload={items,expectedTotal:subtotal+shipping,customer:{firstName:data.firstName,lastName:data.lastName,email:data.email,phone:data.phone,country:destinationCountry,street:data.street||'',postalCode:data.postalCode,city:data.city,locker:data.locker||'',notes:data.notes||'',invoice:data.invoice||''},delivery:selectedDelivery,payment,acceptedTerms:data.acceptedTerms==='on'};
      const signature=JSON.stringify(payload);let attempt:{signature:string;key:string}|undefined;try{attempt=JSON.parse(sessionStorage.getItem('ua-order-attempt')||'null')}catch{}
      if(!attempt||attempt.signature!==signature)attempt={signature,key:crypto.randomUUID()};sessionStorage.setItem('ua-order-attempt',JSON.stringify(attempt));
      const response=await fetch('/api/shop/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,idempotencyKey:attempt.key})});
      const result=await response.json() as ShopOrder & {order?:ShopOrder;error?:string};
      if(!response.ok){try{const fresh=await fetch('/api/shop/catalog',{cache:'no-store'});if(fresh.ok)setCatalog(await fresh.json() as Catalog);}catch{}throw Error(result.error||'Nie udało się zapisać zamówienia.');}
      const saved=result.order||result;if(saved.stockRestored||saved.status==='cancelled'){sessionStorage.removeItem('ua-order-attempt');throw Error('Rezerwacja wygasła. Kliknij ponownie, aby złożyć zamówienie.');}
      if(payment==='stripe'){const pay=await fetch('/api/shop/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:saved.id,token:saved.token})});const next=await pay.json() as {url?:string;error?:string};if(!pay.ok||!next.url)throw Error(next.error||'Zamówienie zapisane, ale nie udało się otworzyć płatności.');window.location.assign(next.url);return;}
      setItems([]);
    }catch(e){setError(e instanceof Error?e.message:'Błąd zamówienia.')}finally{submitting.current=false;setBusy(false)}
  }
  async function retryPayment(){if(!order?.token||busy||submitting.current)return;submitting.current=true;setBusy(true);setError('');try{const r=await fetch('/api/shop/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:order.id,token:order.token})});const d=await r.json() as {url?:string;error?:string};if(!r.ok||!d.url)throw Error(d.error||'Nie można rozpocząć płatności.');location.assign(d.url);}catch(e){setError(e instanceof Error?e.message:'Nie można rozpocząć płatności.');}finally{submitting.current=false;setBusy(false)}}

  return <><ShopHeader/><main className="section shop-checkout"><div className="checkout-top"><span className="eyebrow">ULICZNY ABSURD / ZAMÓWIENIE</span><div className="checkout-steps" aria-label="Etapy zamówienia"><span className="done"><b>01</b>Koszyk</span><span className={order?'done':'active'}><b>02</b>Dostawa i płatność</span><span className={order?'active':''}><b>03</b>Potwierdzenie</span></div></div>
  {order&&error&&<p className="error" role="alert">{error}</p>}
  {loadingOrder?<p role="status">Wczytujemy zamówienie…</p>:order?<Confirmation order={order} busy={busy} retryPayment={retryPayment}/>:<>
    <div className="checkout-heading"><div><h1>JESZCZE CHWILA.<br/>I NOSISZ ABSURD.</h1><p>Sprawdź dane i wybierz dostawę. Przed złożeniem zamówienia zobaczysz pełną kwotę.</p></div></div>

    {catalogReady&&!catalog.configured&&<p className="error">Sklep oczekuje na konfigurację bazy danych. Zamówienia są tymczasowo niedostępne.</p>}
    {catalogReady&&!test&&!Boolean(settings.salesActive)&&<p className="form-notice">Zamówienia są chwilowo niedostępne. Skontaktuj się z nami: <a href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com</a>.</p>}
    {!ready||!catalogReady?<p role="status">Wczytywanie sklepu i koszyka…</p>:!items.length?<div className="checkout-empty"><ShoppingBag size={46}/><h2>Koszyk jest pusty.</h2><Link className="button dark" href="/#kolekcja">Wybierz koszulkę</Link></div>:<div className="shop-checkout-grid">
      <form className="checkout-form" onSubmit={submit}>
        <section className="checkout-card"><div className="checkout-card-title"><span>01</span><div><h2>Dane do dostawy</h2><p>Wybierz kraj, aby poznać koszt dostawy.</p></div></div>
          <div className="form-row"><label>Imię<input name="firstName" required minLength={2} maxLength={80} autoComplete="given-name"/></label><label>Nazwisko<input name="lastName" required minLength={2} maxLength={80} autoComplete="family-name"/></label></div>
          <div className="form-row"><label>E-mail<input name="email" type="email" required maxLength={200} autoComplete="email"/></label><label>Telefon<input name="phone" type="tel" required pattern="[+0-9 ()\-]{7,20}" autoComplete="tel"/></label></div>
          <CountryPicker country={destinationCountry} onChange={setDestinationCountry}/>
        </section>

        <section className="checkout-card"><div className="checkout-card-title"><span>02</span><div><h2>Dostawa</h2><p>{abroad?`Wysyłka do: ${deliveryCountryName(destinationCountry)}.`:"Wybierz wygodny sposób odbioru."}</p></div></div>
          {abroad?<div className="international-delivery"><PackageCheck size={25}/><span><strong>Dostawa za granicę</strong><small>Kurier międzynarodowy</small></span><b>{money(shipping)}</b></div>:<div className="choice-grid" role="radiogroup" aria-label="Metoda dostawy">
            {courierActive&&<Choice checked={delivery==='courier'} onChange={()=>setDelivery('courier')} name="delivery" value="courier" title="Kurier InPost" meta={`Standardowo ${money(shippingTotal(settings,'courier','stripe',test))}`} icon={<PackageCheck/>}/>}
            {lockerActive&&<Choice checked={delivery==='locker'} onChange={()=>setDelivery('locker')} name="delivery" value="locker" title="Paczkomat® InPost" meta={`Standardowo ${money(shippingTotal(settings,'locker','stripe',test))}`} icon={<MapPin/>}/>}
          </div>}
          
          {!abroad&&!courierActive&&!lockerActive&&<p className="error">Sprzedawca nie aktywował jeszcze żadnej zweryfikowanej metody dostawy.</p>}
          {selectedDelivery==='locker'?<LockerPicker/>:<label>Ulica, numer budynku / lokalu<input name="street" required maxLength={200} autoComplete="street-address"/></label>}
          <div className="form-row"><label>Kod pocztowy<input name="postalCode" required pattern={abroad?undefined:'[0-9]{2}-[0-9]{3}'} placeholder={abroad?'Kod pocztowy':'00-000'} maxLength={abroad?20:6} autoComplete="postal-code"/></label><label>Miasto<input name="city" required minLength={2} maxLength={100} autoComplete="address-level2"/></label></div>
          <label>Uwagi do zamówienia <small>(opcjonalnie)</small><textarea name="notes" maxLength={2000} rows={3}/></label>
          <details className="checkout-details"><summary>Dane do dokumentu sprzedaży (opcjonalnie)</summary><label>Nazwa / dane i adres; identyfikator podatkowy, jeżeli dotyczy<textarea name="invoice" maxLength={1000} rows={3}/></label></details>
        </section>

        <section className="checkout-card checkout-legal"><div className="checkout-card-title"><span>03</span><div><h2>Przed zamówieniem</h2><p>Najważniejsze informacje o sprzedawcy i umowie.</p></div></div>
          <div className="seller-box"><strong>ULICZNY ABSURD — Paweł Duszyński</strong><span>ul. Północna 24/2, 44-335 Jastrzębie-Zdrój</span><a href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com</a>{settings.sellerPhone?<a href={`tel:${String(settings.sellerPhone)}`}>{String(settings.sellerPhone)}</a>:<span className="seller-missing">Telefon zostanie uzupełniony przed uruchomieniem sprzedaży.</span>}</div>
          <p>Czas realizacji: 7 dni roboczych. Do tego należy doliczyć czas transportu. Standardowe koszulki z gotowym wzorem podlegają ustawowemu prawu odstąpienia na zasadach opisanych w <Link href="/zwroty" target="_blank">informacji o zwrotach</Link>.</p>
<label className="shop-checkbox"><input type="checkbox" name="acceptedTerms" required/><span>Zapoznałem/am się z <Link href="/regulamin" target="_blank">regulaminem sklepu</Link> i akceptuję jego warunki. <Link href="/prywatnosc" target="_blank">Polityka prywatności</Link> zawiera informacje o przetwarzaniu danych.</span></label>
        </section>
        <div className="summary-note"><Check size={18}/><p><strong>BEZPIECZNA PŁATNOŚĆ</strong><br/>Po złożeniu zamówienia przejdziesz bezpośrednio do bezpiecznej płatności Stripe.</p></div>
        {error&&<p className="error" role="alert">{error}</p>}
        <button className="button dark checkout-submit" disabled={busy||!checkoutAvailable} type="submit">{busy?'Przechodzę do płatności…':'Złóż zamówienie z obowiązkiem zapłaty'}</button>
        {!checkoutAvailable&&<p className="checkout-help">{abroad?'Zamówienie zagraniczne będzie dostępne po potwierdzeniu przewoźnika i uruchomieniu płatności online.':'Przycisk pozostaje nieaktywny, dopóki sklep, dostawa i wybrana płatność nie są rzeczywiście dostępne.'}</p>}
      </form>

      <aside className="shop-order-summary" aria-label="Podsumowanie zamówienia"><span className="eyebrow">TWOJE ZAMÓWIENIE</span><div className="summary-items">{items.map(i=>{const p=catalog.products.find(p=>p.id===i.id);return <div className="summary-item" key={i.id+i.size}>{p&&<img src={p.image} alt=""/>}<div><h3>{p?.name||'Produkt'}</h3><p>Rozmiar {i.size} · {i.quantity} szt.</p><strong>{p&&priceOf(p)!=null?money(i.quantity*priceOf(p)!):'Cena do potwierdzenia'}</strong></div></div>})}</div><div className="summary-lines"><p><span>Produkty</span><strong>{money(subtotal)}</strong></p><p><span>{abroad?'Dostawa za granicę':'Dostawa InPost'}</span><strong>{money(shipping)}</strong></p><p className="summary-total"><span>Razem</span><strong>{money(subtotal+shipping)}</strong></p></div><div className="summary-note"><Check size={18}/><p>{abroad?'Kwota dostawy zagranicznej jest uwzględniona w podsumowaniu.':'Pełna kwota za produkty i dostawę. Bez dodatkowej opłaty za płatność.'}</p></div></aside>
    </div>}
  </>}</main></>;
}

function Choice({checked,onChange,name,value,title,meta,icon}:{checked:boolean;onChange:()=>void;name:string;value:string;title:string;meta:string;icon:React.ReactNode}){return <label className={`checkout-choice ${checked?'selected':''}`}><input type="radio" name={name} value={value} checked={checked} onChange={onChange}/><span className="choice-icon">{icon}</span><span><strong>{title}</strong><small>{meta}</small></span><i aria-hidden="true">{checked?'✓':''}</i></label>}

function Confirmation({order,busy,retryPayment}:{order:ShopOrder;busy:boolean;retryPayment:()=>void}){
  const paid=order.paymentStatus==='paid';
  const cancelled=order.status==='cancelled'||['failed','expired'].includes(order.paymentStatus)||(typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('payment')==='cancelled');
  return <section className="shop-confirmation">
    {paid&&<div className="confirmation-mark"><Check size={40}/></div>}
    <span className="eyebrow">ULICZNY ABSURD / TWOJE ZAMÓWIENIE</span>
    <h1>{paid?'DZIĘKI. MAMY TO.':cancelled?'PŁATNOŚĆ NIE ZOSTAŁA ZAKOŃCZONA':'Potwierdzamy płatność…'}</h1>
    {!paid&&!cancelled&&<p role="status">Czekamy na potwierdzenie płatności przez Stripe. Status odświeży się automatycznie. Nie zamawiaj ponownie.</p>}
    {paid&&<p>Płatność potwierdzona. Teraz zajmiemy się realizacją Twojego zamówienia.</p>}
    <p className="confirmation-number">Numer zamówienia <strong>{order.number}</strong></p>
    <div className="confirmation-grid"><div><small>Płatność</small><strong>Online przez Stripe</strong><span>{statusLabel[order.paymentStatus]||order.paymentStatus}</span></div><div><small>Kwota</small><strong>{money(order.total)}</strong><span>{paid?'zapłacono':'do zapłaty online'}</span></div><div><small>Dostawa</small><strong>{order.delivery==='locker'?'Paczkomat® InPost':order.delivery==='courier'?'Kurier InPost':'Kurier międzynarodowy'}</strong><span>{statusLabel[order.shippingStatus]||order.shippingStatus}</span></div></div>
    {order.paymentStatus==='unpaid'&&order.status!=='cancelled'&&!order.stockRestored&&<button className="button dark" disabled={busy} onClick={retryPayment}>{busy?'Przechodzę do płatności…':'Ponów płatność'}</button>}
    {order.stockRestored&&!paid&&<p>Rezerwacja wygasła. Możesz wrócić do sklepu i złożyć nowe zamówienie.</p>}
    {paid&&<p>{order.notificationStatus==='sent'?'Informacje o zamówieniu wysłaliśmy e-mailem.':'Potwierdzenie płatności wyślemy e-mailem.'} Czas realizacji: {order.fulfillmentDays||7} dni roboczych, następnie transport.</p>}
    <div className="confirmation-items">{order.items.map(i=><div className="summary-item" key={i.id+i.size}><img src={i.image} alt=""/><div><h3>{i.name}</h3><p>Rozmiar {i.size} · {i.quantity} szt.</p><strong>{money(i.price*i.quantity)}</strong></div></div>)}</div>
    <div className="summary-lines"><p><span>Produkty</span><strong>{money(order.subtotal)}</strong></p><p><span>Dostawa</span><strong>{money(order.shipping)}</strong></p><p className="summary-total"><span>Razem</span><strong>{money(order.total)}</strong></p></div>
    <Link href="/#kolekcja" className="button dark">Wróć do sklepu</Link>
  </section>;
}
