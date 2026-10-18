# Weryfikacja

Wykonano:
- Odczyt obu załączników; użyto oryginalnego logo i koszulki.
- Kontrola TypeScript, testy jednostkowe walidacji koszyka, rozmiarów, origin, formularza, blokad integracji oraz podpisu webhooka (prawidłowy, zmieniony payload, nieprawidłowy podpis, stary timestamp).
- Build podglądu Sites/Vinext.
- Pokrycie wszystkich polskich znaków w plikach WOFF Barlow Condensed 700 oraz Space Grotesk 400/600.
- Natywny build Next.js: podjęto próby Turbopack i Webpack, obie blokuje błąd środowiska ENOENT uv_resident_set_memory. Natywny build Vercel NIE jest potwierdzony.

Do testów manualnych przed startem (nie wykonano tutaj — brak control-browser w środowisku Sites):
- Desktop 1440px/1024px, mobile 390px/320px, brak overflow i czytelny nadruk.
- Logo WebGL, brak WebGL, reduced motion, pauza po ukryciu karty i zejściu poza ekran.
- Menu klawiaturą, modalny fokus, powrót fokusu, Escape, nawigacja anchor.
- Brak rozmiaru, niedostępny XS, rozmiary M/L jako osobne pozycje, ilości 1–10, usunięcie i pusty stan.
- Odświeżenie zachowuje koszyk; uszkodzony localStorage nie łamie strony.
- Formularz: błędy natywne, serwerowe 400/503/429, faktyczne przyjęcie poczty, błąd sieci.
- Statystyki: auth/unavailable/partial/stale, refresh, manual date, brak fikcyjnych sum.
- Konsola, focus-visible, kontrast, VoiceOver/NVDA, wydajność na słabszym telefonie.
- End-to-end Stripe test mode i magazyn Redis według INTEGRATIONS.md.

Nie wykonano prawdziwej płatności, wysyłki poczty ani odczytu prywatnych API. Nie wykonano zrzutów ekranu. Publikacja podglądu nie oznacza gotowości do sprzedaży.
