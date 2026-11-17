/* page-rsvp.jsx — RSVP: modulo con invio al Foglio Google (SPEC §5) e schermata "Grazie!" */
(() => {
  const { useState } = React;
  const C = window.CONTENT;

  const emptyForm = () => ({
    nome: '',
    attend: 'yes',
    diet: {},
    detail: {},
    canzone1: '',
    canzone2: '',
    website: '' // campo trappola anti-spam
  });

  // Dati inviati all'Apps Script. Se "Purtroppo no", niente note alimentari né canzoni.
  function buildPayload(form, lang) {
    const yes = form.attend === 'yes';
    const data = {
      nome: form.nome.trim(),
      presenza: yes ? 'si' : 'no',
      lingua: lang,
      website: form.website
    };
    if (yes) {
      C.diet.forEach(d => {
        const on = !!form.diet[d.key];
        data[d.key] = on ? '1' : '';
        if (d.needsDetail) data[d.key + '_dettaglio'] = on ? (form.detail[d.key] || '').trim() : '';
      });
      data.canzone1 = form.canzone1.trim();
      data.canzone2 = form.canzone2.trim();
    }
    return data;
  }

  function PageRsvp({ t, lang }) {
    const [form, setForm] = useState(emptyForm);
    const [status, setStatus] = useState('idle'); // idle | sending | error
    const [sent, setSent] = useState(false);

    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
    const toggleDiet = key => setForm(f => ({ ...f, diet: { ...f.diet, [key]: !f.diet[key] } }));
    const setDetail = (key, value) => setForm(f => ({ ...f, detail: { ...f.detail, [key]: value } }));

    const finish = () => {
      setSent(true);
      setStatus('idle');
      window.scrollTo(0, 0);
    };

    const submit = async e => {
      e.preventDefault();
      if (status === 'sending') return;
      const endpoint = C.config.rsvpEndpoint;
      const payload = buildPayload(form, lang);
      if (!endpoint) {
        console.warn('[RSVP] config.rsvpEndpoint è vuoto in js/content.js: risposta NON inviata.', payload);
        finish();
        return;
      }
      setStatus('sending');
      try {
        await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(payload) });
        finish();
      } catch (err) {
        setStatus('error');
      }
    };

    const reset = () => {
      setForm(emptyForm());
      setStatus('idle');
      setSent(false);
    };

    const yes = form.attend === 'yes';
    const sending = status === 'sending';

    return (
      <section className="page">
        <PageTitle title={t.rsvpTitle} sub={t.rsvpSub} />

        {sent ? (
          <div className="rsvp-thanks card">
            <div className="thanks-title">{t.thanks}</div>
            <p className="thanks-text">{t.thanksText}</p>
            <button type="button" className="btn-soft" onClick={reset}>{t.another}</button>
          </div>
        ) : (
          <form className="rsvp-form card" onSubmit={submit}>
            <label className="form-row">
              <Eyebrow>{t.fName}</Eyebrow>
              <input
                className="field"
                name="nome"
                required
                autoComplete="name"
                placeholder={t.namePlaceholder}
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
              />
            </label>

            <div className="form-row" role="group" aria-label={t.fAttend}>
              <Eyebrow>{t.fAttend}</Eyebrow>
              <div className="toggle">
                <button type="button" className="toggle-seg" aria-pressed={yes} onClick={() => set('attend', 'yes')}>{t.yes}</button>
                <button type="button" className="toggle-seg" aria-pressed={!yes} onClick={() => set('attend', 'no')}>{t.no}</button>
              </div>
            </div>

            {yes && (
              <div className="form-extra">
                <div className="form-row form-row--diet" role="group" aria-label={t.fDiet}>
                  <Eyebrow>{t.fDiet}</Eyebrow>
                  <div className="chips">
                    {C.diet.map(d => (
                      <button
                        key={d.key}
                        type="button"
                        className="chip"
                        aria-pressed={!!form.diet[d.key]}
                        onClick={() => toggleDiet(d.key)}
                      >
                        {d[lang]}
                      </button>
                    ))}
                  </div>
                  {C.diet.filter(d => d.needsDetail && form.diet[d.key]).map(d => {
                    const ph = d[lang] + ' · ' + t.specify.toLowerCase();
                    return (
                      <input
                        key={d.key}
                        className="field field--detail"
                        name={d.key + '_dettaglio'}
                        aria-label={ph}
                        placeholder={ph}
                        value={form.detail[d.key] || ''}
                        onChange={e => setDetail(d.key, e.target.value)}
                      />
                    );
                  })}
                </div>

                <div className="form-row">
                  <Eyebrow>{t.fSongs}</Eyebrow>
                  <span className="form-help">{t.fSongsHelp}</span>
                  <div className="songs">
                    <input className="field field--song" name="canzone1" aria-label={t.song1} placeholder={t.song1} value={form.canzone1} onChange={e => set('canzone1', e.target.value)} />
                    <input className="field field--song" name="canzone2" aria-label={t.song2} placeholder={t.song2} value={form.canzone2} onChange={e => set('canzone2', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="hp" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set('website', e.target.value)} />
            </div>

            {status === 'error' && <p className="form-error" role="alert">{t.sendError}</p>}

            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? t.sending : t.send}
            </button>
          </form>
        )}
      </section>
    );
  }

  Object.assign(window, { PageRsvp });
})();
