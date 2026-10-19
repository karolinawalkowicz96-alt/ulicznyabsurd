import { ArrowUpRight, Smile, Shirt } from 'lucide-react';

export default function CampaignHero() {
  return (
    <section className="campaign-hero" aria-labelledby="campaign-title">
      <picture className="campaign-photo">
        <source media="(max-width: 760px)" srcSet="/hero/campaign-mobile.webp" width="1080" height="1920" />
        <img src="/hero/campaign-desktop.webp" alt="Koszulka Nie śpimy, lecimy — letnia stylizacja Uliczny Absurd" width="1920" height="1080" fetchPriority="high" loading="eager" />
      </picture>
      <div className="campaign-content">
        <h1 id="campaign-title"><span>POWAGA?</span><span>NIE NOSZĘ.</span></h1>
        <p>Filmy, które zostają w głowie.<br />Koszulki, które mówią za Ciebie.</p>
        <div className="campaign-actions">
          <a className="button dark" href="#kolekcja">Zobacz koszulki <ArrowUpRight size={24} /></a>
          <a className="text-link" href="#spolecznosc">Poznaj nasz internet <ArrowUpRight size={21} /></a>
        </div>
        <div className="campaign-notes"><span><Smile size={30} />Oryginalne<br />wzory</span><span><Shirt size={30} />Dla pozytywnie<br />zakręconych</span></div>
      </div>
      <span className="campaign-sticker">ŹLE W<br />GŁOWIE.<br />DOBRZE<br />NA SOBIE.</span>
      <svg className="campaign-smile" aria-hidden="true" viewBox="0 0 100 100" fill="none"><path d="M50 8C26 8 9 24 9 46c0 19 13 34 33 38l-2 11 20-10c19-4 31-18 31-39C91 24 74 8 50 8Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3"/><path d="M31 55c8 17 29 17 39-2M33 34v8m30-9v8" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round"/></svg>
    </section>
  );
}
