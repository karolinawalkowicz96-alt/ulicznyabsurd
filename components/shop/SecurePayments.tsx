import Image from 'next/image';
import { LockKeyhole, ArrowUpRight } from 'lucide-react';

// Methods verified against this shop's live Stripe configuration.
// Wallet eligibility is determined by Stripe, not by a selector in this form.
const marks = [
  {name:'BLIK',file:'blik'},
  {name:'Visa',file:'visa'},
  {name:'Mastercard',file:'mastercard'},
  {name:'Apple Pay',file:'apple-pay'},
  {name:'Link',file:'link'},
  {name:'Klarna',file:'klarna'},
];

export default function SecurePayments(){
  return <section className="secure-payments" aria-labelledby="secure-payments-title">
    <div className="secure-payments-heading">
      <span className="secure-payments-lock" aria-hidden="true"><LockKeyhole size={23} strokeWidth={1.8}/></span>
      <div><span className="secure-payments-kicker">TWÓJ WYBÓR. BEZPIECZNY CHECKOUT.</span><h2 id="secure-payments-title">Bezpieczne płatności</h2></div>
      <span className="secure-payments-stripe">przez <strong>Stripe</strong><ArrowUpRight size={15} aria-hidden="true"/></span>
    </div>
    <p className="secure-payments-intro">Zamów. Wybierz, jak płacisz. Gotowe.</p>
    <ul className="secure-payments-marks" aria-label="Obsługiwane metody płatności">
      {marks.map(mark=><li key={mark.file} className={`payment-mark payment-mark-${mark.file}`}><Image src={`/payments/${mark.file}.svg`} alt={mark.name} width={96} height={40} unoptimized/></li>)}
    </ul>
    <p className="secure-payments-note">Po złożeniu zamówienia przejdziesz bezpośrednio do Stripe. Dostępne metody zobaczysz tam — zależą m.in. od urządzenia, przeglądarki i kwalifikacji płatności.</p>
  </section>;
}
