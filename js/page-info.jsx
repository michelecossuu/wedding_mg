/* page-info.jsx — Info matrimonio: scheda Cerimonia/Ricevimento e pannello Regalo con copia IBAN */
(() => {
  const { useState, useEffect, useRef } = React;
  const C = window.CONTENT;
  const IBAN_LABEL = 'IBAN'; // sigla, uguale in tutte le lingue

  function CopyIcon() {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2"></rect>
        <path d="M15 9V5a1 1 0 00-1-1H5a1 1 0 00-1 1v9a1 1 0 001 1h4"></path>
      </svg>
    );
  }

  function CheckIcon() {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5"></path>
      </svg>
    );
  }

  function Gift({ t }) {
    const { iban, holder, bank } = C.config.gift;
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = () => {
      const v = iban.replace(/\s/g, '');
      const done = () => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2200);
      };
      const fallback = () => {
        try {
          const ta = document.createElement('textarea');
          ta.value = v;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand('copy');
          ta.remove();
          if (ok) done();
        } catch (e) {}
      };
      try { navigator.clipboard.writeText(v).then(done, fallback); } catch (e) { fallback(); }
    };

    const label = copied ? t.ibanCopied : t.copyIban;
    return (
      <div className="gift">
        <div className="gift-intro">
          <Eyebrow as="div">{t.giftTitle}</Eyebrow>
          <p className="gift-text">{t.giftText}</p>
        </div>
        <div className="gift-details">
          <div className="iban-box">
            <span className="iban-value">
              <span className="iban-label">{IBAN_LABEL}</span>{iban}
            </span>
            <button type="button" className="icon-btn" onClick={copy} aria-label={label} title={label}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
            <span role="status" className="sr-only">{copied ? t.ibanCopied : ''}</span>
          </div>
          <div><span className="gift-key">{t.holderLabel}</span> {holder}</div>
          {bank && <div><span className="gift-key">{t.bankLabel}</span> {bank}</div>}
          <div><span className="gift-key">{t.reasonLabel}</span> {t.reasonText}</div>
        </div>
      </div>
    );
  }

  function PageInfo({ t, lang }) {
    return (
      <section className="page">
        <PageTitle title={t.infoTitle} sub={t.infoSub} />
        <div className="places card">
          {C.places.map(p => (
            <article className="place" key={p.name}>
              <Eyebrow as="div">{p[lang].kind}</Eyebrow>
              <div className="place-time">{p[lang].time}</div>
              <h2 className="place-name">{p.name}</h2>
              <div className="place-address">{p.address}</div>
              <DirectionsLink t={t} q={p.q} name={p.name} />
            </article>
          ))}
        </div>
        <Gift t={t} />
      </section>
    );
  }

  Object.assign(window, { PageInfo });
})();
