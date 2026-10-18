'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, ShoppingBag, X, Plus, Minus, Menu, Check, LoaderCircle } from 'lucide-react';
import LogoScene from './LogoScene';
import { product, sizes, money, validCart, type CartItem, type Size } from '@/lib/catalog';
import { faq, platforms, profiles } from '@/lib/content';
import type { SocialSnapshot } from '@/lib/social/types';
function Mark() { return <img src="/logo-texture.webp" alt="Uliczny Absurd" width="56" height="56" className="mark"/>; }

type ShowcaseProduct = {
    id: string;
    name: string;
    title: [string, string];
    image: string;
    alt: string;
    description: string;
    eyebrow: string;
    photoTag: string;
    stamp: [string, string];
    isStoreProduct?: boolean;
};
const showcaseProducts: ShowcaseProduct[] = [
    {
        id: 'oko-01', name: 'Nie widzę się w pracy', title: ['NIE WIDZĘ SIĘ', 'W PRACY.'], image: '/koszulka.webp',
        alt: 'Biała koszulka z nadrukiem Nie widzę się dzisiaj w pracy',
        description: 'Oko na urlopie. Reszta jakoś sobie poradzi. Dla ludzi z bardzo konkretną wizją dnia.',
        eyebrow: 'PROJEKT 001 / ULICZNY ABSURD', photoTag: 'PROJEKT 001 / BIAŁA', stamp: ['POWAGA?', 'NIE TEN ROZMIAR.'], isStoreProduct: true,
    },
    {
        id: 'noc-02', name: 'Nie śpimy, lecimy', title: ['NIE ŚPIMY,', 'LECIMY.'], image: '/products/nie-spimy-lecimy.webp',
        alt: 'Biała koszulka z napisem Nie śpimy, lecimy i postacią kuli dyskotekowej',
        description: 'Sen może poczekać. Dobry plan zaczyna się wtedy, kiedy reszta miasta już ziewa.',
        eyebrow: 'PROJEKT 002 / NOCNA ZMIANA', photoTag: 'PROJEKT 002 / BIAŁA', stamp: ['TRYB NOCNY', 'WŁĄCZONY'],
    },
    {
        id: 'szef-03', name: 'Szef imprezy', title: ['SZEF', 'IMPREZY.'], image: '/products/szef-imprezy-brzoskwinia.webp',
        alt: 'Biała koszulka z napisem Szef imprezy i wesołą postacią z kuflem',
        description: 'Stanowisko samozwańcze, ale odpowiedzialność pełna. Dla tych, którzy zawsze wiedzą, gdzie jest następny punkt programu.',
        eyebrow: 'PROJEKT 003 / PEŁNA ODPOWIEDZIALNOŚĆ', photoTag: 'PROJEKT 003 / BIAŁA', stamp: ['SZEF JEST', 'TYLKO JEDEN'],
    },
    {
        id: 'glowka-04', name: 'Główka pracuje', title: ['GŁÓWKA', 'PRACUJE.'], image: '/products/glowka-pracuje.webp',
        alt: 'Biała koszulka z napisem Widzisz młody, główka pracuje i wózkiem pełnym butelek',
        description: 'Doświadczenie, spryt i logistyka z odzysku. Koszulka dla ludzi, którzy zawsze znajdą sposób.',
        eyebrow: 'PROJEKT 004 / GŁÓWKA PRACUJE', photoTag: 'PROJEKT 004 / BIAŁA', stamp: ['PLAN?', 'JUŻ JEST'],
    },
    {
        id: 'zawodowcy-05', name: 'Zawodowcy trenują codziennie', title: ['ZAWODOWCY', 'TRENUJĄ.'], image: '/products/zawodowcy-trenuja-fiolet.webp',
        alt: 'Biała koszulka retro z napisem Zawodowcy trenują codziennie',
        description: 'Forma sama się nie zrobi. Regularność, dyscyplina i bardzo własna definicja treningu.',
        eyebrow: 'PROJEKT 005 / TRENING CODZIENNY', photoTag: 'PROJEKT 005 / BIAŁA', stamp: ['FORMA?', 'JEST ROBIONA'],
    },
    {
        id: 'taca-06', name: 'Dycha na tacę', title: ['DYCHA', 'NA TACĘ.'], image: '/products/dycha-na-tace.webp',
        alt: 'Biała koszulka z księdzem w żółtym samochodzie i żartem o cenach paliwa',
        description: 'Kiedy nawet święty budżet nie wytrzymuje cen paliwa. Klasyka ulicznej ekonomii.',
        eyebrow: 'PROJEKT 006 / EKONOMIA ULICZNA', photoTag: 'PROJEKT 006 / BIAŁA', stamp: ['CENY?', 'BEZ LITOŚCI'],
    },
    {
        id: 'dom-07', name: 'Mogłem zostać w domu', title: ['MOGŁEM ZOSTAĆ', 'W DOMU.'], image: '/products/moglem-zostac-w-domu.webp',
        alt: 'Biała koszulka z mokrym kotem i napisem Mogłem zostać w domu',
        description: 'Prognoza była optymistyczna. Rzeczywistość jak zwykle miała własny plan. Dla zawodowych maruderów.',
        eyebrow: 'PROJEKT 007 / POGODA Z CHARAKTEREM', photoTag: 'PROJEKT 007 / BIAŁA', stamp: ['WYJŚCIE?', 'BŁĄD 404'],
    },
    {
        id: 'paliwko-08', name: 'Piwko to moje paliwko', title: ['PIWKO TO MOJE', 'PALIWKO.'], image: '/products/piwko-paliwko.webp',
        alt: 'Biała koszulka z zabawną pompą piwną i napisem Piwko to moje paliwko',
        description: 'Motoryzacja spotyka złoty napój i nagle wszystko nabiera mocy. Projekt z przymrużeniem oka.',
        eyebrow: 'PROJEKT 008 / PEŁNY BAK HUMORU', photoTag: 'PROJEKT 008 / BIAŁA', stamp: ['BAK?', 'PEŁNY'],
    },
    {
        id: 'zawodowcy-retro-09', name: 'Zawodowcy trenują codziennie — retro', title: ['ZAWODOWCY', 'CODZIENNIE.'], image: '/products/zawodowcy-trenuja-zielen.webp',
        alt: 'Biała koszulka retro z postacią w dresie i napisem Zawodowcy trenują codziennie',
        description: 'Ten sam trening, inna liga stylu. Retro wersja dla tych, którzy konsekwencję mają opanowaną.',
        eyebrow: 'PROJEKT 009 / RETRO TRENING', photoTag: 'PROJEKT 009 / BIAŁA', stamp: ['RETRO?', 'ZAWODOWO'],
    },
    {
        id: 'ceny-10', name: 'Ceny lecą w górę', title: ['CENY LECĄ', 'W GÓRĘ.'], image: '/products/ceny-leca-w-gore.webp',
        alt: 'Biała koszulka z kasjerem i napisem Ceny tak lecą w górę, że od małego muszę zapierdalać',
        description: 'Od małego na froncie inflacji. Kasjer wie swoje, paragon wie jeszcze więcej.',
        eyebrow: 'PROJEKT 010 / INFLACJA OD MAŁEGO', photoTag: 'PROJEKT 010 / BIAŁA', stamp: ['TANIEJ?', 'NIE DZIŚ'],
    },
    {
        id: 'szef-11', name: 'Szef imprezy — ujęcie 02', title: ['SZEF', 'IMPREZY.'], image: '/products/szef-imprezy-mieta.webp',
        alt: 'Biała koszulka z napisem Szef imprezy na miętowym pastelowym tle',
        description: 'Szef wraca na drugie ujęcie. Ten sam charakter, jeszcze więcej pastelowego luzu.',
        eyebrow: 'PROJEKT 011 / DRUGIE UJĘCIE', photoTag: 'PROJEKT 011 / BIAŁA', stamp: ['SZEF?', 'OBECNY'],
    },
];
function Dialog({ title, onClose, children, wide = false }: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    wide?: boolean;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => { const el = ref.current; const active = document.activeElement as HTMLElement; el?.showModal(); const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { el?.close(); document.body.style.overflow = old; active?.focus(); }; }, []);
    return <dialog ref={ref} className={wide ? 'dialog wide' : 'dialog'} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget)
        onClose(); }} aria-label={title}><div className="dialog-inner"><div className="dialog-head"><span>{title}</span><button className="icon-button" onClick={onClose} aria-label="Zamknij"><X /></button></div>{children}</div></dialog>;
}
export default function Store({ initialProduct = false }: {
    initialProduct?: boolean;
}) {
    const [cart, setCart] = useState<CartItem[]>([]), [hydrated, setHydrated] = useState(false), [cartOpen, setCartOpen] = useState(false), [productOpen, setProductOpen] = useState(initialProduct), [showcaseIndex, setShowcaseIndex] = useState(0), [menu, setMenu] = useState(false), [size, setSize] = useState<Size | null>(null), [quantity, setQuantity] = useState(1), [error, setError] = useState(''), [toast, setToast] = useState(''), [checkout, setCheckout] = useState(false), [zoom, setZoom] = useState(false);
    const [stats, setStats] = useState<SocialSnapshot[] | null>(null), [statsError, setStatsError] = useState(false), [selected, setSelected] = useState(0);
    const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle'), [formMessage, setFormMessage] = useState('');
    useEffect(() => { try {
        setCart(validCart(JSON.parse(localStorage.getItem('ua-cart-v1') || '[]')));
    }
    catch { } setHydrated(true); const c = new AbortController(); fetch('/api/stats', { signal: c.signal }).then(r => { if (!r.ok)
        throw Error(); return r.json(); }).then(d => setStats((d as {
        platforms: SocialSnapshot[];
    }).platforms)).catch(e => { if (e.name !== 'AbortError')
        setStatsError(true); }); return () => c.abort(); }, []);
    useEffect(() => { if (hydrated)
        try {
            localStorage.setItem('ua-cart-v1', JSON.stringify(cart));
        }
        catch {
            setToast('Przeglądarka nie pozwala zapisać koszyka.');
        } }, [cart, hydrated]);
    useEffect(() => { if (!toast)
        return; const t = setTimeout(() => setToast(''), 4000); return () => clearTimeout(t); }, [toast]);
    const checkoutAttempt = useRef<{
        cart: string;
        id: string;
    } | null>(null);
    const total = cart.reduce((s, x) => s + x.quantity * product.price, 0), count = cart.reduce((s, x) => s + x.quantity, 0);
    function openProduct(index = 0) { setShowcaseIndex(index); setZoom(false); setSize(null); setQuantity(1); setError(''); setProductOpen(true); }
    function add() { if (!size) {
        setError('Najpierw wybierz rozmiar.');
        return;
    } setCart(validCart([...cart, { id: product.id, size, quantity }])); setProductOpen(false); setCartOpen(true); setToast('Koszulka ląduje w koszyku.'); }
    async function pay() { const signature = JSON.stringify(cart); if (checkoutAttempt.current?.cart !== signature)
        checkoutAttempt.current = { cart: signature, id: crypto.randomUUID() }; setCheckout(true); setError(''); try {
        const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart, requestId: checkoutAttempt.current.id }) });
        const d = await r.json() as {
            error?: string;
            url?: string;
        };
        if (!r.ok) {
            if (r.status === 409)
                checkoutAttempt.current = null;
            throw Error(d.error || 'Nie udało się rozpocząć płatności.');
        }
        if (d.url)
            location.assign(d.url);
        else
            throw Error('Brak adresu płatności.');
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setCheckout(false);
    } }
    async function send(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setFormState('sending'); const form = e.currentTarget; const data = Object.fromEntries(new FormData(form)); try {
        const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const d = await r.json() as {
            error?: string;
            url?: string;
        };
        if (!r.ok)
            throw Error(d.error || 'Nie udało się wysłać wiadomości.');
        setFormState('success');
        setFormMessage('Wiadomość została przyjęta. Dzięki za kontakt!');
        form.reset();
    }
    catch (e) {
        setFormState('error');
        setFormMessage((e as Error).message);
    } }
    const current = stats?.[selected];
    const activeShowcase = showcaseProducts[showcaseIndex] || showcaseProducts[0];
    return <><a href="#main" className="skip-link">Przejdź do treści</a><div className="preview-bar">PODGLĄD MARKI I SKLEPU <span>•</span> sprzedaż jeszcze nie wystartowała</div>
 <header className="header"><a href="/" className="brand" aria-label="Uliczny Absurd — strona główna"><Mark /><span>ULICZNY<br />ABSURD</span></a><nav aria-label="Główna nawigacja"><a href="#kolekcja">KOSZULKI</a><a href="#spolecznosc">NASZ INTERNET</a><a href="#kontakt">WSPÓŁPRACA <ArrowUpRight size={16}/></a></nav><div className="header-actions"><button className="cart-button" onClick={() => { setError(''); setCartOpen(true); }}><ShoppingBag size={19}/><span>KOSZYK</span><b>{count}</b></button><button className="icon-button mobile-menu" aria-label="Otwórz menu" onClick={() => setMenu(true)}><Menu /></button></div></header>
 <main id="main"><section className="hero"><div className="hero-grid"><div className="hero-copy"><div className="eyebrow"><i /> 100% ULICZNY ABSURD</div><h1>NOSI SIĘ<br /><span>NIEPOWAŻNIE.</span></h1><p>Filmy, które zostają w głowie.<br />Koszulki, które mówią za Ciebie.</p><div className="hero-cta"><a className="button dark" href="#kolekcja">Zobacz koszulki <ArrowUpRight size={21}/></a><a className="text-link" href="#spolecznosc">Poznaj nasz internet <ArrowUpRight size={18}/></a></div><div className="hero-note"><span className="hand-arrow">↳</span> dobry humor. zły wpływ na powagę.</div></div><div className="hero-object"><div className="orbit"/><LogoScene /><span className="sticker sticker-pink">UWAGA!<br />BRAK POWAGI</span></div></div><div className="hero-bottom"><span>PRZEWIŃ. BĘDZIE JESZCZE DZIWNIEJ.</span><a href="#kolekcja" aria-label="Przejdź do kolekcji"><ArrowDown size={22}/></a><span>FILMY × STREETWEAR × ABSURD</span></div></section>
 <div className="ticker" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>NIE WSZYSTKO MUSI MIEĆ SENS <b>✳</b> ALE MOŻE MIEĆ DOBRY NADRUK <b>✳</b> </span>)}</div></div>
 <section className="collection section" id="kolekcja"><div className="section-heading"><div><span className="eyebrow">01 / DO NOSZENIA</span><h2>ŻARTY NA BOK.<br /><span>KOSZULKI NA SIEBIE.</span></h2></div><p>Internetowy humor wychodzi na ulicę.<br />Jedna kolekcja. Dużo charakteru.</p></div><div className="product-list">{showcaseProducts.map((item, i) => <div className={`product-feature ${i % 2 ? 'reverse' : ''}`} key={item.id}><button className="product-photo" onClick={() => openProduct(i)} aria-label={`Zobacz koszulkę ${item.name}`}><img src={item.image} alt={item.alt} width="1215" height="1295" loading={i < 2 ? 'eager' : 'lazy'}/><span className="photo-tag">{item.photoTag}</span><span className="photo-plus"><Plus /></span></button><div className="product-copy"><span className="small-stamp">{item.stamp[0]}<br />{item.stamp[1]}</span><span className="eyebrow">{item.eyebrow}</span><h3>{item.title[0]}<br />{item.title[1]}</h3><p>{item.description}</p><div className="product-price"><strong>{money(product.price)}</strong><span>Cena demonstracyjna</span></div><div className="size-preview">XS <span>S</span> <span>M</span> <span>L</span> <span>XL</span> <span>XXL</span></div><button className="button dark full" onClick={() => openProduct(i)}>Obejrzyj koszulkę <ArrowUpRight /></button><span className="product-footnote">Oryginalny materiał marki. Sprzedaż w przygotowaniu.</span></div></div>)}</div></section>
 <section className="manifesto"><span className="eyebrow">MIKROFON W DŁOŃ. POWAGA W KĄT.</span><h2>ULICA PISZE SCENARIUSZE.<br />MY DOKŁADAMY <span>ABSURD.</span></h2><div className="manifesto-bottom"><span className="mic-symbol" aria-hidden="true">✳</span><p>Tworzymy zabawne filmy na Facebooka, TikToka,<br />YouTube i Instagram. Teraz ten sam humor<br />możesz zabrać ze sobą. Na koszulce.</p><a href="#kontakt" className="round-link" aria-label="Porozmawiajmy o współpracy"><ArrowUpRight size={34}/></a></div></section>
 <section className="community section" id="spolecznosc"><div className="section-heading"><div><span className="eyebrow">02 / PO DRUGIEJ STRONIE EKRANU</span><h2>NASZ KAWAŁEK<br />INTERNETU.</h2></div><p>Cztery platformy.<br />Jedno niepoważne uniwersum.</p></div><div className="social-layout"><div className="social-tabs" role="tablist" aria-label="Platforma społecznościowa">{platforms.map((p, i) => <button key={p} role="tab" id={`tab-${i}`} aria-selected={selected === i} aria-controls="social-panel" tabIndex={selected === i ? 0 : -1} onKeyDown={e => { if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        const n = (selected + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : 3)) % 4;
        setSelected(n);
        document.getElementById(`tab-${n}`)?.focus();
    } }} onClick={() => setSelected(i)}><span className="platform-number">0{i + 1}</span>{p}<ArrowUpRight /></button>)}</div><div className="social-display" role="tabpanel" id="social-panel" aria-labelledby={`tab-${selected}`}><span className="status-pill"><i />{current?.status === 'live' ? 'DANE Z API' : current?.status === 'manual' ? 'ZWERYFIKOWANE RĘCZNIE' : current?.status === 'stale' ? 'DANE NIEAKTUALNE' : current?.status === 'unavailable' ? 'API NIEDOSTĘPNE' : current?.status === 'partial' ? 'DANE CZĘŚCIOWE' : 'BRAK AUTORYZACJI / PODGLĄD'}</span><div className="social-number" key={selected}>{current?.followers != null ? <AnimatedNumber value={current.followers}/> : statsError ? '—' : !stats ? '…' : '— —'}</div><h3>{selected === 2 ? 'subskrypcje' : 'obserwacje'} na {platforms[selected]}</h3><p>{statsError ? 'Nie udało się pobrać statusu. Spróbuj ponownie później.' : current?.followers != null ? 'Pobrane wartości odnoszą się do tej platformy.' : 'Tu pojawią się prawdziwe liczby. Bez podkręcania licznika.'}</p>{current?.views != null && <p>{current.views.toLocaleString('pl-PL')} wyświetleń • {current.viewsScope}</p>}{profiles[platforms[selected]] ? <a className="text-link" href={profiles[platforms[selected]]!} target="_blank" rel="noreferrer">Zobacz profil <ArrowUpRight size={18}/></a> : <span className="social-pending">Oficjalny link czeka na potwierdzenie</span>}{current?.note && <p>{current.note}</p>}<small>{current?.updatedAt ? `Aktualizacja: ${new Date(current.updatedAt).toLocaleString('pl-PL')}` : 'Brak daty aktualizacji — nie podłączono danych.'}</small></div></div><div className="social-total"><span>ŁĄCZNIE NA CZTERECH PLATFORMACH</span><strong>{stats?.every(s => s.followers !== null) ? stats.reduce((sum, s) => sum + (s.followers || 0), 0).toLocaleString('pl-PL') : '—'}</strong><p>Suma obserwacji i subskrypcji.<br />Nie liczba unikalnych osób. Daty odczytów mogą się różnić.</p></div></section>
 <section className="contact section" id="kontakt"><div className="contact-intro"><span className="eyebrow">03 / ZRÓBMY COŚ NIEPOWAŻNEGO</span><h2>DOBRY<br />POMYSŁ?<br /><span>DAWAJ GO.</span></h2><p>Współpraca z marką, wspólny film<br />albo po prostu coś do powiedzenia.<br />Tu jest na to miejsce.</p><span className="contact-arrow" aria-hidden="true">↗</span></div><form onSubmit={send} className="contact-form"><div className="form-notice">PODGLĄD / Wysyłka czeka na konfigurację poczty.</div><div className="form-row"><label>Imię lub nazwa firmy<input name="name" required maxLength={120} autoComplete="organization" placeholder="Jak się nazywasz?"/></label><label>Adres e-mail<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="twoj@email.pl"/></label></div><label>O czym pogadamy?<select name="subject" required defaultValue=""><option value="" disabled>Wybierz temat</option><option>Współpraca z marką</option><option>Pytanie o koszulkę</option><option>Inna sprawa</option></select></label><label>Twoja wiadomość<textarea name="message" required minLength={10} maxLength={5000} rows={4} placeholder="Nie musi być poważnie. Wystarczy konkretnie."/></label><div className="honeypot" aria-hidden="true"><label>Strona WWW<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="privacy-note">Podane dane służą wyłącznie obsłudze zapytania. Informacje o administratorze i zasadach przetwarzania wymagają uzupełnienia przed aktywacją formularza. <a href="/prywatnosc">Polityka prywatności — szkic</a>.</p><button className="button dark full" disabled={formState === 'sending'} type="submit">{formState === 'sending' ? <>Wysyłanie… <LoaderCircle className="spin"/></> : <>Wyślij wiadomość <ArrowUpRight /></>}</button><p role="status" className={`form-feedback ${formState}`}>{formMessage}</p></form></section>
 <section className="faq section" id="faq"><div><span className="eyebrow">04 / ZANIM ZAPYTASZ</span><h2>BEZ GŁUPICH<br />PYTAŃ.</h2><p>Odpowiedzi całkiem na serio.</p></div><div className="faq-list">{faq.map(([q, a], i) => <details key={q}><summary><span><small>0{i + 1}</small>{q}</span><Plus size={21}/></summary><p>{a}</p></details>)}</div></section>
 </main><footer><div className="footer-top"><a href="/" className="brand"><Mark /><span>ULICZNY<br />ABSURD</span></a><p>Życie jest za krótkie<br />na nudne koszulki.</p><nav aria-label="Nawigacja stopki"><a href="#kolekcja">Koszulki</a><a href="#spolecznosc">Nasz internet</a><a href="#kontakt">Kontakt</a></nav><nav aria-label="Informacje prawne"><a href="/regulamin">Regulamin — szkic</a><a href="/prywatnosc">Prywatność — szkic</a><a href="#faq">Pytania i odpowiedzi</a></nav></div><div className="footer-wordmark" aria-hidden="true">ULICZNY ABSURD</div><div className="footer-bottom"><span>© {new Date().getFullYear()} ULICZNY ABSURD</span><span>ZERO POWAGI. DUŻO CHARAKTERU.</span><a href="#main">DO GÓRY ↑</a></div></footer>
 {toast && <div className="toast" role="status"><Check size={18}/>{toast}</div>}
 {menu && <Dialog title="MENU" onClose={() => setMenu(false)}><nav className="menu-links">{[['#kolekcja', 'Koszulki'], ['#spolecznosc', 'Nasz internet'], ['#kontakt', 'Współpraca'], ['#faq', 'FAQ']].map(([h, t]) => <a href={h} key={h} onClick={() => setMenu(false)}>{t}<ArrowUpRight /></a>)}</nav></Dialog>}
 {productOpen && <Dialog title={`PROJEKT ${String(showcaseIndex + 1).padStart(3, '0')} / SZCZEGÓŁY KOSZULKI`} onClose={() => setProductOpen(false)} wide><div className="product-panel"><div><button className={`gallery ${zoom ? 'zoom' : ''}`} onClick={() => setZoom(!zoom)} aria-label={zoom ? 'Oddal zdjęcie' : 'Powiększ nadruk'}><img src={activeShowcase.image} alt={activeShowcase.alt}/><span>{zoom ? '− Oddal' : '+ Powiększ nadruk'}</span></button><small className="gallery-caption">{String(showcaseIndex + 1).padStart(2, '0')} / Przód • podgląd projektu</small></div><div className="product-details"><span className="eyebrow">BIAŁA KOSZULKA / ULICZNY ABSURD</span><h2>{activeShowcase.name}</h2><p>{activeShowcase.description}</p><div className="product-price"><strong>{money(product.price)}</strong><span>Cena demonstracyjna</span></div>{activeShowcase.isStoreProduct ? <><fieldset className="size-picker"><legend>Wybierz rozmiar <span>• wymagane</span></legend><div>{product.variants.map(v => <button key={v.size} type="button" disabled={!v.available} aria-pressed={size === v.size} onClick={() => { setSize(v.size); setError(''); }}>{v.size}</button>)}</div><small>Warianty demonstracyjne. XS: niedostępny w podglądzie.</small></fieldset><details className="product-info"><summary>Tabela rozmiarów <Plus size={16}/></summary><p>Wymiary nie zostały jeszcze dostarczone. Nie dobieraj rozmiaru na podstawie tego podglądu.</p><table><thead><tr><th>Rozmiar</th><th>Szerokość</th><th>Długość</th></tr></thead><tbody>{sizes.map(s => <tr key={s}><td>{s}</td><td>Do ustalenia</td><td>Do ustalenia</td></tr>)}</tbody></table></details><div className="buy-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Zmniejsz ilość" disabled={quantity <= 1}><Minus size={16}/></button><output aria-label="Ilość">{quantity}</output><button onClick={() => setQuantity(Math.min(10, quantity + 1))} disabled={quantity >= 10} aria-label="Zwiększ ilość"><Plus size={16}/></button></div><button className="button dark" onClick={add}>Do koszyka <ShoppingBag size={19}/></button></div>{error && <p role="alert" className="error">{error}</p>}<p className="demo-note">Tryb demonstracyjny — dodanie do koszyka nie rezerwuje towaru.</p>{[['Materiał', product.material], ['Pielęgnacja', product.care], ['Dostawa i zwroty', product.delivery + ' ' + product.returns]].map(([t, c]) => <details className="product-info" key={t}><summary>{t}<Plus size={16}/></summary><p>{c}</p></details>)}<a className="product-permalink" href={`/produkt/${product.slug}`}>Stały adres produktu ↗</a></> : <><div className="size-preview modal-size-preview">XS <span>S</span> <span>M</span> <span>L</span> <span>XL</span> <span>XXL</span></div><button className="button dark full" disabled>Sprzedaż w przygotowaniu <ShoppingBag size={19}/></button><p className="demo-note">Projekt jest dodany do kolekcji jako podgląd. Obsługa koszyka dla tego wzoru nie została jeszcze uruchomiona.</p></>}</div></div></Dialog>}
 {cartOpen && <Dialog title={`TWÓJ KOSZYK (${count})`} onClose={() => setCartOpen(false)}>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={52}/><h2>TU JESZCZE<br />NIE MA ABSURDU.</h2><p>Czas coś z tym zrobić.</p><button className="button dark" onClick={() => { setCartOpen(false); openProduct(); }}>Zobacz koszulkę <ArrowRight /></button></div> : <><div className="cart-items">{cart.map(x => <div className="cart-item" key={x.size}><img src={product.image} alt="Koszulka z okiem"/><div><h3>{product.name}</h3><p>Biała / Rozmiar {x.size}</p><strong>{money(x.quantity * product.price)}</strong><div className="cart-controls"><div className="quantity"><button aria-label={`Zmniejsz ilość rozmiaru ${x.size}`} disabled={x.quantity <= 1} onClick={() => setCart(cart.map(c => c.size === x.size ? { ...c, quantity: c.quantity - 1 } : c))}><Minus size={15}/></button><output>{x.quantity}</output><button aria-label={`Zwiększ ilość rozmiaru ${x.size}`} disabled={x.quantity >= 10} onClick={() => setCart(cart.map(c => c.size === x.size ? { ...c, quantity: c.quantity + 1 } : c))}><Plus size={15}/></button></div><button className="remove" onClick={() => setCart(cart.filter(c => c.size !== x.size))}>Usuń</button></div></div></div>)}</div><div className="cart-summary"><div><span>Produkty</span><strong>{money(total)}</strong></div><div><span>Dostawa</span><span>Do ustalenia</span></div><div className="cart-total"><strong>Suma produktów</strong><strong>{money(total)}</strong></div><p>Ceny demonstracyjne. Sprzedaż i płatności są nieaktywne.</p><button className="button dark full" disabled={checkout} onClick={pay}>{checkout ? 'Sprawdzanie…' : 'Przejdź do finalizacji'}<ArrowRight /></button>{error && <p role="alert" className="error">{error}</p>}<button className="continue" onClick={() => setCartOpen(false)}>Kontynuuj oglądanie</button></div></>}</Dialog>}
 </>;
}
function AnimatedNumber({ value }: {
    value: number;
}) { const ref = useRef<HTMLSpanElement>(null); const [n, setN] = useState(value); useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setN(value);
    return;
} let frame = 0; const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting)
    return; const start = performance.now(); const step = (t: number) => { const p = Math.min((t - start) / 800, 1); setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1)
    frame = requestAnimationFrame(step); }; frame = requestAnimationFrame(step); io.disconnect(); }); if (ref.current)
    io.observe(ref.current); return () => { io.disconnect(); cancelAnimationFrame(frame); }; }, [value]); return <span ref={ref}>{n.toLocaleString('pl-PL')}</span>; }
