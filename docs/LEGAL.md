# Prawo i gotowość do sprzedaży — 19.10.2026

Przygotowano podstrony `/regulamin`, `/prywatnosc`, `/cookies`, `/dostawa`, `/zwroty`, `/reklamacje`, `/kontakt`, `/sprzedawca`, `/odstapienie`. Sprzedawca: Paweł Duszyński, ul. Północna 24/2, 44-335 Jastrzębie-Zdrój, Polska; działalność nierejestrowana; ulicznyabsurd@gmail.com. Nie dodano fikcyjnego NIP, REGON, CEIDG ani KRS. Dokumenty są projektem dostosowanym do implementacji, nie opinią prawną ani gwarancją kompletnej zgodności. Przed publicznym uruchomieniem wymagają kontroli wraz z rzeczywistą konfiguracją usług i towarów.

## Obowiązkowe działania właściciela przed sprzedażą

1. Uzupełnić prawdziwy numer telefonu sprzedawcy (`sellerPhone`) i realny maksymalny termin dostawy obejmujący przygotowanie i transport (`fulfillmentDays`, dni kalendarzowe). Są prezentowane w dokumentach. Potwierdzić adres przyjmowania reklamacji i zwrotów. Nie aktywować sprzedaży z pustymi danymi.
2. Uzupełnić prawdziwe ceny, fizyczne stany każdego rozmiaru, skład włókien i instrukcję pielęgnacji. Usunąć wszelkie niepotwierdzone obietnice jakości lub pochodzenia. Dla każdej oferty wymagana identyfikacja producenta, jego adres pocztowy i elektroniczny, identyfikator produktu, zdjęcie oraz stosowne ostrzeżenia. Jeśli producent spoza UE: również właściwy podmiot odpowiedzialny w UE. Zweryfikować, czy umieszczanie własnej marki powoduje obowiązki producenta. Sam wpis sprzedawcy w stopce nie załatwia GPSR.
3. Zweryfikować dokumentację bezpieczeństwa, identyfikowalność, oznakowanie i skład tekstyliów (rozporządzenie 1007/2011); utrzymywać procedurę zgłoszeń niebezpiecznych produktów, wycofania i kontaktu z nabywcami. Nie wymyślać certyfikatów ani ostrzeżeń bez analizy produktu.
4. Zawrzeć rzeczywistą umowę przewozu, potwierdzić COD dla każdej usługi, limity kwot, dopłaty, paliwo i terminy rozliczenia. Stawki 14,99 / 18,99 / 99,00 zł pochodzą od właściciela i są cenami dla klienta, nie ofertą przewoźnika. Dopłatę COD trzeba uwzględnić jawnie przed zakupem. Nie aktywować zagranicznego pobrania bez potwierdzenia konkretnego kierunku i usługi.
5. Skonfigurować pocztę transakcyjną i trwały zapis zamówienia. Warunki umowy i pouczenie trzeba przekazać na trwałym nośniku — sam link do zmiennej strony nie wystarcza. `lib/legal-contract.ts` jest wersjonowanym tekstem do dołączenia do potwierdzenia. Przy zmianie stron zaktualizować snapshot. Nie zmieniać retrospektywnie warunków istniejących zamówień. Sprawdzić rzeczywisty załącznik i odbiór poczty, utrzymywać ponowienia błędów.
6. RODO: wybrać faktycznych dostawców bazy i storage, regiony i podwykonawców. Zweryfikować umowy powierzenia Vercel, bazy, Resend i pozostałych usług, podstawy transferów poza EOG, zakres logów i retencję. Uzupełnić politykę o ostatecznie używanych dostawców i rzeczywiste okresy usuwania. Nie uznawać samego hasła „SCC” za zakończoną ocenę transferu. Skonfigurować procedurę realizacji praw, incydentów, kopii i usuwania danych. Zwykła skrzynka Gmail wymaga oceny warunków przetwarzania danych klienta.
7. W tej wersji brak newslettera i dodatkowej analityki: nie dodawać obowiązkowych zgód marketingowych ani zgody na wykonanie umowy. Jeżeli dodasz piksele, analitykę lub osadzenia śledzące, zablokuj je do uzyskania właściwej zgody i zapewnij łatwą odmowę/wycofanie.
8. Sprawdzić własne uprawnienie do działalności nierejestrowanej, historię działalności, ewidencję, PIT, VAT, kasę fiskalną, dokumenty na żądanie, ewentualne obowiązki opakowaniowe/BDO i sprzedaż za granicę. Brak rejestracji nie oznacza zwolnienia ze wszystkich obowiązków. Panel nie zastępuje księgowości.
9. Dopiero po kontroli powyższych punktów zaznaczyć `legalReady`, przełączyć tryb TEST i aktywować sprzedaż. Sam checkbox nie jest potwierdzeniem przez prawnika.

