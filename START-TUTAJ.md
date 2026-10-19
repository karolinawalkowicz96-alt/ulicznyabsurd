# ULICZNY ABSURD — wdrożenie sklepu

Stan przygotowania plików: **20.10.2026**. Projekt pozostaje domyślnie w trybie TEST i nie powinien przyjmować rzeczywistych zamówień, dopóki lista „Blokady startu” poniżej nie zostanie zamknięta.

## 1. Lokalnie

Wymagany Node.js >=22.13 i PostgreSQL.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Bez `DATABASE_URL` strona publiczna może działać w trybie podglądu, ale panel i zapis zamówień nie są gotowe do pracy produkcyjnej.

## 2. Pierwsza baza i administrator

Utwórz **osobną bazę produkcyjną** PostgreSQL oraz osobną bazę testową/preview. W `.env.local` ustaw `DATABASE_URL`, tymczasowo `ADMIN_EMAIL` i silne `ADMIN_PASSWORD` (min. 14 znaków), a następnie:

```bash
npm run db:setup
```

Bootstrap tworzy 8 produktów i 40 wariantów. Rzeczywisty stan magazynowy pozostaje **nieustalony (`NULL`)**; tylko testowy magazyn dostaje po 10 sztuk na wariant. Po utworzeniu administratora usuń `ADMIN_PASSWORD` z konfiguracji.

## 3. Co uzupełnić w `/admin` przed sprzedażą

Dla każdego aktywnego produktu podaj i zatwierdź rzeczywistą cenę, skład włókienniczy, producenta, adres i e-mail producenta, kraj producenta oraz informacje bezpieczeństwa/GPSR. Jeżeli producent jest spoza UE, uzupełnij również podmiot odpowiedzialny w UE. Zweryfikuj tabelę rozmiarów z rzeczywistym produktem i wpisz fizyczny stan każdego wariantu.

W ustawieniach sklepu podaj telefon sprzedawcy, maksymalny termin dostarczenia, rzeczywiste metody i ceny dostawy oraz potwierdź konfigurację przewoźnika. Włącz tylko płatności, które rzeczywiście są skonfigurowane. Serwer blokuje przejście na sprzedaż rzeczywistą, jeżeli te dane są niekompletne.

## 4. Poczta

Zweryfikuj domenę `ulicznyabsurd.pl` u operatora poczty transakcyjnej i ustaw:

- `RESEND_API_KEY`
- `EMAIL_FROM=ULICZNY ABSURD <zamowienia@ulicznyabsurd.pl>`
- `CONTACT_ENABLED=true` dopiero po działającym teście formularza
- `CONTACT_FROM`
- `CONTACT_TO=ulicznyabsurd@gmail.com`
- losowy `CRON_SECRET`

Potwierdzenie zamówienia rzeczywistego zawiera podsumowanie i kopię warunków/regulaminu na trwałym nośniku. Zamówienia TEST nie wysyłają maili do klientów.

## 5. Stripe / BLIK

Najpierw skonfiguruj Stripe w trybie testowym. Ustaw `STRIPE_SECRET_KEY` i `STRIPE_WEBHOOK_SECRET`, dodaj webhook do `/api/webhooks/stripe` i sprawdź udane, nieudane i wygasłe sesje. Kod korzysta z automatycznego doboru metod płatności przez Stripe — **BLIK pojawi się tylko wtedy, gdy Stripe rzeczywiście udostępni go dla konta i transakcji**.

Nie przełączaj na klucze live przed zakończeniem onboardingu i testów. Status zapłaty ustala zweryfikowany webhook, nie powrót przeglądarki ze Stripe.

## 6. Domena i SEO

W Vercel przypnij `www.ulicznyabsurd.pl` oraz `ulicznyabsurd.pl` i w DNS ustaw wyłącznie rekordy wskazane dla Twojego projektu Vercel. Najpierw upewnij się, że `https://www.ulicznyabsurd.pl/` zwraca prawidłową stronę i HTTPS.

W produkcji:

```env
APP_URL=https://www.ulicznyabsurd.pl
SEO_INDEXABLE=false
CANONICAL_REDIRECTS=false
```

Po pełnym teście domeny, sklepu i dokumentów ustaw **dopiero wtedy**:

```env
SEO_INDEXABLE=true
CANONICAL_REDIRECTS=true
```

Canonical, sitemap i metadane wskazują docelową domenę `www`. Koszyk/checkout, API i panel administratora są wyłączone z indeksacji.

## 7. GitHub / Vercel

1. Zrób kopię obecnego repozytorium.
2. Podmień pliki aplikacji plikami z tej paczki; nie kopiuj `.env.local`, `node_modules`, `.next` ani sekretów.
3. Commit i push do istniejącego repozytorium GitHub.
4. W Vercel ustaw zmienne z `.env.example` dla Production; Preview powinien mieć osobną bazę i pozostać testowy.
5. Framework: Next.js. Install: `npm ci`. Build: `npm run build`.
6. Uruchom `npm run db:setup` jednorazowo wobec docelowej bazy z zaufanego komputera — nie jako część każdego builda.
7. Po deployu wykonaj pełny zakup TEST, test poczty, panelu, responsywności oraz Stripe test mode.
8. Dopiero po zamknięciu blokad w `docs/AUDYT-STARTOWY-2026-10-20.md` wyłącz TEST i aktywuj sprzedaż w panelu.

## 8. Blokady startu, których kod nie może uzupełnić za właściciela

- brak numeru telefonu sprzedawcy;
- docelowa domena `www.ulicznyabsurd.pl` nie działała prawidłowo podczas weryfikacji 20.10.2026;
- brak potwierdzonej konfiguracji Stripe live/BLIK i webhooka live;
- brak potwierdzonej konfiguracji poczty transakcyjnej;
- brak rzeczywistego przewoźnika, metod, stawek i terminu dostawy;
- brak potwierdzonych składów tekstylnych i danych producenta/GPSR dla produktów;
- brak potwierdzonych rzeczywistych stanów, cen części produktów i tabeli rozmiarów;
- właściciel musi sam potwierdzić warunki prowadzenia działalności nierejestrowanej i prowadzić wymaganą ewidencję/rozliczenia.

Pełny audyt, zakres zmian, źródła i granice weryfikacji są w `docs/AUDYT-STARTOWY-2026-10-20.md`.
