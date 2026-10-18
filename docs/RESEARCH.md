# Research wdrożeniowy — Uliczny Absurd

Sprawdzenie: 18.10.2026. Ten plik jest notatką techniczną, nie źródłem statystyk marki.

## Profile marki

Wyszukiwanie dokładnej nazwy nie dostarczyło wystarczającego dowodu własności profili Facebook, Instagram ani YouTube. Indeks wyszukiwarki zawiera agregator TikTok z nazwą @ulicznyabsurd, ale agregator, zgodność nazwy i jego statystyki nie potwierdzają powiązania z użytkownikiem. Nie przypisywać tych kont ani liczb marce. Potrzebne cztery oficjalne adresy od właściciela; do tego czasu puste wartości konfiguracyjne i komunikat o oczekiwaniu na potwierdzenie.

## Oficjalne źródła inspiracji

- https://localheroesstore.com/tees — wyraziste hasła produktów, osobowość kolekcji, prezentacja dostępnych rozmiarów przy produktach; inspiracja logiką zakupów, nie kopiowanie nadruków.
- https://oddfuture.com/collections/tees — mocne motywy graficzne, kolor i humor, prosty Quick Shop. Własny motyw należy wyprowadzić z dostarczonego logo.

## API społecznościowe

### YouTube

https://developers.google.com/youtube/data/reference/rest/v3/channels
https://developers.google.com/youtube/data/getting-started

Publiczne `channels.list?part=statistics&id=...` z kluczem API projektu Google Cloud daje `subscriberCount`, `hiddenSubscriberCount`, `viewCount`, `videoCount`. Subskrybenci są zaokrąglani w dół do trzech cyfr znaczących. Nie zastępować ukrytych/brakujących liczb zerem. `viewCount` ma specyficzną dla YouTube definicję, zmienianą przez operatora; nie sumować go bezpośrednio z zasięgiem Meta. Prywatna analityka wymaga osobnego OAuth. Rekomendowane pobieranie co godzinę jest decyzją projektu, nie gwarancją świeżości API.

### TikTok

https://developers.tiktok.com/docs/en/tiktok-api-v2-get-user-info
https://developers.tiktok.com/docs/en/tiktok-api-scopes

`GET https://open.tiktokapis.com/v2/user/info/?fields=follower_count,video_count,likes_count` wymaga tokenu użytkownika po OAuth i zakresu `user.info.stats`. Podstawowy `user.info.basic` nie wystarcza do statystyk. `user.info.profile` obejmuje link profilu. `video.list` umożliwia odczyt publicznych filmów; suma wyświetleń pobranej części filmów nie jest sumą kanału. Aplikacja i wymagane produkty/scopes muszą przejść wymagane procesy TikToka. Rekomendowany cache godzinowy.

### Instagram

https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/insights
https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/
https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api

Oficjalna kolekcja Meta potwierdza wymóg konta Professional (Business/Creator); wariant Facebook Login wymaga połączenia ze stroną Facebook. Oficjalne strony Insights były w tym środowisku niedostępne (429 / logowanie), dlatego pełny aktualny kontrakt metryk i wymagane uprawnienia trzeba sprawdzić w dashboardzie przed aktywacją. Nie deklarować integracji Insights jako przetestowanej. Dla wariantu Facebook Login planować `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement` i discovery przez `pages_show_list`; dla Instagram Login zweryfikować `instagram_business_basic` i `instagram_business_manage_insights`. Metryki okresowe przedstawiać z zakresem dat. Preferować liczbę followers osobno od views. Proponowany cache 6 h.

### Facebook

https://developers.facebook.com/docs/graph-api/reference/page/
https://developers.facebook.com/docs/pages-api/insights/

Dokumentacja oficjalna zwróciła 429 / niedostępność. Plan integracji: Page access token, uprawnienia odczytu strony `pages_read_engagement`, discovery `pages_show_list`; Insights wymaga weryfikacji `read_insights`. Konkretny endpoint i pola należy potwierdzić na aktualnej wersji Graph API z kontem właściciela. Nie traktować liczby polubień jako followers i nie używać wycofanych impressions jako views. Proponowany cache 6 h, bez deklaracji pobierania live przed testem autoryzacji.

### Wspólny kontrakt i cache

