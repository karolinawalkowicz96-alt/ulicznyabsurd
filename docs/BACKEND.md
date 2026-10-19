# Baza danych, administracja i wiadomości

## Uruchomienie

Wymagany jest PostgreSQL (np. projekt Neon przypięty do Vercel). Ustaw `DATABASE_URL` na połączenie z TLS zgodnie z instrukcją dostawcy. Nie wyłączaj weryfikacji certyfikatów. Następnie uruchom `npx tsx --env-file=.env.local scripts/db-setup.ts`. Migracja i seed nie nadpisują produktów, stanów ani ustawień istniejącej bazy.

Pierwsze konto: na czas uruchomienia tego polecenia ustaw `ADMIN_EMAIL` oraz unikalne `ADMIN_PASSWORD` (minimum 14 znaków). Skrypt zapisuje scrypt z indywidualną losową solą. Usuń zmienną hasła po wykonaniu. Ponowne uruchomienie z tym samym adresem resetuje jego hasło. Nie dodawaj `.env.local` do GitHub.

Domyślnie działa TEST: każdy wariant ma 100 **testowych**, a nie rzeczywistych sztuk; nieznane ceny mają wyłącznie testowe 129 zł. Fizyczne stany pozostają nieuzupełnione, a nieznane ceny pozostają `null`. Zamówienia TEST zapisują się trwale i są widoczne w administracji, ale nie są wysyłane i nie wchodzą do zestawień przychodu rzeczywistego. Pierwsza znana cena 129 zł jest zachowana.

## Bezpieczeństwo i magazyn

Sesja administratora trwa 8 godzin, cookie HttpOnly/SameSite=Strict/Secure w produkcji, token jest przechowywany w bazie jako SHA-256. Każda operacja administracyjna wymaga serwerowej autoryzacji; mutacje wymagają zgodnego Origin. `APP_URL` ustaw dokładnie na adres z protokołem bez końcowego ukośnika (lokalnie `http://localhost:3000`, produkcyjnie `https://www.ulicznyabsurd.pl`). Logowanie ma ograniczenie prób per adres konta i globalnie w bazie. Dostęp do zamówienia klienta wymaga losowego tokena 256-bitowego; traktuj jego adres jak prywatny link.

Złożenie zamówienia i zmniejszenie stanu są jedną transakcją SQL. Warianty są blokowane w ustalonej kolejności. Klucz idempotencji UUID odrzuca inne dane pod tym samym kluczem; ponowienie tych samych danych zwraca to samo zamówienie. Anulowanie przed wysłaniem przywraca stan tylko raz. Zwrot przywraca stan wyłącznie po zaznaczeniu ponownego przyjęcia do magazynu. Status pobrania pozostaje nieopłacony do ręcznego potwierdzenia rozliczenia przewoźnika. Statusów Stripe nie można ręcznie zmienić na opłacone — źródłem jest webhook.

## Poczta i storage

Ustaw `RESEND_API_KEY`, `EMAIL_FROM` (np. `ULICZNY ABSURD <zamowienia@ulicznyabsurd.pl>`, po weryfikacji domeny w Resend), `APP_URL`. Reply-To i odbiorca powiadomień sprzedawcy to `ulicznyabsurd@gmail.com`. DNS SPF/DKIM dodaj według wartości pokazanych w koncie Resend, bez zgadywania i bez zmiany istniejących rekordów poczty bez analizy.

Outbox zapisuje powiadomienia w tej samej transakcji co zamówienie. `after()` uruchamia wysyłkę po odpowiedzi API. Nieudana próba pozostaje w kolejce, opóźnienie ponowienia 15 minut, maksymalnie 10 prób. Administrator może wywołać ponowienie; harmonogram może wykonywać `GET /api/jobs/mail` z nagłówkiem `Authorization: Bearer CRON_SECRET`. Ustaw losowy `CRON_SECRET` i skonfiguruj harmonogram według planu hostingowego. Plik vercel.json zawiera harmonogram codzienny o 08:00 UTC (zgodny z ograniczeniem częstotliwości planu Hobby); after() obsługuje bieżącą wysyłkę, a codzienny harmonogram odzyskuje nieudane zadania. Przekroczenie 10 prób wymaga przeglądu przyczyny przez obsługę techniczną. Idempotency-Key przekazywany do Resend to identyfikator wiadomości. Brak kluczy jest widoczny, wysyłka nie jest udawana. Zamówienia TEST nigdy nie wysyłają wiadomości do klientów.

Potwierdzenie zawiera tekstowy załącznik z regulaminem, reklamacjami i formularzem odstąpienia. Kopia warunków zostaje zapisana przy zamówieniu i jest używana przy ponowieniach.

`BLOB_READ_WRITE_TOKEN` umożliwia trwałe zdjęcia w Vercel Blob. Endpoint administracyjny akceptuje rzeczywiste nagłówki PNG/JPEG/WebP, do 4 MB. Pliki są losowo nazywane; nie są zapisywane na dysku funkcji Vercel.

## Ewidencja i kopie

Wartość zamówień, płatności i przychód należny to osobne pojęcia. Wpisy przychodu są dodawane przez administratora z kwotą w groszach i uzasadnieniem. Korektę dodaj jako osobny wpis z ujemną kwotą. Raport wyłącza zamówienia TEST i wyznacza kwartał w strefie Europe/Warsaw. Nie jest automatyczną kwalifikacją podatkową. CSV zamówień i ewidencji jest dostępny po autoryzacji; komórki potencjalnie uruchamiające formuły są neutralizowane.

Włącz automatyczne kopie/PITR u dostawcy PostgreSQL. Dodatkowo wykonuj `pg_dump --format=custom --file=backup.dump "$DATABASE_URL"` w zaufanym środowisku z klientem PostgreSQL. Szyfruj kopie, ogranicz dostęp i nie dodawaj ich do repozytorium. Przywracanie przetestuj na odrębnej bazie (`pg_restore --no-owner --dbname=... backup.dump`), nigdy eksperymentalnie na produkcji. Zdjęcia Blob wymagają odrębnej kopii/retencji; eksport CSV nie zastępuje pełnej kopii bazy. Ustal retencję danych oraz realizację żądań RODO z uwzględnieniem obowiązków przechowywania dokumentacji.


## Skala panelu
Lista i zestawienie dashboardu korzystają z ostatnich maksymalnie 2000 zamówień; pełny eksport CSV i raport ewidencji czytają wszystkie rekordy. Przed przekroczeniem tego rozmiaru rozbuduj paginację i agregaty dashboardu. Nie interpretuj dashboardu jako pełnego raportu finansowego.
