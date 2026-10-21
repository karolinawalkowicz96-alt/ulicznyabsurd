export const platforms = ['Facebook', 'Instagram', 'YouTube', 'TikTok'] as const;
export type Platform = typeof platforms[number];
export const profiles: Record<Platform, string> = {
    Facebook: 'https://www.facebook.com/ulicznyabsurd/',
    Instagram: 'https://www.instagram.com/ulicznyabsurd/',
    YouTube: 'https://www.youtube.com/@UlicznyAbsurd',
    TikTok: 'https://tiktok.com/@ulicznyabsurd',
};
export const faq = [
    ['Jak dobrać rozmiar?', 'Przy produkcie znajdziesz tabelę wymiarów mierzonych na płasko. Porównaj szerokość i długość ze swoją ulubioną koszulką. Wymiary podano w centymetrach, z tolerancją ±5%.'],
    ['Jak zamówić koszulkę?', 'Wybierz dostępny rozmiar i ilość, dodaj produkt do koszyka, a następnie przejdź przez dostawę i płatność.'],
    ['Jakie są metody płatności?', 'Checkout pokazuje wyłącznie metody rzeczywiście aktywne. Płatność online obsługuje Stripe; karta, BLIK lub inna metoda pojawi się tylko wtedy, gdy jest dostępna dla konta i danej transakcji.'],
    ['Kiedy dotrze paczka?', 'Realizujemy zamówienia w ciągu 7 dni roboczych. Do tego należy doliczyć czas transportu. Paczkomat kosztuje 14,99 zł, kurier 18,99 zł, a wysyłka zagraniczna 119 zł.'],
    ['Jak wyglądają zwroty?', 'Standardową koszulkę z gotowym wzorem możesz objąć ustawowym prawem odstąpienia na zasadach opisanych w zakładce Zwroty. Sam druk po zamówieniu nie oznacza automatycznie personalizacji.'],
    ['Chcę nawiązać współpracę. Co dalej?', 'Jeśli formularz kontaktowy jest aktywny, możesz wysłać go na stronie. Zawsze możesz też napisać bezpośrednio na ulicznyabsurd@gmail.com.'],
];
