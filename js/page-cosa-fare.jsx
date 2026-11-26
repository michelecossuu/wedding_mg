/* page-cosa-fare.jsx — Cosa fare: griglia di schede con foto, distanza, testo e Indicazioni */
(() => {
  const { useState } = React;
  const C = window.CONTENT;

  // Foto della scheda: se il file manca resta il riquadro lilla, senza icona rotta.
  function TodoPhoto({ slug }) {
    const [state, setState] = useState('loading'); // loading | loaded | missing
    if (state === 'missing') return null;
    const ref = el => { if (el && el.complete && el.naturalWidth && state !== 'loaded') setState('loaded'); };
    return (
      <img
        ref={ref}
        src={'assets/cosa-fare/' + slug + '.jpg'}
        alt=""
        loading="lazy"
        decoding="async"
        className={state === 'loaded' ? 'is-loaded' : undefined}
        onLoad={() => setState('loaded')}
        onError={() => setState('missing')}
      />
    );
  }

  function PageTodo({ t, lang }) {
    return (
      <section className="page">
        <PageTitle title={t.todoTitle} sub={t.todoSub} subClassName="page-sub--narrow" />
        <div className="todo-grid">
          {C.todo.map(d => {
            const x = d[lang];
            return (
              <article className="todo-card card" key={d.slug}>
                <div className="todo-photo">
                  <TodoPhoto slug={d.slug} />
                  <span className="todo-dist">{x.dist}</span>
                </div>
                <div className="todo-body">
                  <h2 className="todo-title">{x.title}</h2>
                  <p className="todo-text">{x.text}</p>
                  <DirectionsLink t={t} q={d.q} name={x.title} small />
                </div>
              </article>
            );
          })}
        </div>
        <p className="todo-credits">
          {t.photoCredits}{' '}
          {C.todo.map((d, i) => (
            <React.Fragment key={d.slug}>
              {i > 0 && ' · '}
              <a href={d.photo.url} target="_blank" rel="noopener">{d[lang].title}</a>
              {' — ' + d.photo.author + ', ' + d.photo.license}
            </React.Fragment>
          ))}
        </p>
      </section>
    );
  }

  Object.assign(window, { PageTodo });
})();
