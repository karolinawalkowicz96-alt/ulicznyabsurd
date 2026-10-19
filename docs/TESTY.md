# Weryfikacja techniczna — 20.10.2026

## Wykonane

- statyczny przegląd wszystkich tras publicznych, API, panelu administratora, checkoutu, modeli danych i integracji;
- sprawdzenie logiki cen/stanu po stronie serwera, transakcji, idempotencji, ochrony panelu i webhooka Stripe;
- sprawdzenie źródeł przechowywania po stronie przeglądarki (`localStorage`, `sessionStorage`, cookie admina) i wyszukanie trackerów/pikseli;
- sprawdzenie, że produkcyjny bootstrap nie nadaje fikcyjnych stanów;
- przegląd SEO: canonical, robots, sitemap, metadata, strukturalne Product/Offer, noindex obszarów prywatnych;
- transpile/syntax check wszystkich 61 plików `.ts/.tsx`: 0 błędów składni;
- sprawdzenie aktualnej wersji online Vercel; była w trybie TEST i zawierała starsze treści;
- sprawdzenie docelowej domeny `www.ulicznyabsurd.pl`; 20.10.2026 zwracała 502.

## Ograniczenie środowiska testowego

W środowisku roboczym nie udało się pobrać zależności npm. Dodatkowa próba `npm ci --offline --ignore-scripts` zakończyła się `ENOTCACHED` (brak paczki `zod-validation-error` w lokalnym cache), a dostęp do rejestru npm nie był dostępny. Z tego powodu w tej sesji nie wykonano wiarygodnego `next build`, ESLint ani Playwright na gotowym bundle. Kod został sprawdzony składniowo przez TypeScript transpiler oraz ręcznie pod kątem ścieżek krytycznych. Po skopiowaniu paczki do normalnego środowiska z dostępem do npm **obowiązkowo** uruchom:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Następnie wykonaj test responsywny (min. 390 px i desktop), pełny zakup TEST, błędy formularzy, odrzucenie niedostępnego wariantu, zmianę ilości, cofanie/odświeżanie, e-mail testowy, logowanie admina i Stripe test mode.

## Nie testowano prawdziwymi danymi

Nie wykonywano produkcyjnej płatności, zamówienia, wysyłki e-mail, tworzenia etykiety przewoźnika ani operacji na kontach Stripe/Vercel/Resend/GitHub właściciela.
