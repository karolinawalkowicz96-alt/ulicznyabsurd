# Integracje — stan 20.10.2026

## Stripe

Kod tworzy Checkout Session po stronie serwera i korzysta z `automatic_payment_methods`. Nie deklaruje BLIKA jako zawsze dostępnego. BLIK jest metodą obsługiwaną przez Stripe w Polsce dla PLN, ale musi być faktycznie dostępny/aktywny dla konta i transakcji.

Wymagane env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Webhook: `/api/webhooks/stripe`. Statusu „paid” nie nadaje redirect, tylko zweryfikowany webhook. Najpierw test mode, potem osobna konfiguracja live.

## Resend

Wymagane `RESEND_API_KEY`, zweryfikowana domena nadawcza, `EMAIL_FROM`, opcjonalnie `CONTACT_ENABLED=true` + `CONTACT_FROM` i `CONTACT_TO`. Potwierdzenia produkcyjne idą przez outbox; brak konfiguracji nie jest przedstawiany jako udana wysyłka.

## PostgreSQL

`DATABASE_URL` wyłącznie po stronie serwera. Osobne bazy dla Production i Preview/Test. Włącz backup/PITR u rzeczywistego dostawcy. Ustal region, retencję i dokumentację RODO na podstawie faktycznego konta.

## Vercel Blob

`BLOB_READ_WRITE_TOKEN` służy wyłącznie zdjęciom produktów w panelu. Nie przesyłaj tam danych klientów.

## Social media

Publiczne odnośniki do sociali nie osadzają obecnie pikseli ani widgetów. Statystyki w kodzie nie są podstawą do instalowania marketingowego trackingu. Jeżeli później zostanie dodana analityka/piksel, wymaga to osobnej oceny cookies/PKE i aktualizacji polityki.
