export const sizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export type Size = typeof sizes[number];
export const product = {
    id: 'oko-01', slug: 'nie-widze-sie-w-pracy', name: 'Nie widzę się w pracy',
    subtitle: 'Koszulka z okiem • biała', image: '/koszulka.webp',
    description: 'Mam problem ze wzrokiem. Nie widzę się dzisiaj w pracy. Koszulka dla tych, których myśli już dawno rozłożyły leżak.',
    price: 12900, currency: 'PLN', verified: false,
    variants: sizes.map(size => ({ size, available: true, stock: null as number | null })),
    material: 'Skład i gramatura wymagają potwierdzenia.',
    care: 'Instrukcja pielęgnacji zostanie uzupełniona zgodnie z metką producenta.',
    delivery: 'Koszt i termin dostawy zostaną podane przed uruchomieniem sprzedaży.',
    returns: 'Warunki zwrotów oraz dane sprzedawcy są w przygotowaniu.',
};
export const money = (value: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value / 100);
export type CartItem = {
    id: string;
    size: Size;
    quantity: number;
};
export function validCart(value: unknown): CartItem[] {
    if (!Array.isArray(value))
        return [];
    const result: CartItem[] = [];
    for (const item of value.slice(0, 100)) {
        if (typeof item?.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(item.id) || !sizes.includes(item.size) || !Number.isInteger(item.quantity) || item.quantity < 1)
            continue;
        const existing = result.find(x => x.id === item.id && x.size === item.size);
        if (existing)
            existing.quantity = Math.min(10, existing.quantity + item.quantity);
        else
            result.push({ id: item.id, size: item.size, quantity: Math.min(10, item.quantity) });
    }
    return result;
}
