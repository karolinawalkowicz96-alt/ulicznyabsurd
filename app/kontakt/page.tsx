export const dynamic='force-dynamic';
import {LegalPage,Seller} from '@/components/legal/LegalPage';
export const metadata={title:'Kontakt | ULICZNY ABSURD',alternates:{canonical:'/kontakt'}};
export default function Page(){return <LegalPage title="Pogadajmy"><Seller/><p>Masz pytanie o rozmiar, przesyłkę lub zamówienie? Napisz do nas. Przy sprawach dotyczących zakupu podaj numer zamówienia, jeśli go masz. Nie wysyłaj danych karty, haseł ani dokumentów tożsamości.</p><p>Adres służy również do korespondencji, zwrotów i reklamacji. Nie deklarujemy punktu odbioru osobistego ani sklepu stacjonarnego.</p></LegalPage>}
