# Konfiguracja integracji

## Stripe / Redis

Stripe Checkout obsługuje BLIK i karty; metody wybiera dashboard. Przelewy24 tylko po potwierdzeniu kwalifikacji. Na 18.10.2026 dla aktywacji P24 od 6.08.2026 Stripe opisuje m.in. wykluczenie sole traders/individuals. Nie zakładaj, że P24 będzie dostępne dla JDG. Źródło: https://support.stripe.com/questions/przelewy24-(p24)-onboarding-requirements oraz https://stripe.com/en-pl/payment-method/blik .

Wymagane: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PUBLIC_SITE_URL, UPSTASH_REDIS_REST_URL/TOKEN, SHIPPING_PRICE_GROSZE i SHIPPING_NAME. W katalogu zatwierdzić dane (`verified:true`), włączyć STORE_LIVE oraz LEGAL_APPROVED **dopiero po pełnych testach**. Uzupełnić UI demo i dokumenty, podatki oraz informacje przedumowne dla rzeczywistego modelu sprzedaży.

Magazyn: hash Redis `ua:stock:v1`, pola `oko-01:S`, `oko-01:M`, `oko-01:L`, `oko-01:XL`, `oko-01:XXL`. Ustaw rzeczywiste nieujemne liczby poleceniem HSET w chronionym panelu Redis. Brak pola = wariant niedostępny. Nie wpisuj przykładowych stanów do produkcji. Rezerwacja używa atomowego Lua. Zamówienia: `ua:order:<UUID>`; klucz nie wygasa sam, ponieważ utrata rezerwacji bez uzgodnienia z operatorem grozi oversellingiem. Retencję danych ustalić przed startem.

Webhook `/api/webhooks/stripe`: checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.async_payment_failed, checkout.session.expired. Płatność paid wymaga payment_status=paid. Eventy inne niż te są pomijane. Stan order i sessionId zapewniają idempotencję biznesową (nie tylko krótkotrwały dedup eventId). Refund i fulfillment są poza zakresem tej warstwy — wymagają osobnego procesu.

Timeout tworzenia sesji: retry z tym samym requestId i Idempotency-Key. Serwer nie zwalnia rezerwacji przy niejednoznacznym timeout, aby nie sprzedać jej dwukrotnie. Nieistniejące sesje / definitywne błędy operatora wymagają uzgodnienia i ręcznego atomowego zwolnienia rezerwacji przez operatora sklepu; do uruchomienia dodać cykliczny proces reconciliation z monitoringiem. To znane ograniczenie, nie gotowa automatyczna obsługa całej logistyki.

Testuj odrzucenie obcej ceny, nieistniejącego SKU, ilości ujemnych, nieznanego rozmiaru, konflikt requestId, wyścig dwóch klientów po ostatnią sztukę, powtórzony webhook, błędny podpis, błędną sumę, async failure, expired i timeout Redis. Nie przyjmuj realnych pieniędzy przed testami sandbox.

## Kontakt

Resend HTTP API. Potrzebne RESEND_API_KEY, CONTACT_FROM (zweryfikowana domena), CONTACT_TO, CONTACT_ENABLED=true oraz Redis. Backend: walidacja, ograniczenie rozmiaru body, origin, honeypot, trwałe limity per IP (hash), per e-mail (hash) i globalne. Bez Redis zamknięty. Dostawca musi zwrócić identyfikator przyjęcia, zanim UI pokaże sukces. Przyjęcie nie gwarantuje dostarczenia do inboxa. Formularz nie ma zgody marketingowej. Uzupełnij administratora danych i zasady retencji przed włączeniem. Przy większym ruchu dołożyć challenge antybot zgodny z polityką prywatności.

## Social

Cztery moduły w lib/social. Kontrakt: platform, followers, views, viewsScope, updatedAt, status, opcjonalna note. Unknown=null. Nie sumujemy wyświetleń o różnych definicjach.

YouTube: API key + channel ID, publiczne channel statistics; subskrybenci zaokrąglani przez API. TikTok: OAuth token, user.info.stats. Automatyczny refresh wygasających OAuth tokenów wymaga dodania procesu dla aplikacji właściciela; obecnie tokeny w środowisku, wygaśnięcie pokazuje unauthorized/stale. Instagram adapter jest dla Facebook Login i profesjonalnego konta połączonego ze stroną. Facebook Page token i aktualna, jawna META_GRAPH_VERSION. Szczegóły scopes i ograniczeń dokumentacji: RESEARCH.md.

Redis przechowuje ostatni dobry wynik bez utraty przy awarii. TTL świeżości: YT/TikTok 1h, Meta 6h; endpoint ma shared cache 5 minut. Odświeżenie na pierwszym żądaniu po TTL z blokadą rozproszoną, a nie cztery API na każdą wizytę. Nie jest to streaming realtime. Bez konfiguracji są puste wartości. Manual overrides z datą nie są opisywane jako live. Przed aktywacją zweryfikuj konto i wykonaj test rzeczywistej odpowiedzi każdego API. API Meta nie zostało potwierdzone testem konta.
