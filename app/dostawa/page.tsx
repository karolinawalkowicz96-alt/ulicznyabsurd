import { LegalPage } from '@/components/legal/LegalPage';
import { getSettings } from '@/lib/shop-service';
import { money } from '@/lib/catalog';
import type { Metadata } from 'next';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Dostawa i płatności',alternates:{canonical:'/dostawa'}};
export default async function Page(){
 const s=await getSettings();
 const cod=s.codActive&&((s.courierActive&&s.courierCodConfirmed)||(s.lockerActive&&s.lockerCodConfirmed));
 return <LegalPage title="Dostawa i płatności"><h2>Koszty dostawy w Polsce</h2><table><thead><tr><th>Metoda</th><th>Cena</th></tr></thead><tbody>{s.lockerActive&&s.lockerPrice!==null&&<tr><td>Automat paczkowy</td><td>{money(s.lockerPrice)}</td></tr>}{s.courierActive&&s.courierPrice!==null&&<tr><td>Kurier</td><td>{money(s.courierPrice)}</td></tr>}</tbody></table><p>Dostarczamy na terenie Polski. Pełny koszt produktów, dostawy i płatności zobaczysz przed złożeniem zamówienia.</p><h2>Czas realizacji</h2><p>Zamówienia realizujemy w ciągu <strong>{s.fulfillmentDays} dni roboczych</strong>. Do tego należy doliczyć czas transportu przewoźnika.</p><h2>Płatności</h2>{cod?<p>Za zamówienie możesz zapłacić przy odbiorze. Pobranie jest dostępne przy metodach dostawy oznaczonych w koszyku.{s.codSurcharge>0?` Dopłata za pobranie wynosi ${money(s.codSurcharge)}.`:' Nie doliczamy osobnej opłaty za pobranie.'}</p>:<p>Aktualną dostępność płatności sprawdzisz w koszyku. W sprawie zamówienia skontaktuj się z nami.</p>}{s.stripeActive&&<p>Płatności online obsługuje Stripe. Dostępne metody pokaże formularz płatności. Sklep nie przechowuje pełnych danych karty.</p>}<h2>Adres i śledzenie</h2><p>Dla kuriera podaj pełny adres. Dla automatu paczkowego potrzebujemy identyfikatora punktu, adresu e-mail i telefonu. Po nadaniu przesyłki otrzymasz informacje o wysyłce.</p><p>Masz pytania? Napisz na <a href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com</a> lub zadzwoń: <a href="tel:+48513258296">+48 513 258 296</a>.</p></LegalPage>;
}
