# Audyt przedstartowy ULICZNY ABSURD — 20.10.2026

## Status

Pliki zostały przygotowane jako **bezpieczna wersja przedstartowa**. Nie deklarujemy pełnej gotowości sprzedażowej ani prawnej, ponieważ kilka danych i konfiguracji zależy od właściciela oraz zewnętrznych usług. Aplikacja pozostaje domyślnie w TEST i blokuje przejście do sprzedaży rzeczywistej przy brakujących danych.

## Rozpoznana technologia i faktyczne działanie

- Next.js 16 / React / TypeScript.
- PostgreSQL: produkty, warianty, zamówienia, ustawienia, sesje administratora, rate limit, outbox wiadomości, ewidencja.
- Panel `/admin`: własne logowanie, scrypt, sesje w bazie, HttpOnly/SameSite=Strict/Secure w produkcji, weryfikacja Origin i rate limiting.
- Zamówienia: cena i stan są sprawdzane po stronie serwera; stan magazynowy zmniejszany transakcyjnie; idempotencja zapobiega duplikatom.
- Stripe: sesja Checkout tworzona na serwerze; status płatności aktualizowany przez webhook ze sprawdzeniem podpisu i zgodności kwoty/waluty/trybu.
- Resend: poczta transakcyjna dopiero po konfiguracji zmiennych środowiskowych. Brak konfiguracji nie jest udawany jako skuteczna wysyłka.
- Vercel Blob: wyłącznie zdjęcia produktów w panelu, nie dane klientów.
- Przeglądarka: `localStorage ua-cart-v1` (koszyk), `sessionStorage ua-order-attempt` (idempotencja próby zamówienia), cookie `ua_session` wyłącznie dla administratora.
- W kodzie nie znaleziono Google Analytics, Meta Pixel, reklamowych tagów ani osadzonych widgetów social wymagających opcjonalnej zgody.

## Zmiany wykonane w kodzie

### Proces zakupowy / UI
- przebudowany checkout w identyfikacji strony: czytelne etapy, karty metod dostawy/płatności, podsumowanie, mobile i focus states;
- Polska jako jedyny obsługiwany kraj na start;
- rzeczywiste metody wysyłki i ich ceny pochodzą z ustawień, bez fikcyjnych stawek produkcyjnych;
- Stripe nie pokazuje BLIKA „na sztywno”; korzysta z metod faktycznie dostępnych u operatora;
- jednoznaczny przycisk produkcyjny `Zamawiam z obowiązkiem zapłaty`;
- regulamin jest wymagany, polityka prywatności jest informacją — nie fałszywą „zgodą RODO”;
- dane sprzedawcy są pokazane bezpośrednio przed finalizacją zakupu;
- pełna nazwa/adres sprzedawcy usunięte z wizualnej stopki, pozostawione w dokumentach prawnych, kontakcie i checkoutcie;
- formularz kontaktowy nie symuluje sukcesu, gdy poczta nie jest skonfigurowana.

### Bezpieczeństwo sprzedaży
- rzeczywiste stany magazynowe po bootstrapie są puste; nie seedujemy fikcyjnych stanów produkcyjnych;
- produkcja wymaga telefonu sprzedawcy, terminu dostawy, potwierdzonej dostawy, płatności, danych produktów/GPSR, składu, tabeli rozmiarów i realnego stanu;
- ceny liczy serwer; klient nie może przesłać wiążącej ceny;
- webhook Stripe weryfikuje podpis, tryb, walutę i sumę; nie uznaje płatności na podstawie redirectu;
- sekrety są tylko w zmiennych środowiskowych, brak kluczy w kodzie przeglądarki.

### Dokumenty i prawa konsumenta
- regulamin sklepu + usług elektronicznych;
- polityka prywatności dopasowana do faktycznie używanych systemów;
- cookies/pamięć lokalna — bez pozornego bannera, ponieważ brak technologii opcjonalnych;
- dostawa i płatności bez wymyślonych przewoźników/stawek;
- zwroty i ustawowe odstąpienie;
- reklamacje / zgodność towaru z umową;
- formularz odstąpienia do wydruku/PDF + plik TXT;
- dane sprzedawcy i kontakt;
- usunięto aktywne odwołanie do zamkniętej platformy ODR;
- standardowe koszulki z gotowym nadrukiem nie są traktowane jako personalizowane tylko dlatego, że druk następuje po zamówieniu.

