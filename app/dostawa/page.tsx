import { LegalPage, legalSettings } from '@/components/legal/LegalPage';
import { money } from '@/lib/catalog';
import { shippingTotal } from '@/lib/shop-shipping';
import type { Metadata } from 'next';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Dostawa InPost i płatności',alternates:{canonical:'/dostawa'}};
export default async function Page(){
 const s=await legalSettings();
 return <LegalPage title="Dostawa i płatności">
 <h2>InPost — wybierz swój sposób odbioru</h2><p>W Polsce dostarczamy do automatu Paczkomat® InPost lub kurierem InPost pod wskazany adres. Produkty i dostawę opłacasz online przez Stripe.</p>
 <table><thead><tr><th>Metoda</th><th>Koszt dostawy</th></tr></thead><tbody>{s.lockerActive&&<tr><td>Paczkomat® InPost</td><td>{money(shippingTotal(s,'locker','stripe'))}</td></tr>}{s.courierActive&&<tr><td>Kurier InPost</td><td>{money(shippingTotal(s,'courier','stripe'))}</td></tr>}</tbody></table>
 <p>Pełną kwotę za produkty i dostawę zobaczysz przed złożeniem zamówienia. Nie oferujemy płatności za pobraniem.</p>
 <h2>Płatność online przez Stripe</h2><p>Po sprawdzeniu danych i zaakceptowaniu regulaminu kliknij „Złóż zamówienie z obowiązkiem zapłaty”. Przeniesiemy Cię do Stripe, gdzie wybierzesz spośród metod dostępnych dla Twojej transakcji. Po zakończeniu wrócisz do podsumowania zamówienia. Status opłacenia pojawi się po potwierdzeniu przez operatora. Jeśli przerwiesz płatność, możesz wrócić do niej z podsumowania zamówienia przed upływem sesji płatniczej.</p>
 <h2>Jak wybrać Paczkomat®?</h2><p>W formularzu zamówienia wybierz Paczkomat® InPost. Otwórz mapę InPost, znajdź automat, skopiuj jego kod i wpisz go w zamówieniu. Mapa otworzy się w nowej karcie, a koszyk pozostanie zapisany.</p>
 <h2>Dostawa za granicę</h2><p>Koszt dostawy zagranicznej wynosi 119,00 zł. Zamówienia zagraniczne są dostępne wyłącznie po potwierdzeniu obsługi kraju przez sprzedawcę. Jeśli dostawa jest nieaktywna, formularz nie pozwoli złożyć zamówienia.</p>
 <h2>Czas realizacji</h2><p>Zamówienia realizujemy w ciągu {s.fulfillmentDays} dni roboczych. Do tego należy doliczyć czas transportu przewoźnika. Przesyłkę nadajemy po potwierdzeniu płatności.</p>
 <h2>Adres i śledzenie</h2><p>Dla kuriera podaj pełny adres. Dla automatu Paczkomat® podaj jego kod, e-mail i telefon. Po nadaniu rzeczywistego zamówienia otrzymasz informacje o wysyłce.</p>
 <p>Masz pytania? <a href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com</a> · <a href="tel:+48513258296">+48 513 258 296</a>.</p>
 </LegalPage>;
}
