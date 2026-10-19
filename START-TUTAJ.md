# ULICZNY ABSURD — zacznij tutaj

To rozbudowa istniejącego projektu, z zachowaniem identyfikacji, hero, animowanego logo, układu kolekcji i lookbooka. Pakiet nie został opublikowany na Twoim GitHubie ani Vercel. Zanim pojawią się prawdziwe zamówienia, trzeba podłączyć PostgreSQL, pocztę i uzupełnić rzeczywiste dane sklepu.

## 1. Uruchomienie na komputerze

1. Rozpakuj ZIP do nowego folderu. Zachowaj kopię poprzedniego projektu.
2. Zainstaluj Node.js 22.13 lub nowszy (zalecana aktualna wersja 22 LTS).
3. Otwórz Terminal w folderze, w którym jest `package.json`.
4. Uruchom `npm ci`.
5. Skopiuj `.env.example` jako `.env.local`. W macOS możesz użyć `cp .env.example .env.local`; pliki z kropką są domyślnie ukryte.
6. Uruchom `npm run dev` i otwórz `http://localhost:3000`.

Bez bazy obejrzysz stronę i produkty, ale zamówienia i panel nie zapiszą danych. To celowa blokada, a nie pozorna sprzedaż. Całe wdrożenie używa Next.js; dawne polecenia Cloudflare/Vinext nie są ścieżką uruchomienia.

## 2. Baza PostgreSQL

Utwórz bazę PostgreSQL u dostawcy kompatybilnego z Vercel, np. poprzez Marketplace projektu. Wybierz właściwy region i zasady kopii zapasowych. Skopiuj pełny connection string do `DATABASE_URL` w `.env.local`. W produkcji wymagaj SSL zgodnie z instrukcją dostawcy. Nie umieszczaj połączenia w kodzie ani w zmiennych `NEXT_PUBLIC_*`.

Baza testowa musi być osobna od produkcyjnej. Nie podłączaj testów resetujących tabele do bazy prawdziwych zamówień.

## 3. Pierwszy administrator

W `.env.local` wpisz własny `ADMIN_EMAIL` oraz mocne, nieużywane gdzie indziej `ADMIN_PASSWORD` (minimum 14 znaków). Nie ma domyślnego loginu ani hasła.

Uruchom:

```sh
npm run db:setup
```

Polecenie tworzy tabele i 8 produktów oraz administratora. Istniejących produktów ani zamówień nie usuwa. Ponowienie z tym samym e-mailem zmienia hasło administratora. Następnie usuń `ADMIN_PASSWORD` z pliku. Uruchom ponownie serwer i otwórz `/admin`.

Domyślne ustawienia to TEST, wyłączona sprzedaż rzeczywista, pobranie aktywne w TEST i wyłączony Stripe. Każdy rozmiar ma osobny testowy zapas 100 sztuk. Fizyczne stany są puste. Brakujące ceny mają wyłącznie testową wartość 129 zł, jawnie oznaczoną. Nie są to ceny ani deklaracje dostępności prawdziwych produktów.

## 4. Produkty, ceny, stany i zdjęcia

W `/admin` wybierz Produkty i otwórz koszulkę. Ustaw cenę w złotych, zatwierdź ją i wpisz fizyczny stan S, M, L, XL, XXL. Puste pole oznacza brak ustalenia; zero oznacza brak sztuk. Pierwsza koszulka zachowuje 129 zł. Pozostałe ceny musisz ustalić samodzielnie.

Uzupełnij opis, skład i pielęgnację, dane producenta, adres i kontakt elektroniczny. Te informacje są potrzebne przed aktywacją sprzedaży. Sprawdź również obowiązki GPSR opisane w `docs/LEGAL.md`.

Przycisk dodania produktu tworzy nową pozycję bez wdrażania kodu. Wpisz unikalny identyfikator i slug (małe litery, cyfry, myślniki). Ustaw kolejność, widoczność, bestseller/nowość. Ukryty produkt nie pojawia się publicznie; wyprzedany może pozostać w katalogu.

Aby wgrywać zdjęcia z panelu, podłącz publiczny Vercel Blob i ustaw `BLOB_READ_WRITE_TOKEN`. Przesyłaj wyłącznie zdjęcia produktów PNG, JPG lub WebP do 4 MB. Pliki są publiczne; nie przesyłaj danych klientów ani dokumentów. Obrazy z oryginalnej paczki działają bez Blob.

## 5. Pełne zamówienie testowe

