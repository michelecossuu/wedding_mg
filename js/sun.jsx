/*
  sun.jsx — SunGlow: bagliore che pulsa sul sole della foto della home.
  Algoritmo portato dal sorgente del design: findSun (trova il sole), makeMask (maschera del cielo
  chiaro e caldo, così le teste e gli scogli coprono il bagliore), placeSun (posizione con object-fit:cover).
*/
(() => {
  const { useState, useEffect } = React;
  const HERO = window.CONTENT.config.hero;
  const SUN_GUESS = HERO.sun;
  const POSITION = HERO.position || '50% 70%';
  const POS = POSITION.split(/\s+/).map(v => parseFloat(v) / 100);

  // Risultato dell'analisi per src (posizione, dimensioni, Blob della maschera): si riusa tornando alla home.
  const cache = {};

  // Trova il sole: punteggio = luminanza − 1,5·|R−B−80|, massimo vicino alla posizione nota, poi baricentro.
  function analyse(im) {
    try {
      const w = 160, h = Math.max(1, Math.round(w * im.naturalHeight / im.naturalWidth));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'); x.drawImage(im, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data, S = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) {
        const R = d[i * 4], G = d[i * 4 + 1], B = d[i * 4 + 2];
        S[i] = 0.2126 * R + 0.7152 * G + 0.0722 * B - 1.5 * Math.abs(R - B - 80);
      }
      const ex = SUN_GUESS[0] * w, ey = SUN_GUESS[1] * h, rad = 0.12 * w, r = 2;
      let best = -1e9, bx = Math.round(ex), by = Math.round(ey);
      for (let y = r; y < h - r; y++) for (let xx = r; xx < w - r; xx++) {
        if (Math.hypot(xx - ex, y - ey) > rad) continue;
        let s = 0;
        for (let j = -r; j <= r; j++) for (let k = -r; k <= r; k++) s += S[(y + j) * w + xx + k];
        if (s > best) { best = s; bx = xx; by = y; }
      }
      const R2 = 6, y0 = Math.max(0, by - R2), y1 = Math.min(h, by + R2 + 1), x0 = Math.max(0, bx - R2), x1 = Math.min(w, bx + R2 + 1);
      let pk = -1e9, sx = 0, sy = 0, n = 0;
      for (let y = y0; y < y1; y++) for (let xx = x0; xx < x1; xx++) pk = Math.max(pk, S[y * w + xx]);
      for (let y = y0; y < y1; y++) for (let xx = x0; xx < x1; xx++) if (S[y * w + xx] >= pk - 15) { sx += xx; sy += y; n++; }
      const p = n ? [(sx / n + 0.5) / w, (sy / n + 0.5) / h] : [(bx + 0.5) / w, (by + 0.5) / h];
      return Math.hypot(p[0] - SUN_GUESS[0], p[1] - SUN_GUESS[1]) < 0.1 ? p : SUN_GUESS.slice();
    } catch (e) {
      return null; // canvas non leggibile (immagine di un altro dominio)
    }
  }

  // Maschera alpha: 1 sul cielo chiaro e caldo, 0 su capelli, abiti, scogli e mare; attenuata sotto l'orizzonte.
  function makeMask(im, p) {
    return new Promise(resolve => {
      try {
        const mw = Math.min(480, im.naturalWidth), mh = Math.max(1, Math.round(mw * im.naturalHeight / im.naturalWidth));
        const c = document.createElement('canvas'); c.width = mw; c.height = mh;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0, mw, mh);
        const img = x.getImageData(0, 0, mw, mh), a = img.data;
        const sm = (e0, e1, v) => { const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
        const hz = p[1] + 0.035;
        for (let y = 0; y < mh; y++) {
          const fy = y / mh, below = fy > hz ? 0.45 * (1 - sm(0, 0.2, fy - hz)) : 1;
          for (let xx = 0; xx < mw; xx++) {
            const i = (y * mw + xx) * 4, R = a[i], G = a[i + 1], B = a[i + 2];
            const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
            a[i] = a[i + 1] = a[i + 2] = 255;
            a[i + 3] = Math.round(255 * below * sm(140, 175, L) * sm(30, 60, R - B));
          }
        }
        x.putImageData(img, 0, 0);
        c.toBlob(b => resolve(b || null), 'image/png');
      } catch (e) {
        resolve(null);
      }
    });
  }

  function loadImage(src, cors) {
    return new Promise(resolve => {
      const im = new Image();
      if (cors) im.crossOrigin = 'anonymous';
      im.onload = () => resolve(im);
      im.onerror = () => resolve(null);
      im.src = src;
    });
  }

  // Prima con crossOrigin='anonymous', se fallisce senza. Nessuna maschera = nessun bagliore.
  async function findSun(src) {
    if (cache[src]) return cache[src];
    let im = await loadImage(src, true);
    let p = im && analyse(im);
    if (!p) {
      im = await loadImage(src, false);
      p = im && analyse(im);
    }
    if (!im || !p) return null;
    const blob = await makeMask(im, p);
    if (!blob) return null;
    cache[src] = { p, dims: [im.naturalWidth || 16, im.naturalHeight || 9], blob };
    return cache[src];
  }

  // Posizione nell'immagine → percentuali del riquadro, con object-fit:cover e object-position della foto.
  function placeSun(img, f, dims) {
    const ew = img.clientWidth, eh = img.clientHeight;
    if (!ew || !eh) return null;
    const s = Math.max(ew / dims[0], eh / dims[1]), rw = dims[0] * s, rh = dims[1] * s;
    const px = (ew - rw) * POS[0] + f[0] * rw, py = (eh - rh) * POS[1] + f[1] * rh;
    return {
      l: (px / ew * 100).toFixed(2) + '%',
      t: (py / eh * 100).toFixed(2) + '%',
      u: (py / eh * 100 - 14).toFixed(2) + '%'
    };
  }

  function SunGlow({ img }) {
    const [sun, setSun] = useState(null); // { data, maskUrl }
    const [pos, setPos] = useState(null);

    // Analisi della foto e maschera (quando la foto è caricata); il Blob URL si libera allo smontaggio.
    useEffect(() => {
      if (!img) return;
      let alive = true, maskUrl = null;
      const start = () => {
        findSun(img.currentSrc || img.src).then(data => {
          if (!alive || !data) return;
          maskUrl = URL.createObjectURL(data.blob);
          setSun({ data, maskUrl });
        });
      };
      if (img.complete && img.naturalWidth) start();
      else img.addEventListener('load', start, { once: true });
      return () => {
        alive = false;
        img.removeEventListener('load', start);
        if (maskUrl) URL.revokeObjectURL(maskUrl);
      };
    }, [img]);

    // Posizione, ricalcolata al resize.
    useEffect(() => {
      if (!img || !sun) return;
      const update = () => { const p = placeSun(img, sun.data.p, sun.data.dims); if (p) setPos(p); };
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, [img, sun]);

    if (!sun || !pos) return null;

    const mask = 'url("' + sun.maskUrl + '")';
    return (
      <div
        className="sun-glow"
        aria-hidden="true"
        style={{ WebkitMaskImage: mask, maskImage: mask, WebkitMaskPosition: POSITION, maskPosition: POSITION }}
      >
        <div
          className="sun-wash"
          style={{ background: 'radial-gradient(ellipse 55% 65% at ' + pos.l + ' ' + pos.u + ',rgba(255,222,172,.34) 0%,rgba(255,206,150,.13) 45%,rgba(255,200,140,0) 80%)' }}
        ></div>
        <div className="sun-core" style={{ left: pos.l, top: pos.t }}></div>
      </div>
    );
  }

  Object.assign(window, { SunGlow });
})();
