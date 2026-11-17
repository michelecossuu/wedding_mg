/* app.jsx — stato della lingua, navigazione con l'hash, render della pagina attiva */
(() => {
  const { useState, useEffect } = React;
  const C = window.CONTENT;

  const readPage = () => {
    const h = (window.location.hash || '').replace(/^#/, '');
    const p = SITE_PAGES.find(x => x.hash === h);
    return p ? p.id : 'home';
  };

  const readLang = () => {
    try {
      const v = localStorage.getItem(C.config.langStorageKey);
      if (v && C.i18n[v]) return v;
    } catch (e) {}
    return C.config.defaultLang;
  };

  const PAGE_TITLE = { info: 'infoTitle', rsvp: 'rsvpTitle', todo: 'todoTitle' };

  function App() {
    const [lang, setLang] = useState(readLang);
    const [page, setPage] = useState(readPage);
    const t = C.i18n[lang];

    useEffect(() => {
      const onHash = () => { setPage(readPage()); window.scrollTo(0, 0); };
      window.addEventListener('hashchange', onHash);
      return () => window.removeEventListener('hashchange', onHash);
    }, []);

    // <html lang>, titolo della scheda e meta description seguono lingua e pagina
    useEffect(() => {
      document.documentElement.lang = t.htmlLang;
      document.title = PAGE_TITLE[page] ? t[PAGE_TITLE[page]] + ' · ' + C.config.coupleName : t.metaTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', t.metaDescription);
    }, [lang, page]);

    const changeLang = code => {
      try { localStorage.setItem(C.config.langStorageKey, code); } catch (e) {}
      setLang(code);
    };

    return (
      <div className="site">
        <Header t={t} lang={lang} page={page} onLang={changeLang} />
        {page === 'home' && <Hero t={t} />}
        <main className="main">
          {page === 'home' && <PageHome t={t} lang={lang} />}
          {page === 'info' && <PageInfo t={t} lang={lang} />}
          {page === 'rsvp' && <PageRsvp t={t} lang={lang} />}
          {page === 'todo' && <PageTodo t={t} lang={lang} />}
        </main>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