1. W Ustawieniach pozostaw TEST włączony i Pobranie włączone.
2. W sklepie wybierz „Nie widzę się w pracy”, M, dodaj do koszyka.
3. Dodaj inną koszulkę XL. Zwiększ liczbę pierwszej do 2.
4. Przejdź do zamówienia, wpisz fikcyjne dane, np. poprawny format kodu `00-001`.
5. Wybierz Polska, kurier 18,99 zł, pobranie. Zaakceptuj regulamin i kliknij „Zamawiam i płacę”.
6. Otrzymasz numer zaczynający się od `TEST-`. Wartość przy trzech sztukach po testowe 129 zł wynosi 405,99 zł przy dopłacie pobraniowej 0 zł.
7. Odśwież potwierdzenie — odczyta zapis z bazy. Zachowaj jego adres prywatnie; token daje dostęp do danych tego zamówienia.
8. W `/admin` → Zamówienia otwórz numer TEST. Zmień na W realizacji, potem wpisz przewoźnika i testowy numer przesyłki, zmień na Wysłane. Sprawdź historię.

TEST nie wysyła prawdziwych e-maili, nie oznacza zapłaty i nie zmniejsza fizycznego magazynu. Cofnięcie/anulowanie zwalnia zapas testowy tylko raz. Symulowany numer przesyłki wpisuje wyłącznie administrator — system nie generuje etykiet.

## 6. Obsługa zamówień

W Zamówieniach wyszukuj po numerze lub e-mailu, filtruj status, otwieraj szczegóły, drukuj i eksportuj CSV. Status zamówienia, płatności, dostawy i zwrotu są oddzielne. Pobranie po złożeniu jest nieopłacone — oznacz opłacenie dopiero po sprawdzeniu rzeczywistego rozliczenia.

Przy Wysłane wymagany jest przewoźnik i numer śledzenia. Przy zwrocie zdecyduj, czy fizycznie przywrócić towar do magazynu. Zamówienia anulowanego nie otwiera się ponownie. Panel zapisuje historię operacji.

Ewidencja przychodu służy wpisom administratora z uzasadnieniem; status zamówienia sam nie wyznacza prawnie przychodu należnego. TEST nie wchodzi do limitu. Domyślny limit kwartalny 10 813,50 zł można zmienić. Zweryfikuj zasady z osobą obsługującą podatki. Raport nie zastępuje księgowości ani dokumentów sprzedaży.

## 7. Poczta

1. W Resend dodaj domenę `ulicznyabsurd.pl` i wpisz w DNS dokładnie rekordy wskazane przez operatora. Nie usuwaj istniejących rekordów poczty.
2. Poczekaj na potwierdzenie domeny.
3. Wstaw `RESEND_API_KEY` i `EMAIL_FROM`, np. `ULICZNY ABSURD <zamowienia@ulicznyabsurd.pl>`.
4. Dla formularza kontaktowego ustaw `CONTACT_ENABLED=true`, `CONTACT_FROM` z tej domeny i `CONTACT_TO=ulicznyabsurd@gmail.com`.
5. Odpowiedzi na powiadomienia trafiają na `ulicznyabsurd@gmail.com`. Nie używamy Gmaila jako nieautoryzowanego nadawcy.
6. Panel Powiadomienia pokazuje statusy i błędy. Możesz ponowić wysyłkę. Nieskuteczny e-mail nie usuwa zamówienia. Wysyłka uruchamia się po zapisaniu zamówienia; codzienny Cron powtarza oczekujące zadania. Skonfiguruj losowy `CRON_SECRET` w Vercel.

E-mail zawiera szczegóły zamówienia i przy pierwszym potwierdzeniu załącznik tekstowy z wersją regulaminu i odstąpieniem. Sprawdź rzeczywisty odbiór oraz folder spam przed otwarciem sklepu. Próby dostawcy w automatycznych testach są symulowane.

## 8. GitHub i Vercel

1. Zrób kopię repozytorium. Skopiuj zawartość projektu z paczki do katalogu aplikacji w repozytorium. Nie kopiuj `.env.local`, haseł, baz ani `node_modules`.
2. Używaj `package-lock.json` i `npm ci`. Usuń stare `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.sites-runtime`, `dist`, pliki `.openai`, konfigurację Vinext/Cloudflare z poprzedniej wersji, jeśli pozostały po podmianie. Paczka końcowa ich nie wymaga.
3. W Vercel ustaw framework Next.js, install `npm ci`, build `npm run build`, właściwy Root Directory. Nie ustawiaj ręcznie Output Directory.
4. Dodaj zmienne z `.env.example`. Dla produkcji `APP_URL=https://www.ulicznyabsurd.pl`. Dla preview użyj jego własnego origin i oddzielnej testowej bazy, aby ochrona pochodzenia formularzy nie blokowała poprawnych żądań.
5. Uruchom migrację z komputera wskazując docelowe `DATABASE_URL` w lokalnym pliku środowiska. Nie uruchamiaj migracji podczas każdego requestu ani automatycznie podczas builda.
6. Wypchnij zmiany do GitHuba i sprawdź logi builda/deploya w Vercel. Nie ma w paczce kluczy do Twojego konta.
7. Po wdrożeniu sprawdź pełny zakup TEST, panel, e-mail, zdjęcia, responsywność i historię zamówienia.