### Produkty / GPSR / tekstylia
Panel produktu zawiera pola dla producenta, adresu i e-maila, kraju producenta, odpowiedzialnego podmiotu w UE (jeśli potrzebny), składu włókienniczego, informacji bezpieczeństwa i potwierdzenia GPSR. Dane są wyświetlane zarówno na pełnej stronie produktu, jak i w panelu zakupu z głównej strony dopiero po ich rzeczywistym uzupełnieniu. System nie wymyśla producenta, certyfikatów, składu ani ostrzeżeń. Robocza tabela rozmiarów nie jest prezentowana jako wiążąca, dopóki właściciel nie potwierdzi jej na podstawie produktu lub dokumentacji dostawcy.

### SEO
- docelowy canonical: `https://www.ulicznyabsurd.pl`;
- sitemap i robots sterowane flagą `SEO_INDEXABLE`;
- `/admin`, `/api`, `/zamowienie`/checkout wyłączone z indeksacji;
- indywidualne strony produktów, poprawione title/description, breadcrumbs i alt;
- Product/Offer schema nie emituje prawdziwej oferty na podstawie danych testowych;
- usunięto kolidującą, starszą statyczną trasę jednego produktu — wszystkie produkty korzystają teraz z jednej kompletnej strony produktowej;
- przygotowane przekierowanie Vercel + domeny bez www do `www`, ale włączane dopiero przez `CANONICAL_REDIRECTS=true` po działającym DNS/HTTPS.

## Cookies i RODO — decyzja

Aktualny kod używa tylko pamięci/kuków potrzebnych do żądanej funkcji sklepu lub bezpieczeństwa. Art. 399 ust. 3 Prawa komunikacji elektronicznej przewiduje wyjątek od wymogu zgody dla informacji koniecznych do transmisji lub dostarczenia usługi żądanej przez użytkownika. Dlatego **nie dodano bannera zgód**, który sugerowałby istnienie analityki/marketingu. Jeżeli pojawią się GA, Meta Pixel, Hotjar, remarketing lub inne opcjonalne technologie, przed ich uruchomieniem trzeba wdrożyć blokowanie przed zgodą oraz równorzędne `Akceptuję wszystkie`, `Odrzucam opcjonalne`, `Ustawienia` i łatwą zmianę decyzji.

## Promocje i opinie

Kod nie publikuje fikcyjnych promocji ani historii cen. Jeżeli w przyszłości sklep ogłosi obniżkę (`promocja`, `-20%`, przekreślona cena itp.), trzeba prowadzić i wyświetlać wymaganą najniższą cenę z okresu 30 dni przed obniżką (albo z całego okresu sprzedaży, jeżeli produkt jest oferowany krócej). Sklep nie posiada obecnie modułu opinii klientów, więc nie dodano fikcyjnych ocen ani deklaracji o sposobie ich weryfikacji.

## Polski Akt o Dostępności

Usługi e-commerce są objęte PAD od 28.06.2025, ale ustawa wyłącza usługi oferowane lub świadczone przez mikroprzedsiębiorców. Ze względu na szczególną formę działalności nierejestrowanej właściciel powinien potwierdzić swoją kwalifikację do tego wyłączenia. Niezależnie od formalnego wyłączenia zachowano podstawowe dobre praktyki dostępności: semantyczne etykiety, focus, obsługa klawiaturą, odpowiednie komunikaty formularzy i responsywność.

## Działalność nierejestrowana — obowiązki właściciela

W 2026 limit przychodu należnego wynosi 10 813,50 zł na kwartał (225% minimalnego wynagrodzenia). Właściciel musi sam potwierdzić także m.in. warunek braku wykonywania działalności gospodarczej w poprzednich 60 miesiącach oraz brak działalności wymagającej koncesji/licencji/rejestru. Strona i panel nie zastępują ewidencji sprzedaży, rozliczenia PIT/VAT, wystawiania wymaganych dokumentów ani oceny obowiązków podatkowych.

## Twarde blokady startu

1. **Telefon sprzedawcy** — brak danych; nie wolno go wymyślać. UOKiK wskazuje numer telefonu jako informację przedumowną dla sprzedaży na odległość.
2. **Domena `www.ulicznyabsurd.pl`** — podczas sprawdzenia 20.10.2026 zwracała 502; nie włączono jeszcze przymusowego redirectu ani indeksowania.
3. **Stripe live/BLIK** — brak dostępu do konta, onboardingu, ustawień metod i sekretów live; niezweryfikowane.
4. **Webhook Stripe live** — musi zostać utworzony i przetestowany na docelowym endpointzie.
5. **Poczta transakcyjna** — domena nadawcza i rzeczywista dostarczalność niezweryfikowane.
6. **Dostawa** — brak wskazanego przewoźnika/usług, rzeczywistych stawek i zatwierdzonego terminu dostarczenia.
7. **Produkty** — brak potwierdzonego składu tekstylnego, producenta i wymaganych danych GPSR/safety.
8. **Magazyn/ceny** — rzeczywiste stany są celowo puste; ceny części produktów nie są zatwierdzone.
9. **Tabela rozmiarów** — wymaga potwierdzenia na podstawie rzeczywistej koszulki/dokumentacji dostawcy.
10. **Działalność nierejestrowana/podatki** — warunki po stronie właściciela nie mogą być zweryfikowane kodem.
11. **Umowy powierzenia/warunki dostawców** — trzeba zaakceptować rzeczywiste warunki Vercel, dostawcy PostgreSQL, Resend, Stripe i przewoźnika oraz wybrać właściwe ustawienia retencji/regionów.

