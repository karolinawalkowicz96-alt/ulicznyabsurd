# Raport wykonanych testów — 19 października 2026

## Wykonane i zakończone powodzeniem

`node scripts/test.mjs`: **22 testy, 22 zaliczone, 0 błędów, 0 pominiętych**. Ostatni przebieg: około 6,7 s. Testy znajdują się w `tests/unit.test.ts` oraz `tests/integration.test.ts`.

- Koszyk: różne produkty i rozmiary, łączenie ilości, odrzucanie błędnych danych.
- Hasła: losowa sól, weryfikacja poprawnego hasła, odrzucenie błędnego/nieprawidłowego hasha.
- Ochrona Origin, walidacja danych klienta, wymagany regulamin, rozmiary S–XXL.
- Zamówienie z dwiema koszulkami, ilości 2 i 1, dostawa 18,99 zł, suma 405,99 zł; trwały zapis w tabeli, numer TEST, pobranie nieopłacone.
- Powtórzenie identycznego zamówienia, odrzucenie zmienionych danych przy tym samym kluczu idempotencji.
- Błędny kod pocztowy, kraj/metoda dostawy, brak paczkomatu, brak rozmiaru, niedostępny produkt, pusty koszyk.
- Dwa równoczesne wywołania kupujące ostatnią sztukę: przyjęto jedno zamówienie, stan 0. Ograniczenie adaptera opisane niżej.
- Wycofanie transakcji po niepowodzeniu kolejnej pozycji, bez utraty stanu.
- Pobieranie aktualnej ceny z serwera i niezmienność zapisanej ceny wcześniejszego zamówienia.
- Blokada produkcyjnej sprzedaży bez potwierdzonej dostawy/uzupełnionego katalogu.
- Logowanie, sesja administratora, wygasła sesja, brak sesji oraz trwały limit prób.
- Osiem produktów, pięć wariantów, brak wymyślonych rzeczywistych stanów magazynowych.
- Zmiana na „W realizacji”, wysyłka wymagająca numeru i przewoźnika, historia, pobranie nadal nieopłacone.
- Anulowanie zwraca stan dokładnie raz i uniemożliwia ponowne otwarcie.
- Awaria poczty zachowuje zamówienie; ponowienie używa tego samego klucza idempotencji dostawcy.
- Zmieniona suma checkoutu wymaga ponownego potwierdzenia; nieudana próba nie zmniejsza zapasu.
- Wyłączony Stripe i zagraniczne pobranie są odrzucane.
- Stripe HMAC: poprawny podpis, zmiana treści, zły sekret i przeterminowany timestamp.
- Stripe: dopasowanie kwoty/sesji, tylko faktyczne zdarzenie paid zmienia płatność, duplikat ignorowany.
- Wygaśnięcie Stripe zwraca magazyn dokładnie raz.

Pełny `npm run typecheck`: zaliczony. Pełny `npm run lint`: kod 0, bez błędów, 13 ostrzeżeń o natywnych elementach `<img>`. Obrazy wejściowe są lokalnymi WebP; nie deklarujemy pomiaru LCP. Produkcyjny `npm run build`: zakończony powodzeniem na Next.js 16.3.4. Nie skonfigurowano produkcyjnej bazy ani kont usług; build bez tych kluczy jest wspierany.

Dodatkowy test regresji potwierdza, że cofnięcie statusu wysłanego zamówienia nie umożliwia anulowania z ponownym przywróceniem zapasu.

## Granice tej weryfikacji

Integracja działała na silniku PostgreSQL PGlite/WASM w procesie Node. Adapter szereguje transakcje i omija blokadę advisory; **nie wykonano testu rzeczywistej wielopołączeniowej konkurencji na serwerze PostgreSQL**. Kod testów wspiera `TEST_DATABASE_URL` do osobnej, pustej bazy — czyści jej tabele sklepu. Nigdy nie używać bazy produkcyjnej.

Testy usług wywołują bezpośrednio logikę używaną przez API. Nie jest to test działającej sieci HTTP/Next.js. Testy poczty i zdarzeń Stripe używały kontrolowanych danych/mocka, **nie wysłano e-maili i nie wykonano rzeczywistej płatności ani połączenia ze Stripe**. Wymagane są oddzielne testy integracji po ustawieniu prawdziwych kluczy testowych.

## Przygotowane, lecz niewykonane

Testy Playwright `tests/e2e/shop.spec.ts` i `playwright.config.ts`: scenariusz pełnego zakupu, trwałość po odświeżeniu, formularze, pusty koszyk, niezalogowane API administratora, canonical, tabela rozmiarów, podstawowy overflow i błędy JavaScript. Szerokości 320, 375, 390, 768, 1024, 1440, 1920 px.

**Nie uruchomiono przeglądarki** — brak dostępnego wymaganego kontrolera przeglądarki w środowisku wykonania. Nie zaliczamy E2E, wizualnej responsywności, konsoli przeglądarki, CWV ani pełnego audytu dostępności. Uruchomienie u właściciela opisuje `tests/README.md`.