## 9. Domena i SEO

Dodaj w Vercel obie domeny: `www.ulicznyabsurd.pl` i `ulicznyabsurd.pl`. U rejestratora wprowadź rekordy DNS wskazane dla Twojego projektu przez Vercel — nie wpisuj przypadkowego adresu IP z poradnika. Zachowaj rekordy pocztowe. Certyfikat HTTPS musi być aktywny. Konfiguracja przekierowuje domenę bez www na www z zachowaniem ścieżki.

Canonical, sitemap, metadane i dane strukturalne wskazują `https://www.ulicznyabsurd.pl`. Publiczny katalog zawiera indywidualne strony produktów. Oferty z cenami testowymi nie są deklarowane w danych Google jako prawdziwe oferty. Checkout, API i panel mają blokadę indeksacji.

Domyślnie `SEO_INDEXABLE=false`, aby wersja testowa nie trafiła do wyszukiwarki. Po uruchomieniu właściwej strony ustaw `SEO_INDEXABLE=true` tylko dla produkcji i wykonaj deploy. Dodaj domenę do Google Search Console, potwierdź własność przez DNS lub `GOOGLE_SITE_VERIFICATION`, zgłoś `https://www.ulicznyabsurd.pl/sitemap.xml`. Nie jest to gwarancja pozycji ani natychmiastowej indeksacji.

## 10. Aktywacja rzeczywistej sprzedaży

Przejdź całą listę w `docs/LEGAL.md`: telefon, termin dostawy, dane produktów i producenta, ceny, fizyczne stany, dokumenty bezpieczeństwa, podatki, retencja danych, umowa z przewoźnikiem, rzeczywista obsługa pobrań i poczta. Stawki dostawy w projekcie są cenami podanymi przez Ciebie, nie zweryfikowaną ofertą przewoźnika.

W Ustawieniach potwierdź konkretnie kuriera/paczkomat z pobraniem. Wpisz ewentualną dopłatę. Zagraniczne pobranie jest zablokowane. Uzupełnij telefon i termin dostawy, zatwierdź gotowość dokumentów, wyłącz TEST i włącz Sprzedaż. System sprawdzi część brakujących danych, ale nie zastępuje ich oceny przez właściciela.

## 11. Późniejsze uruchomienie Stripe / BLIK

Najpierw uzyskaj akceptację Stripe dla rzeczywistej formy prowadzenia sprzedaży w Polsce i przejdź weryfikację. Nie wymyślaj danych podatkowych. Wprowadź `STRIPE_SECRET_KEY` i `STRIPE_WEBHOOK_SECRET` jako sekrety Vercel. Endpoint webhooka: `https://www.ulicznyabsurd.pl/api/webhooks/stripe`.

Włącz zdarzenia Checkout: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`. Sesja obsługuje kartę i BLIK po aktywacji u operatora. Zanim włączysz Stripe w panelu, przetestuj klucze `sk_test_...`, prawidłowy podpis webhooka, powrót oraz wygaśnięcie. TEST wymaga klucza testowego; realna sprzedaż klucza live. Sam powrót klienta nie oznacza zapłaty.

Nieopłacone zamówienie pozostaje w bazie; ponowienie płatności używa tego samego zamówienia i klucza idempotencji. Po utworzeniu sesji rezerwację zwalnia webhook błędu/wygaśnięcia. Aby anulować aktywną nieopłaconą sesję, zakończ ją w Stripe i poczekaj na webhook. Zwroty pieniędzy obsługuj w panelu Stripe i uzgodnij z ewidencją; ta wersja nie wykonuje automatycznych refundacji Stripe ani ich importu. Nie zaznaczaj fikcyjnie opłacenia.

## 12. Testy i kopie

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Wykonane wyniki i ograniczenia znajdziesz w `docs/TESTY.md`. Testy przeglądarkowe przygotowano w `tests/e2e`, uruchamia się je przez `npm run test:e2e` po lokalnej instalacji przeglądarki Playwright i skonfigurowaniu oddzielnej bazy. Nie zostały uruchomione w środowisku przygotowania tej paczki. Instrukcje: `tests/README.md`, jeśli dostępny, oraz `playwright.config.ts`.

Włącz automatyczne kopie bazy u dostawcy, okresowo wykonuj zaszyfrowany eksport i próbę odtworzenia w osobnej bazie. CSV zamówień nie jest pełną kopią. Zachowuj również obrazy z Blob. Szczegóły w `docs/BACKEND.md`. Nie publikuj kopii ani eksportów zawierających dane klientów.