## Ustalenia z oficjalnych źródeł

- Działalność nierejestrowana: od 2026 r. próg kwartalny 225% minimalnego wynagrodzenia; 10 813,50 zł przy 4 806 zł. Weryfikować warunki osobowe, okres 60 miesięcy i konsekwencje przekroczenia. Przychód należny do limitu oraz otrzymany dla rozliczenia podatku nie są automatycznie tą samą wartością. Anulowanie/zwrot wymaga oceny rzeczywistego zdarzenia, nie tylko sumowania statusów.
- Konsument: 14 dni na odstąpienie od zakupu internetowego; standardowy nadruk nie jest automatycznie personalizacją. Reklamacja z niezgodności jest odrębna od zwykłego zwrotu. Koszt reklamacji i transportu nie może być dowolnie przerzucany na kupującego.
- InPost potwierdza możliwość odbioru krajowej przesyłki pobraniowej w automacie po opłaceniu m.in. BLIKIEM/aplikacją. To nie dowód, że konkretne konto nadawcy posiada usługę w danej cenie. Oficjalna strona cenników zawiera cenniki od 1 marca 2026 r.; indywidualnych warunków umowy sprzedawcy nie dostarczono.
- Stripe SSA dopuszcza działalności, w tym sole proprietor. Nie znaleziono jednoznacznego publicznego potwierdzenia, że każda polska działalność nierejestrowana może przejść onboarding jako osoba fizyczna bez dodatkowych danych podatkowych/rejestracyjnych. Przykład amerykański EIN/SSN nie stanowi dowodu dla Polski. Właściciel musi uzyskać potwierdzenie Stripe, prawidłowo opisać swoją sytuację i przejść weryfikację KYC. Nie wpisywać fikcyjnego NIP ani przedstawiać się jako spółka. Do tego czasu Stripe pozostaje wyłączony.
- GPSR obejmuje informacje w ofertach na odległość (art. 19). To obowiązki dodatkowe względem regulaminu.

## Źródła sprawdzone 19.10.2026

Dostęp i indeksy wyszukiwania nie stanowią gwarancji, że wychwycono każdą zmianę prawa. Przed startem ponownie sprawdzić teksty aktualne i zakres obowiązywania.

- Ustawa o prawach konsumenta, tekst ELI: https://eli.gov.pl/api/acts/DU/2024/1796/text.html
- UOKiK, niezgodność towaru: https://prawakonsumenta.uokik.gov.pl/reklamacja/niezgodnosc/
- UOKiK, terminy odstąpienia: https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/terminy-odstapienie/
- UOKiK, skutki i zwroty: https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/skutek/
- UOKiK, informacje przed zakupem: https://prawakonsumenta.uokik.gov.pl/prawo-do-informacji/sprzedaz-poza-lokalem-i-na-odleglosc/
- Biznes.gov.pl, działalność nierejestrowana: https://biznes.gov.pl/pl/firma/zakladanie-firmy/chce-wiedziec-jak-zalozyc-wlasna-firme/dzialalnosc-nierejestrowa-oraz-inne-sytuacje-w-ktorych-nie-trzeba-rejestrowac-firmy
- Ministerstwo Finansów: https://podatki.gov.pl/poradniki-i-informatory/dzialalnosc-nierejestrowana
- UODO, obowiązek informacyjny: https://uodo.gov.pl/pl/676/4255
- UODO, prawa osoby: https://uodo.gov.pl/pl/493/2254
- GPSR, EUR-Lex (wskazuje również wersję skonsolidowaną 29.05.2026): https://eur-lex.europa.eu/eli/reg/2023/988/oj/eng
- GPSR, wersja skonsolidowana: https://eur-lex.europa.eu/eli/reg/2023/988/2026-05-29/eng/pdf
- InPost, odbiór pobrania: https://inpost.pl/pomoc-jak-odebrac-przesylke-pobraniowa-z-automatu-paczkomatpaczkopunktu
- InPost, cenniki: https://inpost.pl/cenniki
- InPost, aktualizacja 2026: https://inpost.pl/aktualnosci-aktualizacja-cennikow-inpost-od-1-marca-2026-r
- Stripe, umowa dla Polski: https://stripe.com/en-pl/legal/ssa
- Stripe, warunki usług: https://stripe.com/legal/ssa-services-terms

## Ograniczenia weryfikacji

Nie udostępniono umowy z przewoźnikiem, konta Stripe, dokumentacji producentów, fizycznych towarów, danych podatkowych sprzedawcy ani konfiguracji produkcyjnych podwykonawców. Nie można więc potwierdzić kwalifikacji Stripe, pełnej zgodności produktu, faktycznej dostępności COD ani pełnej zgodności prawno-podatkowej działającej sprzedaży. Tryb TEST jest celowy i nie obchodzi tych braków.
