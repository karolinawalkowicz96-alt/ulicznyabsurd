'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, ShoppingBag, X, Plus, Minus, Menu, Check, LoaderCircle } from 'lucide-react';
import LogoScene from './LogoScene';
import Eyes from './Eyes';
import { product, sizes, money, validCart, type CartItem, type Size } from '@/lib/catalog';
import { faq, platforms, profiles } from '@/lib/content';
import type { SocialSnapshot } from '@/lib/social/types';
function Mark() { return <img src="/logo-texture.webp" alt="Uliczny Absurd" width="56" height="56" className="mark"/>; }
function SocialGlyph({ platform }: { platform: (typeof platforms)[number] }) {
    if (platform === 'Facebook') return <span className="social-glyph social-glyph-facebook" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M37 56V34h8l2-9H37v-5c0-3 2-5 6-5h5V7c-2-1-6-1-10-1-10 0-16 6-16 15v4h-7v9h7v22z" fill="currentColor"/></svg></span>;
    if (platform === 'Instagram') return <span className="social-glyph social-glyph-instagram" aria-hidden="true"><svg viewBox="0 0 64 64"><rect x="12" y="12" width="40" height="40" rx="12" fill="none" stroke="currentColor" strokeWidth="5"/><circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="5"/><circle cx="45" cy="19" r="3.5" fill="currentColor"/></svg></span>;
    if (platform === 'YouTube') return <span className="social-glyph social-glyph-youtube" aria-hidden="true"><svg viewBox="0 0 64 64"><rect x="7" y="15" width="50" height="34" rx="11" fill="currentColor"/><path d="m27 23 17 9-17 9z" fill="var(--ink)"/></svg></span>;
    return <span className="social-glyph social-glyph-tiktok" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M38 10c2 8 7 12 14 13v10c-5 0-10-2-14-5v15c0 9-7 16-16 16S6 52 6 43s7-16 16-16c2 0 4 0 6 1v10c-2-1-3-1-5-1-4 0-7 3-7 7s3 7 7 7 7-3 7-8V10z" fill="currentColor"/></svg></span>;
}

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
        id: 'dom-06', name: 'Mogłem zostać w domu', title: ['MOGŁEM ZOSTAĆ', 'W DOMU.'], image: '/products/moglem-zostac-w-domu.webp',
        alt: 'Biała koszulka z mokrym kotem i napisem Mogłem zostać w domu',
        description: 'Prognoza była optymistyczna. Rzeczywistość jak zwykle miała własny plan. Dla zawodowych maruderów.',
        eyebrow: 'PROJEKT 006 / POGODA Z CHARAKTEREM', photoTag: 'PROJEKT 006 / BIAŁA', stamp: ['WYJŚCIE?', 'BŁĄD 404'],
    },
    {
        id: 'paliwko-07', name: 'Piwko to moje paliwko', title: ['PIWKO TO MOJE', 'PALIWKO.'], image: '/products/piwko-paliwko.webp',
        alt: 'Biała koszulka z zabawną pompą piwną i napisem Piwko to moje paliwko',
        description: 'Motoryzacja spotyka złoty napój i nagle wszystko nabiera mocy. Projekt z przymrużeniem oka.',
        eyebrow: 'PROJEKT 007 / PEŁNY BAK HUMORU', photoTag: 'PROJEKT 007 / BIAŁA', stamp: ['BAK?', 'PEŁNY'],
    },
    {
        id: 'ceny-08', name: 'Ceny lecą w górę', title: ['CENY LECĄ', 'W GÓRĘ.'], image: '/products/ceny-leca-w-gore.webp',
        alt: 'Biała koszulka z kasjerem i napisem Ceny tak lecą w górę, że od małego muszę zapierdalać',
        description: 'Od małego na froncie inflacji. Kasjer wie swoje, paragon wie jeszcze więcej.',
        eyebrow: 'PROJEKT 008 / INFLACJA OD MAŁEGO', photoTag: 'PROJEKT 008 / BIAŁA', stamp: ['TANIEJ?', 'NIE DZIŚ'],
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
    const [stats, setStats] = useState<SocialSnapshot[] | null>(null), [statsError, setStatsError] = useState(false), [statsRefreshing, setStatsRefreshing] = useState(false), [selected, setSelected] = useState(0);
    const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle'), [formMessage, setFormMessage] = useState('');
    useEffect(() => { try {
        setCart(validCart(JSON.parse(localStorage.getItem('ua-cart-v1') || '[]')));
    }
    catch { } setHydrated(true); }, []);
    useEffect(() => { loadStats(true); const timer = window.setInterval(() => loadStats(true), 5 * 60 * 1000); return () => window.clearInterval(timer); }, []);
    async function loadStats(silent = false) {
        if (!silent) setStatsRefreshing(true);
        try {
            const r = await fetch(`/api/stats?t=${Date.now()}`, { cache: 'no-store' });
            if (!r.ok) throw Error();
            const d = await r.json() as { platforms: SocialSnapshot[] };
            setStats(d.platforms);
            setStatsError(false);
        }
        catch { setStatsError(true); }
        finally { if (!silent) setStatsRefreshing(false); }
    }
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
    const viewSources = stats?.filter(item => item.views !== null).length || 0;
    const totalViews = viewSources ? stats!.reduce((sum, item) => sum + (item.views || 0), 0) : null;
    const totalFollowers = stats?.every(item => item.followers !== null) ? stats.reduce((sum, item) => sum + (item.followers || 0), 0) : null;
    const activeShowcase = showcaseProducts[showcaseIndex] || showcaseProducts[0];
    return <><a href="#main" className="skip-link">Przejdź do treści</a><div className="preview-bar">PODGLĄD MARKI I SKLEPU <span>•</span> sprzedaż jeszcze nie wystartowała</div>
 <header className="header"><a href="/" className="brand" aria-label="Uliczny Absurd — strona główna"><Mark /><span>ULICZNY<br />ABSURD</span></a><nav aria-label="Główna nawigacja"><a href="#kolekcja">KOSZULKI</a><a href="#spolecznosc">NASZ INTERNET</a><a href="#kontakt">WSPÓŁPRACA <ArrowUpRight size={16}/></a></nav><div className="header-actions"><button className="cart-button" onClick={() => { setError(''); setCartOpen(true); }}><ShoppingBag size={19}/><span>KOSZYK</span><b>{count}</b></button><button className="icon-button mobile-menu" aria-label="Otwórz menu" onClick={() => setMenu(true)}><Menu /></button></div></header>
 <main id="main"><section className="hero"><div className="hero-grid"><div className="hero-copy"><div className="eyebrow"><i /> 100% ULICZNY ABSURD</div><h1>POWAGA?<br /><span>NIE NOSZĘ.</span></h1><p>Filmy, które zostają w głowie.<br />Koszulki, które mówią za Ciebie.</p><div className="hero-cta"><a className="button dark" href="#kolekcja">Zobacz koszulki <ArrowUpRight size={21}/></a><a className="text-link" href="#spolecznosc">Poznaj nasz internet <ArrowUpRight size={18}/></a></div><div className="hero-note"><span className="hand-arrow">↳</span> dobry humor. zły wpływ na powagę.</div></div><div className="hero-object"><div className="orbit"/><span className="hero-spark" aria-hidden="true">✳</span><span className="hero-edition">EST. NA ULICY<br/>NOSZONE WSZĘDZIE</span><LogoScene /><span className="sticker sticker-pink">UWAGA!<br />BRAK POWAGI</span></div></div><div className="hero-bottom"><span>PRZEWIŃ. BĘDZIE JESZCZE DZIWNIEJ.</span><a href="#kolekcja" aria-label="Przejdź do kolekcji"><ArrowDown size={22}/></a><span>FILMY × STREETWEAR × ABSURD</span></div></section>
 <div className="ticker" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>NIE WSZYSTKO MUSI MIEĆ SENS <b>✳</b> ALE MOŻE MIEĆ DOBRY NADRUK <b>✳</b> </span>)}</div></div>
 <section className="collection section" id="kolekcja">
 <div className="feature-heading"><span className="eyebrow">01 / POCZUCIE HUMORU W TWOIM ROZMIARZE</span><h2>Nie do pracy.<br/><em>Do ludzi.</em></h2><p>Nie musisz nic mówić.<br/>Ta koszulka zrobi to za Ciebie.</p></div>
 <Featured item={showcaseProducts[0]} onOpen={() => openProduct(0)}/>
 <div className="collection-grid-heading"><h2>Reszta też<br/>ma coś do powiedzenia.</h2><span>06 WZORÓW / ZERO POWAGI</span></div>
 <div className="compact-grid">{showcaseProducts.map((item,i) => i !== 0 && i !== 2 && <button className="compact-product" key={item.id} onClick={() => openProduct(i)}><div><img src={item.image} alt={item.alt} loading="lazy" width="600" height="640"/><span className="compact-plus"><ArrowUpRight/></span></div><span className="compact-caption"><strong>{item.name}</strong><span>Obejrzyj ↗</span></span></button>)}</div>
 <div className="boss-feature"><div className="feature-heading"><span className="eyebrow">PO GODZINACH / PRZEJMUJESZ DOWODZENIE</span><h2>Nie ma szefa?<br/><em>Już jest.</em></h2></div><Featured item={showcaseProducts[2]} onOpen={() => openProduct(2)}/></div>
 </section>
 <section className="lookbook section"><div className="section-heading"><div><span className="eyebrow">TAK SIĘ NOSI ABSURD</span><h2>Z INTERNETU.<br/>PROSTO W ŻYCIE.</h2></div><p>Na urlop. Na miasto. Na grilla.<br/>Powagę zostaw w domu.</p></div><div className="lookbook-grid">{[{image:'oko',index:0,label:'Dzisiaj? Poza biurem.'},{image:'noc',index:1,label:'Jeszcze jeden numer.'},{image:'paliwko',index:6,label:'Pełny bak. Dobry skład.'},{image:'zawodowcy',index:4,label:'Forma na każdy dzień.'}].map(x=><button key={x.image} onClick={()=>openProduct(x.index)}><img src={`/lookbook/${x.image}.webp`} alt={showcaseProducts[x.index].name + ' — stylizacja'} loading="lazy" width="800" height="1200"/><span>{x.label}<ArrowUpRight size={20}/></span></button>)}</div></section>
 <Eyes/>
 <section className="community section" id="spolecznosc"><div className="section-heading"><div><span className="eyebrow">02 / PO DRUGIEJ STRONIE EKRANU</span><h2>NASZ KAWAŁEK<br />INTERNETU.</h2></div><p>Cztery platformy.<br />Jedno niepoważne uniwersum.</p></div><div className="social-layout"><div className="social-tabs" role="tablist" aria-label="Platforma społecznościowa">{platforms.map((p, i) => <button key={p} role="tab" id={`tab-${i}`} aria-selected={selected === i} aria-controls="social-panel" tabIndex={selected === i ? 0 : -1} onKeyDown={e => { if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        const n = (selected + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : 3)) % 4;
        setSelected(n);
        document.getElementById(`tab-${n}`)?.focus();
    } }} onClick={() => setSelected(i)}><span className="platform-number">0{i + 1}</span><SocialGlyph platform={p}/><span className="platform-name">{p}</span><ArrowUpRight /></button>)}</div><div className="social-display" role="tabpanel" id="social-panel" aria-labelledby={`tab-${selected}`}><div className="social-display-head"><SocialGlyph platform={platforms[selected]}/><span className="status-pill"><i />{current?.status === 'live' ? 'DANE Z API' : current?.status === 'manual' ? 'ZWERYFIKOWANE RĘCZNIE' : current?.status === 'stale' ? 'DANE NIEAKTUALNE' : current?.status === 'unavailable' ? 'API NIEDOSTĘPNE' : current?.status === 'partial' ? 'DANE CZĘŚCIOWE' : 'PODŁĄCZ API'}</span></div><div className="social-number" key={selected}>{current?.followers != null ? <AnimatedNumber value={current.followers}/> : statsError ? '—' : !stats ? '…' : '— —'}</div><h3>{platforms[selected] === 'YouTube' ? 'subskrypcje' : 'obserwacje'} na {platforms[selected]}</h3><p>{statsError ? 'Nie udało się pobrać aktualnych statystyk.' : current?.followers != null ? 'Liczba pobrana z oficjalnego API platformy.' : 'Link działa już teraz. Licznik pojawi się po podłączeniu klucza API.'}</p>{current?.views != null && <div className="platform-views"><span>WYŚWIETLENIA</span><strong><AnimatedNumber value={current.views}/></strong><small>{current.viewsScope}</small></div>}<a className="social-profile-link" href={profiles[platforms[selected]]} target="_blank" rel="noreferrer">Otwórz {platforms[selected]} <ArrowUpRight size={19}/></a>{current?.note && <p>{current.note}</p>}<small>{current?.updatedAt ? `Aktualizacja: ${new Date(current.updatedAt).toLocaleString('pl-PL')}` : 'Statystyki czekają na konfigurację API.'}</small></div></div><div className="views-total-card"><div className="views-total-copy"><span className="live-kicker"><i/> ŁĄCZNE WYŚWIETLENIA / LIVE</span><strong>{totalViews !== null ? <AnimatedNumber value={totalViews}/> : stats ? '— —' : '…'}</strong><p>Suma wyświetleń z platform, które udostępniają dane przez podłączone API. Aktualizacja automatyczna co 5 minut.</p></div><div className="views-total-side"><span className="sources-count">ŹRÓDŁA {viewSources}/4</span><button className="refresh-stats" type="button" disabled={statsRefreshing} onClick={() => loadStats(false)}>{statsRefreshing ? <><LoaderCircle className="spin" size={17}/> ODŚWIEŻAM</> : <>ODŚWIEŻ DANE <ArrowRight size={17}/></>}</button><span className="followers-total">ŁĄCZNE OBSERWACJE {totalFollowers !== null ? totalFollowers.toLocaleString('pl-PL') : '—'}</span></div></div></section>
 <section className="contact section" id="kontakt"><div className="contact-intro"><span className="eyebrow">03 / ZRÓBMY COŚ NIEPOWAŻNEGO</span><h2>DOBRY<br />POMYSŁ?<br /><span>DAWAJ GO.</span></h2><p>Współpraca z marką, wspólny film<br />albo po prostu coś do powiedzenia.<br />Tu jest na to miejsce.</p><span className="contact-arrow" aria-hidden="true">↗</span></div><form onSubmit={send} className="contact-form"><div className="form-notice">PODGLĄD / Wysyłka czeka na konfigurację poczty.</div><div className="form-row"><label>Imię lub nazwa firmy<input name="name" required maxLength={120} autoComplete="organization" placeholder="Jak się nazywasz?"/></label><label>Adres e-mail<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="twoj@email.pl"/></label></div><label>O czym pogadamy?<select name="subject" required defaultValue=""><option value="" disabled>Wybierz temat</option><option>Współpraca z marką</option><option>Pytanie o koszulkę</option><option>Inna sprawa</option></select></label><label>Twoja wiadomość<textarea name="message" required minLength={10} maxLength={5000} rows={4} placeholder="Nie musi być poważnie. Wystarczy konkretnie."/></label><div className="honeypot" aria-hidden="true"><label>Strona WWW<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="privacy-note">Podane dane służą wyłącznie obsłudze zapytania. Informacje o administratorze i zasadach przetwarzania wymagają uzupełnienia przed aktywacją formularza. <a href="/prywatnosc">Polityka prywatności — szkic</a>.</p><button className="button dark full" disabled={formState === 'sending'} type="submit">{formState === 'sending' ? <>Wysyłanie… <LoaderCircle className="spin"/></> : <>Wyślij wiadomość <ArrowUpRight /></>}</button><p role="status" className={`form-feedback ${formState}`}>{formMessage}</p></form></section>
 <section className="faq section" id="faq"><div><span className="eyebrow">04 / ZANIM ZAPYTASZ</span><h2>BEZ GŁUPICH<br />PYTAŃ.</h2><p>Odpowiedzi całkiem na serio.</p></div><div className="faq-list">{faq.map(([q, a], i) => <details key={q}><summary><span><small>0{i + 1}</small>{q}</span><Plus size={21}/></summary><p>{a}</p></details>)}</div></section>
 </main><footer><div className="footer-top"><a href="/" className="brand"><Mark /><span>ULICZNY<br />ABSURD</span></a><p>Życie jest za krótkie<br />na nudne koszulki.</p><nav aria-label="Nawigacja stopki"><a href="#kolekcja">Koszulki</a><a href="#spolecznosc">Nasz internet</a><a href="#kontakt">Kontakt</a></nav><nav aria-label="Informacje prawne"><a href="/regulamin">Regulamin — szkic</a><a href="/prywatnosc">Prywatność — szkic</a><a href="#faq">Pytania i odpowiedzi</a></nav></div><div className="footer-wordmark" aria-hidden="true">ULICZNY ABSURD</div><div className="footer-bottom"><span>© {new Date().getFullYear()} ULICZNY ABSURD</span><span>ZERO POWAGI. DUŻO CHARAKTERU.</span><a href="#main">DO GÓRY ↑</a></div></footer>
 {toast && <div className="toast" role="status"><Check size={18}/>{toast}</div>}
 {menu && <Dialog title="MENU" onClose={() => setMenu(false)}><nav className="menu-links">{[['#kolekcja', 'Koszulki'], ['#spolecznosc', 'Nasz internet'], ['#kontakt', 'Współpraca'], ['#faq', 'FAQ']].map(([h, t]) => <a href={h} key={h} onClick={() => setMenu(false)}>{t}<ArrowUpRight /></a>)}</nav></Dialog>}
 {productOpen && <Dialog title={`PROJEKT ${String(showcaseIndex + 1).padStart(3, '0')} / SZCZEGÓŁY KOSZULKI`} onClose={() => setProductOpen(false)} wide><div className={`product-panel ${showcaseIndex === 2 ? "peach-panel" : ""}`}><div><button className={`gallery ${zoom ? 'zoom' : ''}`} onClick={() => setZoom(!zoom)} aria-label={zoom ? 'Oddal zdjęcie' : 'Powiększ nadruk'}><img src={activeShowcase.image} alt={activeShowcase.alt}/><span>{zoom ? '− Oddal' : '+ Powiększ nadruk'}</span></button>{({0:"oko",1:"noc",4:"zawodowcy",6:"paliwko"} as Record<number,string>)[showcaseIndex] && <img className="product-lifestyle" src={`/lookbook/${({0:"oko",1:"noc",4:"zawodowcy",6:"paliwko"} as Record<number,string>)[showcaseIndex]}.webp`} alt={`${activeShowcase.name} — na modelu`} loading="lazy"/>}<small className="gallery-caption">{String(showcaseIndex + 1).padStart(2, '0')} / Przód • podgląd projektu</small></div><div className="product-details"><span className="eyebrow">BIAŁA KOSZULKA / ULICZNY ABSURD</span><h2>{activeShowcase.name}</h2><p>{activeShowcase.description}</p><div className="product-price"><strong>{money(product.price)}</strong><span>Cena demonstracyjna</span></div>{activeShowcase.isStoreProduct ? <><fieldset className="size-picker"><legend>Wybierz rozmiar <span>• wymagane</span></legend><div>{product.variants.map(v => <button key={v.size} type="button" disabled={!v.available} aria-pressed={size === v.size} onClick={() => { setSize(v.size); setError(''); }}>{v.size}</button>)}</div><small>Warianty demonstracyjne. XS: niedostępny w podglądzie.</small></fieldset><details className="product-info"><summary>Tabela rozmiarów <Plus size={16}/></summary><p>Wymiary nie zostały jeszcze dostarczone. Nie dobieraj rozmiaru na podstawie tego podglądu.</p><table><thead><tr><th>Rozmiar</th><th>Szerokość</th><th>Długość</th></tr></thead><tbody>{sizes.map(s => <tr key={s}><td>{s}</td><td>Do ustalenia</td><td>Do ustalenia</td></tr>)}</tbody></table></details><div className="buy-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Zmniejsz ilość" disabled={quantity <= 1}><Minus size={16}/></button><output aria-label="Ilość">{quantity}</output><button onClick={() => setQuantity(Math.min(10, quantity + 1))} disabled={quantity >= 10} aria-label="Zwiększ ilość"><Plus size={16}/></button></div><button className="button dark" onClick={add}>Do koszyka <ShoppingBag size={19}/></button></div>{error && <p role="alert" className="error">{error}</p>}<p className="demo-note">Tryb demonstracyjny — dodanie do koszyka nie rezerwuje towaru.</p>{[['Materiał', product.material], ['Pielęgnacja', product.care], ['Dostawa i zwroty', product.delivery + ' ' + product.returns]].map(([t, c]) => <details className="product-info" key={t}><summary>{t}<Plus size={16}/></summary><p>{c}</p></details>)}<a className="product-permalink" href={`/produkt/${product.slug}`}>Stały adres produktu ↗</a></> : <><div className="size-preview modal-size-preview">XS <span>S</span> <span>M</span> <span>L</span> <span>XL</span> <span>XXL</span></div><button className="button dark full" disabled>Sprzedaż w przygotowaniu <ShoppingBag size={19}/></button><p className="demo-note">Projekt jest dodany do kolekcji jako podgląd. Obsługa koszyka dla tego wzoru nie została jeszcze uruchomiona.</p></>}</div></div></Dialog>}
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

function Featured({item,onOpen}:{item:ShowcaseProduct;onOpen:()=>void}) {return <div className="editorial-feature"><button className="editorial-photo" onClick={onOpen} aria-label={`Obejrzyj ${item.name}`}><img src={item.image} alt={item.alt} width="1215" height="1295" loading="lazy"/><span className="editorial-sticker">POCZUCIE HUMORU<br/>W TWOIM ROZMIARZE.</span><span className="editorial-zoom">Bliżej nadruku ↗</span></button><div className="editorial-copy"><span className="eyebrow">{item.photoTag}</span><h3>{item.name}.</h3><p>{item.description}</p><div className="drop-line"><span>Pierwszy drop</span><small>W przygotowaniu</small></div><div className="color-line">Kolor: <b>Biały</b><i/></div><button className="button dark full" onClick={onOpen}>Poznaj ten wzór <Plus size={18}/></button><small>Dobry humor zaczyna się od dobrego nadruku.</small><details><summary>O tym projekcie <Plus size={16}/></summary><p>{item.description}</p></details></div></div>;}
