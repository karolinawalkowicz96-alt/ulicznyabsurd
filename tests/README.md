# Testy

`npm test` wykonuje testy jednostkowe i integracyjne usług na prawdziwym silniku PostgreSQL w WASM (PGlite). Nie wymaga serwera HTTP ani usług zewnętrznych. Dostawca e-mail jest zamockowany: żadna wiadomość nie opuszcza procesu testowego.

**Uwaga:** adapter PGlite szereguje transakcje i pomija blokadę advisory, której nie potrzebuje przy pojedynczym połączeniu. Scenariusz dwóch kupujących ostatnią sztukę sprawdza wynik i stan, lecz nie dowodzi poprawności rzeczywistych blokad wielopołączeniowych PostgreSQL.

Aby zweryfikować rzeczywistą konkurencję PostgreSQL: ustaw `TEST_DATABASE_URL` na **osobną pustą bazę przeznaczoną wyłącznie do testów** i uruchom `npm test`. Test tworzy tabele oraz czyści wszystkie tabele `shop_*` poprzez TRUNCATE. Nigdy nie podawaj produkcyjnego adresu.

## Przeglądarka — przygotowane, niewykonane

Po lokalnym zainstalowaniu przeglądarki Playwright (`npx playwright install chromium`) i uruchomieniu osobnego lokalnego serwera z bazą testową, migracją i seedem: `E2E_BASE_URL=http://localhost:3000 npm run test:e2e`.

Konfiguracja nie startuje serwera automatycznie. Weryfikuje `testMode` przed złożeniem zamówienia. Scenariusze działają w szerokościach 320, 375, 390, 768, 1024, 1440 i 1920 px. Pełny zakup, odświeżenie potwierdzenia, trwały koszyk, brak rozmiaru, pusty koszyk, próba API administratora bez sesji, canonical, tabela rozmiarów, brak poziomego overflow i błędów JS. Zmiany statusów i historia są wykonywane w integracji usług.

W środowisku przygotowania paczki nie wykonano testów przeglądarkowych, pomiarów CWV ani wizualnej kontroli dostępności. Pomyślny test usług nie zastępuje tych kontroli.
