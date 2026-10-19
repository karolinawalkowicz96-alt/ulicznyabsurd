export const platforms = ['Facebook', 'Instagram', 'YouTube', 'TikTok'] as const;
export type Platform = typeof platforms[number];
export const profiles: Record<Platform, string> = {
    Facebook: 'https://www.facebook.com/ulicznyabsurd/',
    Instagram: 'https://www.instagram.com/ulicznyabsurd/',
    YouTube: 'https://www.youtube.com/@UlicznyAbsurd',
    TikTok: 'https://tiktok.com/@ulicznyabsurd',
};
export const faq = [
    ['Jak dobrać rozmiar?', 'Przy produkcie znajdziesz tabelę wymiarów mierzonych na płasko. Przed uruchomieniem sprzedaży jej zgodność z rzeczywistym modelem musi być potwierdzona przez sprzedawcę.'],
    ['Jak zamówić koszulkę?', 'Wybierz dostępny rozmiar i ilość, dodaj produkt do koszyka, a następnie przejdź przez dostawę i płatność. Jeśli widzisz TRYB TESTOWY, zamówienia nie są realizowane.'],
    ['Jakie są metody płatności?', 'Checkout pokazuje wyłącznie metody rzeczywiście aktywne. Płatność online obsługuje Stripe; karta, BLIK lub inna metoda pojawi się tylko wtedy, gdy jest dostępna dla konta i danej transakcji.'],
    ['Kiedy dotrze paczka?', 'Aktualne metody, koszt i maksymalny termin dostarczenia są pokazywane przed złożeniem rzeczywistego zamówienia oraz na stronie Dostawa i płatności.'],
    ['Jak wyglądają zwroty?', 'Standardową koszulkę z gotowym wzorem możesz objąć ustawowym prawem odstąpienia na zasadach opisanych w zakładce Zwroty. Sam druk po zamówieniu nie oznacza automatycznie personalizacji.'],
    ['Chcę nawiązać współpracę. Co dalej?', 'Jeśli formularz kontaktowy jest aktywny, możesz wysłać go na stronie. Zawsze możesz też napisać bezpośrednio na ulicznyabsurd@gmail.com.'],
];
