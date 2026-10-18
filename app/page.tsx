const source = 'https://uliczny-absurd.peppyluck4.chatgpt.site';

export default function Page() {
  return <main>
    <header className="nav shell">
      <a className="brand" href="#top"><img src={`${source}/logo-texture.webp`} alt=""/><span>ULICZNY<br/>ABSURD</span></a>
      <nav><a href="#kolekcja">Kolekcja</a><a href="#o-nas">O nas</a><a href="#faq">FAQ</a></nav>
      <a className="pill" href="#kolekcja">Zobacz projekt ↗</a>
    </header>

    <section className="hero shell" id="top">
      <div className="hero-copy">
        <span className="eyebrow">HUMOR Z ULICY / ABSURD W INTERNECIE</span>
        <h1>NOSI SIĘ<br/><i>NIEPOWAŻNIE.</i></h1>
        <p>Koszulki z charakterem dla ludzi, którzy nie potrzebują powodu, żeby zrobić sobie wolne od powagi.</p>
        <div className="actions"><a className="button dark" href="#kolekcja">Pierwszy projekt ↓</a><a className="link" href="#o-nas">Poznaj Uliczny Absurd ↗</a></div>
      </div>
      <div className="hero-art">
        <div className="disc"><img src={`${source}/logo-texture.webp`} alt="Uliczny Absurd"/></div>
        <span className="orbit one">NIE TEN<br/>ROZMIAR.</span><span className="orbit two">01 / UA</span>
      </div>
    </section>

    <section className="ticker"><div>ULICZNY ABSURD ✦ NIE BIERZ TEGO DO SIEBIE ✦ NOŚ TO NA SOBIE ✦ ULICZNY ABSURD ✦</div></section>

    <section className="section shell" id="kolekcja">
      <div className="section-heading"><div><span className="eyebrow">01 / DO NOSZENIA</span><h2>ŻARTY NA BOK.<br/><i>KOSZULKI NA SIEBIE.</i></h2></div><p>Internetowy humor wychodzi na ulicę.<br/>Pierwszy projekt. Cały nasz charakter.</p></div>
      <div className="product">
        <div className="photo"><img src={`${source}/koszulka.webp`} alt="Biała koszulka Uliczny Absurd"/><span>PROJEKT 001 / BIAŁA</span></div>
        <div className="product-copy"><span className="eyebrow">PIERWSZY PROJEKT / ULICZNY ABSURD</span><h3>NIE WIDZĘ SIĘ<br/>W PRACY.</h3><p>Oko na urlopie. Reszta jakoś sobie poradzi. Dla ludzi z bardzo konkretną wizją dnia.</p><strong>129,00 zł</strong><small>Cena demonstracyjna</small><div className="sizes">XS <b>S</b> <b>M</b> <b>L</b> <b>XL</b> <b>XXL</b></div><button className="button dark" type="button">Sprzedaż w przygotowaniu</button></div>
      </div>
    </section>

    <section className="about" id="o-nas"><div className="shell about-grid"><span className="eyebrow">02 / O NAS</span><div><h2>POWAGA MA<br/><i>WOLNE.</i></h2><p>Uliczny Absurd bierze internetowe teksty, codzienny dystans i przekłada je na rzeczy, które można wynieść z ekranu na ulicę.</p></div><div className="stamp">100%<br/><small>NIEPOTRZEBNEJ<br/>POWAGI</small></div></div></section>

    <section className="section shell" id="faq"><span className="eyebrow">03 / FAQ</span><h2>PYTANIA, KTÓRE<br/><i>MAJĄ SENS.</i></h2><div className="faq"><details open><summary>Jak zamówić koszulkę?</summary><p>To jest podgląd sklepu. Zamówienia i płatności nie są jeszcze aktywne.</p></details><details><summary>Jak dobrać rozmiar?</summary><p>Tabela wymiarów zostanie uzupełniona przed startem sprzedaży.</p></details><details><summary>Kiedy dotrze paczka?</summary><p>Sposoby, ceny i terminy dostawy są jeszcze do ustalenia.</p></details></div></section>

    <footer><div className="shell footer"><div className="brand"><img src={`${source}/logo-texture.webp`} alt=""/><span>ULICZNY<br/>ABSURD</span></div><p>Nosi się niepoważnie.</p><span>© 2026 ULICZNY ABSURD</span></div></footer>
  </main>;
}
