import type { ShopProduct } from './shop-types';
export const siteOrigin = 'https://www.ulicznyabsurd.pl';
export const productTitle = (p: ShopProduct) => `Śmieszna koszulka „${p.name}”`;

// Unikalne teksty przy produktach i w meta description. Bez opisów rozmiarów.
const stories: Record<string, string> = {
  "oko-01": "Nie widzę się w pracy, ale w tej koszulce już tak. Zabawny nadruk na trudny poniedziałek i świetny prezent dla kogoś, kto myślami jest już na wolnym.",
  "glowka-04": "Główka pracuje nawet wtedy, gdy portfel odpoczywa. Śmieszna koszulka dla mistrza kombinowania i trafiony prezent dla kogoś, kto ma pomysł na wszystko.",
  "dom-06": "Wyszedł z domu i już żałuje. Śmieszna koszulka dla domatora, któremu najlepiej na własnej kanapie. Dobry prezent dla kogoś, kto zna to uczucie.",
  "zawodowcy-05": "Jedni trenują na siłowni, inni mają własne metody. Śmieszna koszulka z charakterem i świetny prezent dla znajomego, który zawsze jest w formie.",
  "noc-02": "Kiedy inni idą spać, impreza dopiero się rozkręca. Śmieszna koszulka z nadrukiem Nie śpimy, lecimy to prezent dla każdego, kto rozkręca wieczór.",
  "ceny-08": "Ceny rosną, a poczucie humoru na szczęście jest za darmo. Koszulka z zabawnym nadrukiem i prezent dla kogoś, kto przy kasie widział już wszystko.",
  "paliwko-07": "Niektórzy tankują do pełna z wyjątkowym entuzjazmem. Koszulka z piwnym żartem dla dorosłych i prezent dla kumpla, który lubi dobry humor.",
  "szef-03": "Na każdej imprezie ktoś musi dowodzić. Koszulka Szef imprezy to zabawny prezent dla osoby, która zawsze przejmuje stery i rozkręca towarzystwo."
};
export const productStory = (p: Pick<ShopProduct, 'id' | 'name'>) =>
  stories[p.id] || `Śmieszna koszulka „${p.name}” z autorskim nadrukiem Uliczny Absurd. Dobry pomysł na prezent dla każdego, kto ma dystans do siebie i świata.`;
export const productDescription = (p: ShopProduct) => productStory(p);
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