Każdy adapter zwraca platformę, followers/null, views/null, definicję i zakres metryki, source (`api`/`manual`), fetchedAt, status (`ok`/`unauthorized`/`unavailable`/`partial`/`stale`). Liczba obserwacji sumuje tylko znane followers/subscribers i musi być opisana jako suma obserwacji, nie unikalne osoby. Wyświetlenia pokazywać oddzielnie. Przechowywać ostatni udany wynik w trwałym magazynie; sam globalny Map nie stanowi cache między instancjami Vercel. Nie odpytywać platform podczas każdego page view. Odświeżanie cron, limit czasu, exponential backoff, blokada równoległych odświeżeń. Nie renderować tokenów klientowi.

## Stripe dla Polski

https://docs.stripe.com/payments/blik
https://docs.stripe.com/payments/p24
https://docs.stripe.com/payments/checkout/quickstarts
https://docs.stripe.com/checkout/fulfillment

Stripe Checkout jest odpowiednim punktem integracji: karty, BLIK (PLN) i Przelewy24 (PLN/EUR) są obsługiwane; dostępność zależy od aktywacji konta i metody. P24 wymaga m.in. danych firmy, regulaminu, polityki prywatności i zwrotów na stronie. BLIK i P24 to płatności jednorazowe. Nie publikować cennika prowizji bez sprawdzenia planu konta.

Serwer odbiera wyłącznie identyfikator produktu, rozmiar i ilość, sam wyznacza cenę i rezerwuje magazyn. Checkout session powstaje z serwerowych danych. Weryfikowany webhook (raw body + podpis) jest podstawą statusu zapłaty, nie redirect success. Unikalny identyfikator zdarzenia i transakcja w trwałej bazie chronią przed powtórnym przetworzeniem. Uwzględnić zdarzenia asynchronicznego powodzenia i niepowodzenia. Bez bazy, stanów i kluczy sprzedaż musi pozostać zablokowana, z czytelnym trybem demo.

## Stack i fonty

https://nextjs.org/blog — aktualny blog wskazuje Next 16.4 i aktualizację bezpieczeństwa 14.10.2026. Przed instalacją ustalić konkretny dostępny patch w rejestrze i zapisać lockfile.
https://nextjs.org/blog/next-16 — Node >=20.9, TS >=5.1, App Router React19.
https://r3f.docs.pmnd.rs/getting-started/installation — React Three Fiber 9 odpowiada React19; R3F10 jest alpha, nie używać jako stabilnej podstawy.
https://github.com/jpt/barlow — Barlow/Condensed: SIL OFL 1.1.
https://github.com/floriankarsten/space-grotesk — Space Grotesk: SIL OFL 1.1, wsparcie języków środkowoeuropejskich.

Self-host WOFF2 latin oraz latin-ext; zachować OFL i copyright z pakietów. Zweryfikować w pliku fontu wszystkie `ĄĆĘŁŃÓŚŹŻąćęłńóśźż`, a nie polegać wyłącznie na nazwie subsetu.

## Weryfikacja końcowa i wybór wizualny

Local Heroes: https://localheroesstore.com/ oraz https://localheroesstore.com/new-in . Odd Future: https://oddfuture.com/ . Wykorzystano ogólne zasady: śmiałe hasła, kolor, nacisk na produkt i szybkie wejście w warianty. Nie kopiowano produktów ani layoutów. Własny motyw: oryginalne koło z mikrofonem jako lakierowany emblemat i paleta żółć/róż/czerń/krem. Jedyny produkt pochodzi z załącznika.

Doprecyzowanie P24 18.10.2026: https://support.stripe.com/questions/przelewy24-(p24)-onboarding-requirements opisuje nowe wymogi dla aktywacji od 6.08.2026, w tym brak kwalifikacji sole traders/individuals. Dlatego podstawą planu są BLIK i karty; P24 wymaga potwierdzenia formy działalności i dostępności u operatora.

Rejestr npm zwrócił Next 16.4.2; instalacja została zablokowana polityką wieku pakietów, bez obchodzenia blokady. Pozostawiono środowiskowe Next16.3.4 + React19.2.6. Three0.186.1, bez R3F i bez drugiej biblioteki animacji. Polskie glify sprawdzono w WOFF przez fontTools: Barlow Condensed700, Space Grotesk400/600. Licencje w public/licenses.
