export const dynamic='force-dynamic';
import {LegalPage,Seller} from '@/components/legal/LegalPage';
export const metadata={title:'Informacje o sprzedawcy',alternates:{canonical:'/sprzedawca'}};
export default function Page(){return <LegalPage title="Kto stoi za sklepem"><Seller/><p>ULICZNY ABSURD jest marką sklepu. Sprzedaż prowadzi wskazana osoba fizyczna w ramach działalności nierejestrowanej. Nie przedstawiamy jej jako spółki ani podmiotu wpisanego do CEIDG. Nie podajemy nieprzydzielonych numerów NIP, REGON czy KRS.</p><p>Domena sklepu: <a href="https://www.ulicznyabsurd.pl">www.ulicznyabsurd.pl</a>. Informacje o prawach kupującego, realizacji zakupów i ochronie danych są dostępne w dokumentach poniżej.</p></LegalPage>}
