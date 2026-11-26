/* page-home.jsx — Home: foto hero con bagliore e bordi strappati, intro, countdown, CTA */
(() => {
  const { useState, useEffect } = React;
  const C = window.CONTENT;
  const TARGET = new Date(C.config.weddingDate).getTime();

  function TornEdge({ position, filterId, seed }) {
    return (
      <svg className={'torn torn--' + position} viewBox="0 0 1600 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={filterId} filterUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="600">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.05" numOctaves="5" seed={seed}></feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="110" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
          </filter>
        </defs>
        <rect x="-100" y="115" width="1800" height="150" filter={'url(#' + filterId + ')'}></rect>
      </svg>
    );
  }

  function Hero({ t }) {
    const [img, setImg] = useState(null);
    const hero = C.config.hero;
    return (
      <section className="hero">
        <picture>
          <source srcSet={hero.src} type="image/webp" />
          <img
            ref={setImg}
            className="hero-img"
            src={hero.fallback}
            alt={t.heroAlt}
            fetchpriority="high"
            style={{ objectPosition: hero.position }}
          />
        </picture>
        <SunGlow img={img} />
        <TornEdge position="top" filterId="ptb" seed="18" />
        <TornEdge position="bottom" filterId="pbb" seed="11" />
      </section>
    );
  }

  function Countdown({ t }) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }, []);
    const diff = Math.max(0, TARGET - now);
    const parts = [
      Math.floor(diff / 864e5),
      Math.floor(diff / 36e5) % 24,
      Math.floor(diff / 6e4) % 60,
      Math.floor(diff / 1e3) % 60
    ];
    return (
      <div className="countdown">
        {parts.map((v, i) => (
          <div className="countdown-cell" key={i}>
            <div className="countdown-value">{String(v)}</div>
            <div className="countdown-label">{t.countdown[i]}</div>
          </div>
        ))}
      </div>
    );
  }

  function PageHome({ t }) {
    return (
      <section className="page">
        <p className="home-intro">{t.homeIntro}</p>
        <div className="save">
          <span className="save-date">{t.saveDate}</span>
        </div>
        <Countdown t={t} />
        <a className="cta" href={pageHref('rsvp')}>{t.cta}</a>
      </section>
    );
  }

  Object.assign(window, { Hero, PageHome });
})();
