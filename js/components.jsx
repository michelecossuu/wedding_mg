/*
  components.jsx — componenti condivisi: Header, LangSwitch, PageTitle, Eyebrow, DirectionsLink.
  Ogni .jsx è racchiuso in una IIFE: Babel Standalone esegue tutti i file nello stesso scope globale.
*/
(() => {
  const { useState, useEffect, useRef } = React;
  const C = window.CONTENT;

  // Pagine del sito: id interno, hash nell'URL, chiave del testo in t.nav
  const SITE_PAGES = [
    { id: 'home', hash: '', nav: 'home' },
    { id: 'info', hash: 'info', nav: 'info' },
    { id: 'rsvp', hash: 'rsvp', nav: 'rsvp' },
    { id: 'todo', hash: 'cosa-fare', nav: 'todo' }
  ];
  const pageHref = id => '#' + SITE_PAGES.find(p => p.id === id).hash;
  const mapsUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

  function GlobeIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5"></circle>
        <ellipse cx="12" cy="12" rx="4" ry="9.5"></ellipse>
        <path d="M2.5 12h19M4.2 7h15.6M4.2 17h15.6"></path>
      </svg>
    );
  }

  function ArrowIcon({ size }) {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M3 11L11 3M5 3h6v6"></path>
      </svg>
    );
  }

  function LangSwitch({ t, lang, onLang }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
      if (!open) return;
      const onDoc = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
      const onKey = e => { if (e.key === 'Escape') { setOpen(false); if (btnRef.current) btnRef.current.focus(); } };
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
      };
    }, [open]);

    const pick = code => () => { onLang(code); setOpen(false); };

    return (
      <div className="lang" ref={wrapRef}>
        <button
          ref={btnRef}
          type="button"
          className="lang-toggle"
          onClick={() => setOpen(o => !o)}
          aria-label={t.langLabel}
          aria-expanded={open}
          aria-controls="lang-menu"
        >
          <GlobeIcon />
        </button>
        {open && (
          <div className="lang-menu" id="lang-menu">
            {Object.keys(t.languages).map(code => (
              <button
                key={code}
                type="button"
                className="lang-option"
                onClick={pick(code)}
                aria-pressed={lang === code}
                lang={code}
              >
                <span>{t.languages[code]}</span>
                <span className="lang-code" aria-hidden="true">{code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Icona menu (tre linee) / chiudi (X). Il pulsante si vede solo su telefono, vedi site.css.
  function MenuIcon({ open }) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        {open
          ? <path d="M5 5l14 14M19 5L5 19"></path>
          : <path d="M3 7h18M3 12h18M3 17h18"></path>}
      </svg>
    );
  }

  function Header({ t, lang, page, onLang }) {
    const [menuOpen, setMenuOpen] = useState(false);

    // Chiude il menu quando si cambia pagina o si preme Esc
    useEffect(() => { setMenuOpen(false); }, [page]);
    useEffect(() => {
      if (!menuOpen) return;
      const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    return (
      <header className="site-header">
        <a className="logo" href={pageHref('home')}>{C.config.coupleName}</a>
        <div className="header-right">
          <nav className={'nav' + (menuOpen ? ' nav--open' : '')} id="site-nav">
            {SITE_PAGES.map(p => (
              <a
                key={p.id}
                className="nav-link"
                href={pageHref(p.id)}
                aria-current={page === p.id ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {t.nav[p.nav]}
              </a>
            ))}
          </nav>
          <LangSwitch t={t} lang={lang} onLang={onLang} />
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={t.menuLabel}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </header>
    );
  }

  function Eyebrow({ as: Tag = 'span', children }) {
    return <Tag className="eyebrow">{children}</Tag>;
  }

  function PageTitle({ title, sub, subClassName }) {
    return (
      <React.Fragment>
        <h1 className="page-title">{title}</h1>
        <div className="divider" aria-hidden="true">
          <div className="divider-line"></div>
          <div className="divider-diamond"></div>
          <div className="divider-line"></div>
        </div>
        <p className={'page-sub' + (subClassName ? ' ' + subClassName : '')}>{sub}</p>
      </React.Fragment>
    );
  }

  // Pillola lilla "Indicazioni ↗" verso Google Maps
  function DirectionsLink({ t, q, name, small }) {
    return (
      <a
        className={'pill-link' + (small ? ' pill-link--sm' : '')}
        href={mapsUrl(q)}
        target="_blank"
        rel="noopener"
        aria-label={t.directions + ' · ' + name}
      >
        <span>{t.directions}</span>
        <ArrowIcon size={small ? 11 : 12} />
      </a>
    );
  }

  Object.assign(window, { SITE_PAGES, pageHref, mapsUrl, Header, LangSwitch, Eyebrow, PageTitle, DirectionsLink });
})();