## Funkcja „odstąp od umowy tutaj”

Na 20.10.2026 obowiązek wynikający z dyrektywy 2023/2673 **nie był jeszcze wdrożony do polskiej ustawy**; projekt UC169 opublikowany we wrześniu 2026 pozostawał projektem. Dlatego nie przedstawiamy tej funkcji jako obecnego obowiązku. Jest natomiast zwykła, łatwo dostępna strona odstąpienia i formularz. Przed późniejszym startem/większą aktualizacją trzeba ponownie sprawdzić stan legislacji.

## ODR / ADR

Platforma ODR UE została zlikwidowana 20.07.2025 (nowe skargi od 20.03.2025 nie były przyjmowane). Dokumenty wskazują krajowe mechanizmy ADR/UOKiK i nie podają starego linku ODR jako aktywnego kanału.

## Oficjalne źródła — sprawdzone 20.10.2026

- UOKiK, sprzedaż na odległość / obowiązki informacyjne: https://prawakonsumenta.uokik.gov.pl/prawo-do-informacji/sprzedaz-poza-lokalem-i-na-odleglosc/
- UOKiK, prawo do informacji: https://prawakonsumenta.uokik.gov.pl/pytania-i-odpowiedzi/prawo-do-informacji/
- UOKiK, terminy odstąpienia: https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/terminy-odstapienie/
- UOKiK, wyłączenia odstąpienia: https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/wylaczenia-prawa-do-odstapienia/
- UOKiK, obniżki cen: https://prawakonsumenta.uokik.gov.pl/prawo-do-informacji/informacje-o-obnizkach-cen/
- Biznes.gov.pl, działalność nierejestrowana: https://biznes.gov.pl/pl/firma/zakladanie-firmy/chce-wiedziec-jak-zalozyc-wlasna-firme/dzialalnosc-nierejestrowa-oraz-inne-sytuacje-w-ktorych-nie-trzeba-rejestrowac-firmy
- Biznes.gov.pl, handel internetowy/regulamin: https://biznes.gov.pl/pl/portal/00146
- ELI, Prawo komunikacji elektronicznej — art. 399: https://eli.gov.pl/api/acts/DU/2024/1221/text.html
- ELI, ustawa o świadczeniu usług drogą elektroniczną — art. 8: https://eli.gov.pl/api/acts/DU/2013/1422/text.html
- ELI, Polski Akt o Dostępności: https://eli.gov.pl/api/acts/DU/2024/731/text.html
- Gov.pl, PAD dla e-commerce: https://www.gov.pl/web/dostepnosc-cyfrowa/polski-akt-o-dostepnosci--uslugi-handlu-elektronicznego
- EUR-Lex, GPSR 2023/988, art. 19: https://eur-lex.europa.eu/eli/reg/2023/988/oj/pol
- EUR-Lex, skład tekstylny 1007/2011, art. 16: https://eur-lex.europa.eu/eli/reg/2011/1007/oj/eng
- EUR-Lex, likwidacja ODR 2024/3228: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32024R3228
- KPRM, projekt UC169 (implementacja dyrektywy 2023/2673): https://www.gov.pl/web/premier/projekt-ustawy-o-zmianie-ustawy-o-prawach-konsumenta-oraz-ustawy-o-konsumenckiej-pozyczce-lombardowej
- Stripe, BLIK: https://stripe.com/en-pl/payment-method/blik

## Granice audytu

Nie wykonano prawdziwego zamówienia ani płatności. Bez dostępu do kont właściciela nie można potwierdzić: Stripe live/BLIK, DNS/Vercel domeny, rzeczywistej bazy i jej regionu/backupów, Resend/DKIM/SPF, przewoźnika, danych producenta, stanów, składu, etykiet ani dokumentów źródłowych produktów. Te pozycje pozostają jawnie blokujące.
