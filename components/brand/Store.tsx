'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, X, Plus, Menu, LoaderCircle } from 'lucide-react';
import CampaignHero from './CampaignHero';
import Eyes from './Eyes';
import { money } from '@/lib/catalog';
import { BuyPanel, CartButton, useShop, priceOf, type Catalog } from '@/components/shop/Shop';
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
export default function Store({ initialProduct = false, initialCatalog, contactEnabled = false }: {
    initialCatalog?:Catalog;
    initialProduct?: boolean;
    contactEnabled?: boolean;
}) {
    const shop = useShop();
    const catalog=shop.catalog.products.length?shop.catalog:(initialCatalog||shop.catalog);
    const {setCatalog}=shop;
    useEffect(()=>{if(initialCatalog)setCatalog(initialCatalog)},[initialCatalog,setCatalog]);
    const [productOpen,setProductOpen]=useState(initialProduct), [showcaseIndex,setShowcaseIndex]=useState(0), [menu,setMenu]=useState(false), [zoom,setZoom]=useState(false);
    const liveProducts = catalog.products.filter(p=>!p.hidden);
    const displayProducts = (initialCatalog || shop.catalog.products.length) ? liveProducts.map((p,i)=>({...showcaseProducts.find(x=>x.id===p.id),...p,title:showcaseProducts.find(x=>x.id===p.id)?.title||[p.name,''],stamp:showcaseProducts.find(x=>x.id===p.id)?.stamp||['NOWY','ABSURD'],alt:p.name,eyebrow:`PROJEKT ${String(i+1).padStart(3,'0')} / ULICZNY ABSURD`,photoTag:'BIAŁA KOSZULKA'})) : showcaseProducts;
    const [stats, setStats] = useState<SocialSnapshot[] | null>(null), [statsError, setStatsError] = useState(false), [statsRefreshing, setStatsRefreshing] = useState(false), [selected, setSelected] = useState(0);
    const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle'), [formMessage, setFormMessage] = useState('');
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
    function openProduct(index=0) {setShowcaseIndex(index);setZoom(false);setProductOpen(true);}
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
    const totalFollowers = stats?.every(item => item.followers !== null) ? stats.reduce((sum, item) => sum + (item.followers || 0), 0) : null;
    const activeShowcase = displayProducts[showcaseIndex] || displayProducts[0] || showcaseProducts[0];
    const activeProduct=catalog.products.find(p=>p.id===activeShowcase.id);
    return <><a href="#main" className="skip-link">Przejdź do treści</a><div className="preview-bar">ULICZNY ABSURD <span>•</span> {catalog.settings.testMode ? 'TRYB TESTOWY — zamówienia nie są realizowane' : 'Koszulki z charakterem'}</div>
 <header className="header"><Link href="/" className="brand" aria-label="Uliczny Absurd — strona główna"><Mark /><span>ULICZNY<br />ABSURD</span></Link><nav aria-label="Główna nawigacja"><a href="#kolekcja">KOSZULKI</a><a href="#spolecznosc">NASZ INTERNET</a><a href="#kontakt">WSPÓŁPRACA <ArrowUpRight size={16}/></a></nav><div className="header-actions"><CartButton/><button className="icon-button mobile-menu" aria-label="Otwórz menu" onClick={() => setMenu(true)}><Menu /></button></div></header>
 <main id="main"><CampaignHero />
 <div className="ticker" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>NIE WSZYSTKO MUSI MIEĆ SENS <b>✳</b> ALE MOŻE MIEĆ DOBRY NADRUK <b>✳</b> </span>)}</div></div>
 <section className="collection section" id="kolekcja"><div className="section-heading"><div><span className="eyebrow">01 / DO NOSZENIA</span><h2>ŻARTY NA BOK.<br /><span>KOSZULKI NA SIEBIE.</span></h2></div><p>Internetowy humor wychodzi na ulicę.<br />Jedna kolekcja. Dużo charakteru.</p></div><div className="product-list">{displayProducts.map((item, i) => <div className={`product-feature ${i % 2 ? 'reverse' : ''}`} key={item.id}><button className="product-photo" onClick={() => openProduct(i)} aria-label={`Zobacz koszulkę ${item.name}`}><img src={item.image} srcSet={item.image==='/koszulka.webp'?'/koszulka-400.webp 400w, /koszulka-800.webp 800w, /koszulka.webp 1215w':undefined} sizes="(max-width: 760px) 100vw, 50vw" alt={item.alt} width="1215" height="1295" loading={i < 2 ? 'eager' : 'lazy'}/><span className="photo-tag">{item.photoTag}</span><span className="photo-plus"><Plus /></span></button><div className="product-copy"><span className="small-stamp">{item.stamp[0]}<br />{item.stamp[1]}</span><span className="eyebrow">{item.eyebrow}</span><h3>{item.title[0]}<br />{item.title[1]}</h3><p>{item.description}</p><div className="product-price"><strong>{(() => {const p=catalog.products.find(p=>p.id===item.id);return p&&priceOf(p)!=null?money(priceOf(p)!):'Cena w przygotowaniu'})()}</strong><span>{catalog.settings.testMode?'Cena testowa':'Cena produktu'}</span></div><div className="size-preview"><span>S</span> <span>M</span> <span>L</span> <span>XL</span> <span>XXL</span></div><button className="button dark full" onClick={() => openProduct(i)}>Wybierz rozmiar <ArrowUpRight /></button><Link className="product-permalink" href={`/produkt/${catalog.products.find(p=>p.id===item.id)?.slug || ['nie-widze-sie-w-pracy','nie-spimy-lecimy','szef-imprezy','glowka-pracuje','zawodowcy-trenuja-codziennie','moglem-zostac-w-domu','piwko-to-moje-paliwko','ceny-leca-w-gore'][i]}`}>Szczegóły koszulki ↗</Link><span className="product-footnote">Wybierz rozmiar i dodaj swój absurd do koszyka.</span></div></div>)}</div></section>
 <section className="lookbook section"><div className="section-heading"><div><span className="eyebrow">TAK SIĘ NOSI ABSURD</span><h2>Z INTERNETU.<br/>PROSTO W ŻYCIE.</h2></div><p>Na urlop. Na miasto. Na grilla.<br/>Powagę zostaw w domu.</p></div><div className="lookbook-grid">{[{image:'oko',index:0,label:'Dzisiaj? Poza biurem.'},{image:'paliwko',index:6,label:'Pełny bak. Dobry skład.'}].map(x=><button key={x.image} onClick={()=>openProduct(Math.max(0,displayProducts.findIndex(p=>p.id===showcaseProducts[x.index].id)))}><img src={`/lookbook/${x.image}.webp`} alt={showcaseProducts[x.index].name + ' — stylizacja'} loading="lazy" width="800" height="1200"/><span>{x.label}<ArrowUpRight size={20}/></span></button>)}</div></section>
 <Eyes/>
 <section className="community section" id="spolecznosc"><div className="section-heading"><div><span className="eyebrow">02 / PO DRUGIEJ STRONIE EKRANU</span><h2>NASZ KAWAŁEK<br />INTERNETU.</h2></div><p>Cztery platformy.<br />Jedno niepoważne uniwersum.</p></div><div className="social-layout"><div className="social-tabs" role="tablist" aria-label="Platforma społecznościowa">{platforms.map((p, i) => <button key={p} role="tab" id={`tab-${i}`} aria-selected={selected === i} aria-controls="social-panel" tabIndex={selected === i ? 0 : -1} onKeyDown={e => { if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        const n = (selected + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : 3)) % 4;
        setSelected(n);
        document.getElementById(`tab-${n}`)?.focus();
    } }} onClick={() => setSelected(i)}><span className="platform-number">0{i + 1}</span><SocialGlyph platform={p}/><span className="platform-name">{p}</span><ArrowUpRight /></button>)}</div><div className="social-display" role="tabpanel" id="social-panel" aria-labelledby={`tab-${selected}`}><div className="social-display-head"><SocialGlyph platform={platforms[selected]}/>{current?.status !== 'manual' && <span className="status-pill"><i />{current?.status === 'live' ? 'DANE Z API' : current?.status === 'stale' ? 'DANE NIEAKTUALNE' : current?.status === 'unavailable' ? 'API NIEDOSTĘPNE' : current?.status === 'partial' ? 'DANE CZĘŚCIOWE' : 'PODŁĄCZ API'}</span>}</div><div className="social-number" key={selected}>{current?.followers != null ? <AnimatedNumber value={current.followers}/> : statsError ? '—' : !stats ? '…' : '— —'}</div><h3>{platforms[selected] === 'YouTube' ? 'subskrypcje' : 'obserwacje'} na {platforms[selected]}</h3><p>{statsError ? 'Nie udało się pobrać aktualnych statystyk.' : current?.followers != null ? 'Aktualne statystyki społeczności marki.' : 'Statystyki w przygotowaniu.'}</p>{current?.views != null && <div className="platform-views"><span>WYŚWIETLENIA</span><strong><AnimatedNumber value={current.views}/></strong><small>{current.viewsScope}</small></div>}<a className="social-profile-link" href={profiles[platforms[selected]]} target="_blank" rel="noreferrer">Otwórz {platforms[selected]} <ArrowUpRight size={19}/></a>{current?.note && <p>{current.note}</p>}<small>{current?.updatedAt ? `Aktualizacja: ${new Date(current.updatedAt).toLocaleString('pl-PL')}` : 'Ostatnia aktualizacja statystyk.'}</small></div></div><div className="views-total-card"><div className="views-total-copy"><span className="live-kicker"><i/> ŁĄCZNE WYŚWIETLENIA</span><strong>Ponad <AnimatedNumber value={Number(catalog.settings.views||30000000)}/> <span className="views-total-unit">wyświetleń</span></strong><p>Łączny zasięg filmów marki na naszych platformach społecznościowych.</p></div><div className="views-total-side"><span className="sources-count">4 PLATFORMY</span><button className="refresh-stats" type="button" disabled={statsRefreshing} onClick={() => loadStats(false)}>{statsRefreshing ? <><LoaderCircle className="spin" size={17}/> ODŚWIEŻAM</> : <>ODŚWIEŻ DANE <ArrowRight size={17}/></>}</button><span className="followers-total">ŁĄCZNE OBSERWACJE {totalFollowers !== null ? totalFollowers.toLocaleString('pl-PL') : '—'}</span></div></div></section>
 <section className="contact section" id="kontakt"><div className="contact-intro"><span className="eyebrow">03 / ZRÓBMY COŚ NIEPOWAŻNEGO</span><h2>DOBRY<br />POMYSŁ?<br /><span>DAWAJ GO.</span></h2><p>Współpraca z marką, wspólny film<br />albo po prostu coś do powiedzenia.<br />Tu jest na to miejsce.</p><span className="contact-arrow" aria-hidden="true">↗</span></div>{contactEnabled?<form onSubmit={send} className="contact-form"><div className="form-notice">Napisz do nas: ulicznyabsurd@gmail.com</div><div className="form-row"><label>Imię lub nazwa firmy<input name="name" required maxLength={120} autoComplete="organization" placeholder="Jak się nazywasz?"/></label><label>Adres e-mail<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="twoj@email.pl"/></label></div><label>O czym pogadamy?<select name="subject" required defaultValue=""><option value="" disabled>Wybierz temat</option><option>Współpraca z marką</option><option>Pytanie o koszulkę</option><option>Inna sprawa</option></select></label><label>Twoja wiadomość<textarea name="message" required minLength={10} maxLength={5000} rows={4} placeholder="Nie musi być poważnie. Wystarczy konkretnie."/></label><div className="honeypot" aria-hidden="true"><label>Strona WWW<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="privacy-note">Podane dane służą obsłudze zapytania. Administratorem danych jest Paweł Duszyński. <Link href="/prywatnosc">Polityka prywatności</Link>.</p><button className="button dark full" disabled={formState === 'sending'} type="submit">{formState === 'sending' ? <>Wysyłanie… <LoaderCircle className="spin"/></> : <>Wyślij wiadomość <ArrowUpRight /></>}</button><p role="status" className={`form-feedback ${formState}`}>{formMessage}</p></form>:<div className="contact-form contact-direct"><span className="eyebrow">KONTAKT E-MAIL</span><h3>NAPISZ DO NAS.</h3><p>W sprawie zamówień, koszulek i współprac napisz bezpośrednio na adres poniżej. Odpowiemy tą samą drogą.</p><a className="button dark full" href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com <ArrowUpRight/></a><p className="privacy-note">Zasady obsługi korespondencji opisuje <Link href="/prywatnosc">Polityka prywatności</Link>.</p></div>}</section>
 <section className="faq section" id="faq"><div><span className="eyebrow">04 / ZANIM ZAPYTASZ</span><h2>BEZ GŁUPICH<br />PYTAŃ.</h2><p>Odpowiedzi całkiem na serio.</p></div><div className="faq-list">{faq.map(([q, a], i) => <details key={q}><summary><span><small>0{i + 1}</small>{q}</span><Plus size={21}/></summary><p>{a}</p></details>)}</div></section>
 </main><footer><div className="footer-top"><Link href="/" className="brand"><Mark /><span>ULICZNY<br />ABSURD</span></Link><p>Życie jest za krótkie<br />na nudne koszulki.</p><nav aria-label="Nawigacja stopki"><a href="#kolekcja">Koszulki</a><a href="#spolecznosc">Nasz internet</a><a href="#kontakt">Kontakt</a></nav><nav aria-label="Informacje prawne"><Link href="/regulamin">Regulamin</Link><Link href="/prywatnosc">Prywatność</Link><Link href="/dostawa">Dostawa i płatności</Link><Link href="/zwroty">Zwroty</Link><Link href="/reklamacje">Reklamacje</Link><Link href="/cookies">Cookies</Link><Link href="/sprzedawca">Sprzedawca</Link></nav></div><p className="shop-seller">Kontakt: <a href="mailto:ulicznyabsurd@gmail.com">ulicznyabsurd@gmail.com</a> · <Link href="/sprzedawca">Dane sprzedawcy</Link> · <Link href="/cookies">Ustawienia cookies</Link></p><div className="footer-wordmark" aria-hidden="true">ULICZNY ABSURD</div><div className="footer-bottom"><span>© {new Date().getFullYear()} ULICZNY ABSURD</span><span>ZERO POWAGI. DUŻO CHARAKTERU.</span><a href="#main">DO GÓRY ↑</a></div></footer>
 {menu && <Dialog title="MENU" onClose={() => setMenu(false)}><nav className="menu-links">{[['#kolekcja', 'Koszulki'], ['#spolecznosc', 'Nasz internet'], ['#kontakt', 'Współpraca'], ['#faq', 'FAQ']].map(([h, t]) => <a href={h} key={h} onClick={() => setMenu(false)}>{t}<ArrowUpRight /></a>)}</nav></Dialog>}
 {productOpen && <Dialog title={`PROJEKT ${String(showcaseIndex + 1).padStart(3, '0')} / SZCZEGÓŁY KOSZULKI`} onClose={() => setProductOpen(false)} wide><div className="product-panel"><div><button className={`gallery ${zoom ? 'zoom' : ''}`} onClick={() => setZoom(!zoom)} aria-label={zoom ? 'Oddal zdjęcie' : 'Powiększ nadruk'}><img src={activeShowcase.image} alt={activeShowcase.alt}/><span>{zoom ? '− Oddal' : '+ Powiększ nadruk'}</span></button><small className="gallery-caption">{String(showcaseIndex + 1).padStart(2, '0')} / Przód • podgląd projektu</small></div><div className="product-details"><span className="eyebrow">BIAŁA KOSZULKA / ULICZNY ABSURD</span><h2>{activeShowcase.name}</h2><p>{activeShowcase.description}</p>{activeProduct ? <><BuyPanel key={activeProduct.id} product={activeProduct}/><Link className="product-permalink" href={`/produkt/${activeProduct.slug}`}>Szczegóły produktu ↗</Link></> : <p>Wczytywanie dostępności produktu…</p>}</div></div></Dialog>}
 </>;
}
function AnimatedNumber({ value }: {
    value: number;
}) { const ref = useRef<HTMLSpanElement>(null); const [n, setN] = useState(value); useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Reduced-motion users receive the final value immediately, without animation frames.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setN(value);
    return;
} let frame = 0; const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting)
    return; const start = performance.now(); const step = (t: number) => { const p = Math.min((t - start) / 800, 1); setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1)
    frame = requestAnimationFrame(step); }; frame = requestAnimationFrame(step); io.disconnect(); }); if (ref.current)
    io.observe(ref.current); return () => { io.disconnect(); cancelAnimationFrame(frame); }; }, [value]); return <span ref={ref}>{n.toLocaleString('pl-PL')}</span>; }

