export const platforms = ['Facebook', 'Instagram', 'YouTube', 'TikTok'] as const;
export type Platform = typeof platforms[number];
export const profiles: Record<Platform, string> = {
    Facebook: 'https://www.facebook.com/ulicznyabsurd/',
    Instagram: 'https://www.instagram.com/ulicznyabsurd/',
    YouTube: 'https://www.youtube.com/@UlicznyAbsurd',
    TikTok: 'https://tiktok.com/@ulicznyabsurd',
};
export const faq = [
    ['Jak dobrać rozmiar?', 'W panelu produktu wybierzesz rozmiar XS–XXL. Wymiary nie są jeszcze potwierdzone — tabela zostanie uzupełniona przed startem sprzedaży.'],
    ['Jak zamówić koszulkę?', 'Wybierz rozmiar i ilość, a następnie dodaj koszulkę do koszyka. Teraz działa podgląd sklepu: nie przyjmujemy zamówień ani płatności.'],
    ['Jakie będą metody płatności?', 'Przygotowujemy integrację Stripe Checkout. Docelowe metody zostaną potwierdzone po aktywacji konta operatora.'],
    ['Kiedy dotrze paczka?', 'Sposoby, ceny i terminy dostawy są do ustalenia. Pokażemy je przed rozpoczęciem sprzedaży i przed płatnością.'],
    ['Jak wyglądają zwroty?', 'Dane sprzedawcy, adres zwrotów i pełna procedura zostaną dodane do regulaminu przed startem sprzedaży.'],
    ['Chcę nawiązać współpracę. Co dalej?', 'Opisz pomysł, markę i zakres współpracy w formularzu. W podglądzie wysyłka jest nieaktywna do czasu skonfigurowania poczty.'],
];
