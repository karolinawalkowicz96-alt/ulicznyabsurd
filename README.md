# Uliczny Absurd

Autorski sklep / witryna marki w języku polskim. Żółć, róż, czerń i krem; oryginalny znak jako lakierowany emblemat Three.js. Rzeczywiste materiały właściciela, bez fikcyjnych profili i wyników.

## Uruchomienie lokalne

Node >=22.13, pnpm (wersja zapisana w `packageManager`).

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev:next
```

Otwórz http://localhost:3000. `pnpm typecheck`, `pnpm test`, `pnpm build:vercel` sprawdzają typy, logikę i natywny build Next. `pnpm build` buduje podgląd Sites przez Vinext; to odrębny target hostingu używający tych samych plików App Router. Kod nie wymaga Vinext na Vercel.

## Co działa

- Strona, nawigacja mobilna, FAQ i panele oparte na natywnym `dialog` (modalny fokus, Escape, powrót fokusu).
- Scena Three.js: geometryczny korpus, bok, obręcz, raster oryginalnego znaku na licu, światło i lakier. To emblemat 3D, nie model każdego znaku / mikrofonu. Porusza się w spoczynku i przy ruchu wskaźnika, skaluje przy przewijaniu. Limit DPR 1.5, pauza poza ekranem i w nieaktywnej karcie. Statyczny wariant bez WebGL / przy reduced-motion.
- Produkt `/produkt/nie-widze-sie-w-pracy`, jedno oryginalne zdjęcie, powiększenie nadruku, warianty, ilość, panel informacji i tabela z jawnymi brakami.
- Koszyk: rozmiary jako oddzielne pozycje, edycja ilości, usuwanie, podsumowanie, localStorage z walidacją schematu. Nie jest rezerwacją.
- Endpointy walidują dane i odrzucają nieaktywne integracje; nie symulują powodzenia.
- Cztery adaptery społecznościowe, nullable metryki, trwały cache Redis, ostatni dobry wynik, stany auth/unavailable/stale/partial, opcjonalne zweryfikowane dane ręczne. API nie są podłączone.
- Brak trackerów, osadzeń filmów i zewnętrznych fontów. Fonty self-hosted z licencją OFL.
- Polski HTML, metadane, favicon, noindex, robots blokujący crawl, pusta sitemap demo. Brak fikcyjnego Product JSON-LD.

## Dane i treści

`lib/catalog.ts` to jedyne źródło produktu i ceny. 129 zł, stan XS i dostępność innych rozmiarów to **dane demonstracyjne**. `verified:false` blokuje prawdziwe płatności także po dodaniu kluczy. Uzupełnij skład, pielęgnację, wymiary, cenę, warianty i dostawę. `lib/content.ts` zawiera FAQ i profile (wszystkie null). `lib/social/index.ts` zawiera `manual`, tylko zweryfikowane wartości z ISO datą.

Nie dodano nowych koszulek, cudzych filmów ani niepotwierdzonych kont. Do filmów potrzebne oficjalne adresy i materiały z prawami do użycia. Dodać je dopiero po potwierdzeniu.

## GitHub

Kod podglądu ma własne repozytorium źródłowe Sites. Aby przenieść go na GitHub:

1. Pobierz pełny kod lub skopiuj checkout bez `node_modules`, `.next`, `dist`, `.wrangler`, `.sites-runtime` i `.env.local`.
2. Utwórz prywatne repozytorium GitHub. W nowym checkout: `git init`, `git add .`, `git commit -m "Build Uliczny Absurd storefront"`.
3. `git remote add origin <URL_TWOJEGO_REPO>`, `git branch -M main`, `git push -u origin main`.
4. Nigdy nie dodawaj sekretów. `.env.example` jest jawny; inne `.env*` ignorowane. Nie przepisuj `origin` istniejącego repozytorium Sites bez świadomej migracji.

## Vercel

1. Importuj repozytorium GitHub jako Next.js. Node 22.x; package manager pnpm.
2. Build Command: **`pnpm build:vercel`** (koniecznie override domyślnego `build`, który jest dla Sites). Install: `pnpm install --frozen-lockfile`. Output Directory: domyślne Next.js.
3. Wprowadź środowisko z `.env.example`. `PUBLIC_SITE_URL` musi być prawdziwym HTTPS origin. Nie używaj prefiksu NEXT_PUBLIC dla sekretów.
4. Uruchom demo z STORE_LIVE=false i CONTACT_ENABLED=false. Testuj desktop i telefon oraz checklistę `docs/QA.md`.
5. Podłącz Redis, operatorów, webhook, uzupełnij dane prawne i katalog; dopiero po testach sandbox aktywuj produkcję. Publiczna domena i indeksacja to osobny krok.

Nie wdrożono projektu do konta Vercel ani nie utworzono repozytorium GitHub użytkownika — brak wskazanego repozytorium i projektu. Dostarczony podgląd jest prywatnym wdrożeniem Sites.

## Płatności i magazyn

Szczegóły: `docs/INTEGRATIONS.md`. Integracja Stripe Checkout przez REST przygotowana, **nieprzetestowana z prawdziwym operatorem**. Endpoint bierze tylko id/rozmiar/ilość/requestId; ignoruje cenę klienta. Weryfikuje warianty, wyznacza cenę serwerowo, atomowo rezerwuje Redis stock, wykorzystuje idempotency key. Webhook sprawdza HMAC raw body i tolerancję 5 minut, walutę, sumę i powiązanie sesji; atomowa zmiana stanu zamówienia chroni przed podwójnym zwolnieniem towaru lub zapisem płatności. Przekierowanie nigdy nie stanowi dowodu zapłaty.

To warstwa integracji, nie ukończony system obsługi zamówień: brak panelu realizacji, etykiet przesyłek, faktur i wysyłki potwierdzenia zamówienia. Awaria/timeout po rezerwacji wymaga uzgodnienia z operatorem — nie zwalniamy towaru w ciemno. Uruchomienie sprzedaży wymaga wdrożenia monitoringu i procedury uzgodnień osieroconych rezerwacji. Żadne zamówienie nie jest oznaczane jako opłacone bez podpisanego webhooka.

## Przed startem — potrzebne od właściciela

- Cztery oficjalne linki, identyfikatory kont, zgody OAuth / tokeny; opcjonalnie ręczne metryki z datą.
- Ostateczna cena, tabela rozmiarów, materiał i pielęgnacja, stany magazynowe, dostawa i koszty.
- Nazwa i dane firmy, NIP/rejestr, adres kontaktowy i zwrotów, regulamin oraz polityka prywatności do weryfikacji.
- Konto Stripe, zatwierdzone metody, klucze i webhook; Redis; Resend i zweryfikowana domena nadawcza.
- Materiały wideo, dodatkowe zdjęcia / produkty, jeśli mają wejść na stronę.
- Testy w przeglądarce i testowe transakcje. Aktualizacja frameworka według bieżących biuletynów bezpieczeństwa.

## Ograniczenia weryfikacji

Zobacz `docs/QA.md`. Natywny build Next.js (Turbopack i Webpack) blokuje ograniczenie kontenera `ENOENT uv_resident_set_memory`; musi zostać powtórzony w Vercel. Nie deklarujemy testów browserowych, płatności, dostawy wiadomości ani autoryzacji API, których nie wykonano. Środowisko Sites nie udostępniało skilla control-browser. Wersja Next dostarczona przez bazę środowiska to 16.3.4; próba aktualizacji do wykrytej w rejestrze 16.4.2 została odrzucona przez politykę minimalnego wieku pakietów (7 dni). Nie obchodzono tej polityki. Przed publicznym startem zastosuj aktualny dopuszczony patch bezpieczeństwa i powtórz build/testy.


## Social media — Uliczny Absurd

Profile links are already wired to Facebook, Instagram, YouTube and TikTok. The `Nasz kawałek internetu` section refreshes automatically every 5 minutes and also has a manual refresh button. Live counters require the matching API credentials from `.env.example`. YouTube exposes a channel-wide view total; TikTok totals public-video `view_count` values from the Display API. Facebook/Instagram follower counters use Meta Graph API; a comparable all-time account view total is not exposed by the same basic profile endpoints, so the aggregate view number only sums platforms that actually returned a verified `views` value.
