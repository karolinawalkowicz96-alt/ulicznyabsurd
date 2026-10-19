# Weryfikacja wdrożenia — 20.10.2026

## Stan sprawdzony na Vercel
- Produkcyjne wdrożenie `ulicznyabsurd.vercel.app` odpowiada HTTP 200.
- Sklep pozostaje celowo w trybie TEST i ma `SEO_INDEXABLE=false`.
- `robots.txt` blokuje indeksowanie całej wersji przedstartowej.
- Sitemap i canonical wskazują docelowo `https://www.ulicznyabsurd.pl`.
- API katalogu odpowiada i widzi skonfigurowaną bazę.

## Domena docelowa — nadal do wykonania w panelu Vercel/DNS
W chwili audytu projekt Vercel ma przypiętą tylko domenę `ulicznyabsurd.vercel.app`. `ulicznyabsurd.pl` i `www.ulicznyabsurd.pl` nie są jeszcze przypięte do projektu, a konfiguracja DNS nie wskazuje na Vercel. Przed startem:
1. Vercel → Project → Settings → Domains: dodaj `www.ulicznyabsurd.pl` oraz `ulicznyabsurd.pl`.
2. U operatora DNS ustaw rekordy dokładnie zgodnie z instrukcją pokazaną przez Vercel (dla bieżącego audytu Vercel rekomendował CNAME do `cname.vercel-dns.com.` dla `www` i adres Vercel dla domeny głównej).
3. Poczekaj na status Valid Configuration / certyfikat HTTPS.
4. Dopiero po działającej domenie ustaw `APP_URL=https://www.ulicznyabsurd.pl`, włącz docelowe przekierowania i na samym końcu `SEO_INDEXABLE=true`.

## Poprawki w tej paczce
- usunięto podwójne `| ULICZNY ABSURD | Uliczny Absurd` w tytułach SEO;
- checkout nie pokazuje fałszywego błędu bazy/sprzedaży podczas pierwszego ładowania API;
- poprawiono focus klawiatury dla kart dostawy i płatności;
- `assertOrigin` akceptuje rzeczywisty origin żądania oraz skonfigurowany `APP_URL`, co ułatwia bezpieczne testy na aliasie/preview;
- link w stopce nie udaje panelu ustawień cookies, skoro sklep nie ma opcjonalnych trackerów;
- checkout ma własny canonical i pozostaje `noindex, nofollow`.

## Nadal blokuje realny start sprzedaży
Zgodnie z ustawieniami sklepu nadal brakuje m.in. telefonu sprzedawcy, potwierdzonego terminu realizacji, zatwierdzonej tabeli rozmiarów, gotowej wysyłki, danych produktowych/GPSR dla wszystkich pozycji i aktywnej konfiguracji Stripe, jeśli ma być używana płatność online. Nie przełączaj `salesActive` bez uzupełnienia tych danych.
