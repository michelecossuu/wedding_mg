/*
  content.js — TUTTI i testi e i dati del sito, in italiano e inglese.
  Per cambiare un testo, un orario, l'IBAN o un posto si modifica SOLO questo file.
  Viene caricato come script normale (non Babel) prima dei file .jsx e si legge da window.CONTENT.

  ⚠ Dati ancora finti da sostituire prima della pubblicazione:
     - config.rsvpEndpoint (URL "…/exec" della Web App di Google Apps Script, vedi _apps-script/Code.gs, fuori dal repo)
*/
window.CONTENT = {
  config: {
    coupleName: 'Marta & Giuliano',
    // Data e ora della cerimonia (ora italiana). Usata dal conto alla rovescia.
    weddingDate: '2027-10-03T11:00:00+02:00',
    // Lingua iniziale e chiave usata per ricordare la scelta dell'ospite (localStorage).
    defaultLang: 'it',
    langStorageKey: 'gm-wedding-lang',
    // URL "…/exec" della Web App Apps Script che scrive le risposte RSVP nel Foglio Google.
    // Se vuoto, il modulo mostra comunque il "Grazie!" ma non invia nulla (utile in sviluppo).
    rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbzzPkck1D4YN1s0YOZsRNKTEF3ZaY-pnKguwJ5SiOwQeLNM70y4xFW7pq1BgkGjcOBH/exec',
    hero: {
      // Foto della home. File in assets/ (webp + jpg di riserva).
      src: 'assets/hero-alghero.webp',
      fallback: 'assets/hero-alghero.jpg',
      // Posizione del sole nella foto, come frazione di larghezza e altezza dell'IMMAGINE (non dello schermo).
      // Misurata sull'illustrazione approvata. Se si cambia foto va rimisurata.
      sun: [0.561, 0.345],
      // object-position usato per la foto (la maschera del bagliore deve usare lo stesso valore).
      position: '50% 70%'
    },
    gift: {
      iban: 'IT22 I035 8901 6000 1057 0831 324',
      holder: 'Tidu Marta',
      bank: 'Allianz Bank'
    }
  },

  // Cerimonia e ricevimento (pagina Info matrimonio).
  // q = testo cercato su Google Maps per il pulsante "Indicazioni".
  places: [
    {
      q: 'Santuario di Valverde Alghero',
      name: 'Santuari de Nostra Senyora del Pilar de Vallverd',
      address: 'Località Valverde, 07041 Alghero (SS)',
      it: { kind: 'CERIMONIA', time: '11:00' },
      en: { kind: 'CEREMONY', time: '11 am' }
    },
    {
      q: 'Villa Lughente Alghero',
      name: 'Villa Lughente',
      address: 'Località Tanca Farrà, 07041 Alghero (SS)',
      it: { kind: 'RICEVIMENTO', time: '13:00' },
      en: { kind: 'RECEPTION', time: '1 pm' }
    }
  ],

  // Pagina Cosa fare. slug = nome del file foto in assets/cosa-fare/<slug>.webp (o .jpg)
  todo: [
    { slug: 'centro-storico', q: 'Bastioni Alghero',
      it: { title: 'Centro storico e Bastioni', text: 'Una passeggiata sulle mura al tramonto, tra vicoli, botteghe di corallo e torri catalane.', dist: 'IN CITTÀ' },
      en: { title: 'Old town and ramparts', text: 'A sunset walk along the sea walls, through narrow lanes, coral shops and Catalan towers.', dist: 'IN TOWN' } },
    { slug: 'grotta-di-nettuno', q: 'Grotta di Nettuno',
      it: { title: 'Grotta di Nettuno', text: 'Si raggiunge in barca dal porto o a piedi con i 654 gradini dell’Escala del Cabirol.', dist: '25 KM' },
      en: { title: 'Neptune’s Grotto', text: 'Reach it by boat from the harbour or on foot down the 654 steps of the Escala del Cabirol.', dist: '25 KM' } },
    { slug: 'capo-caccia', q: 'Capo Caccia',
      it: { title: 'Capo Caccia', text: 'Il promontorio a picco sul mare, con uno dei panorami più belli della costa.', dist: '24 KM' },
      en: { title: 'Capo Caccia', text: 'The cliff-top headland with one of the finest views on the coast.', dist: '24 KM' } },
    { slug: 'bombarde-lazzaretto', q: 'Spiaggia Le Bombarde',
      it: { title: 'Le Bombarde e Lazzaretto', text: 'Due spiagge vicine di sabbia chiara e acqua bassa, ideali per una giornata di mare.', dist: '10 KM' },
      en: { title: 'Le Bombarde and Lazzaretto', text: 'Two nearby beaches with pale sand and shallow water, ideal for a day by the sea.', dist: '10 KM' } },
    { slug: 'nuraghe-palmavera', q: 'Nuraghe di Palmavera',
      it: { title: 'Nuraghe di Palmavera', text: 'Un villaggio nuragico dell’età del bronzo, visitabile con guida.', dist: '10 KM' },
      en: { title: 'Palmavera Nuraghe', text: 'A Bronze Age nuragic village, with guided visits.', dist: '10 KM' } },
    { slug: 'bosa', q: 'Bosa',
      it: { title: 'Bosa', text: 'Borgo colorato sul fiume Temo, raggiungibile con la strada panoramica lungo la costa.', dist: '45 KM' },
      en: { title: 'Bosa', text: 'A colourful village on the Temo river, reached via the scenic coastal road.', dist: '45 KM' } },
    { slug: 'la-pelosa', q: 'Spiaggia La Pelosa Stintino',
      it: { title: 'La Pelosa, Stintino', text: 'Una delle spiagge più famose della Sardegna. In alta stagione serve la prenotazione.', dist: '55 KM' },
      en: { title: 'La Pelosa, Stintino', text: 'One of Sardinia’s best-known beaches. Booking is required in high season.', dist: '55 KM' } },
    { slug: 'cantine', q: 'Cantine Alghero',
      it: { title: 'Cantine del territorio', text: 'Degustazioni di Vermentino e Cannonau nelle cantine attorno alla città.', dist: '5–10 KM' },
      en: { title: 'Local wineries', text: 'Vermentino and Cannonau tastings at the wineries around town.', dist: '5–10 KM' } }
  ],

  // Opzioni alimentari del modulo RSVP. key = nome della colonna inviata al Foglio Google.
  // needsDetail = se selezionata, compare sotto un campo "… · specificare".
  diet: [
    { key: 'vegetariano', needsDetail: false, it: 'Vegetariano', en: 'Vegetarian' },
    { key: 'vegano', needsDetail: false, it: 'Vegano', en: 'Vegan' },
    { key: 'celiaco', needsDetail: false, it: 'Celiaco', en: 'Coeliac' },
    { key: 'allergie', needsDetail: true, it: 'Altre allergie', en: 'Other allergies' },
    { key: 'intolleranze', needsDetail: true, it: 'Intolleranze', en: 'Intolerances' },
    { key: 'non_mangio', needsDetail: true, it: 'Non mangio proprio…', en: 'I really don’t eat…' }
  ],

  i18n: {
    it: {
      htmlLang: 'it',
      metaTitle: 'Marta & Giuliano · 3 ottobre 2027 · Alghero',
      metaDescription: 'Il matrimonio di Marta e Giuliano ad Alghero, domenica 3 ottobre 2027.',
      nav: { home: 'HOME', info: 'INFO MATRIMONIO', rsvp: 'RSVP', todo: 'COSA FARE' },
      langLabel: 'Cambia lingua',
      menuLabel: 'Menu',
      languages: { it: 'Italiano', en: 'English' },

      heroAlt: 'Marta e Giuliano con il cane, al tramonto sul mare di Alghero',
      homeIntro: 'Non vediamo l’ora di festeggiare con voi.',
      saveLabel: 'Salva la data:',
      saveDate: 'DOMENICA 3 OTTOBRE 2027',
      countdown: ['giorni', 'ore', 'minuti', 'secondi'],
      cta: 'CONFERMA LA TUA PRESENZA',

      infoTitle: 'Info matrimonio',
      infoSub: 'Domenica 3 ottobre 2027 · Alghero',
      directions: 'INDICAZIONI',
      giftTitle: 'IL REGALO',
      giftText: 'La vostra presenza è il regalo più bello. Se desiderate, potete contribuire al nostro viaggio di nozze.',
      holderLabel: 'Intestato a',
      bankLabel: 'Banca',
      reasonLabel: 'Causale',
      reasonText: 'Regalo nozze Marta e Giuliano',
      copyIban: 'Copia IBAN',
      ibanCopied: 'IBAN copiato',

      rsvpTitle: 'RSVP',
      rsvpSub: 'Vi chiediamo di confermare entro il 30 giugno 2027.',
      fName: 'NOME E COGNOME',
      namePlaceholder: 'Es. Laura Bianchi',
      fAttend: 'CI SARAI?',
      yes: 'Sì, ci sarò',
      no: 'Purtroppo no',
      fDiet: 'NOTE ALIMENTARI',
      specify: 'specificare',
      fSongs: 'CANZONI CONSIGLIATE',
      fSongsHelp: 'Massimo 2 a testa: le metteremo in playlist alla festa.',
      song1: 'Canzone 1 · titolo e artista',
      song2: 'Canzone 2 · titolo e artista',
      send: 'INVIA LA RISPOSTA',
      sending: 'INVIO IN CORSO…',
      sendError: 'Non siamo riusciti a inviare la risposta. Controlla la connessione e riprova.',
      thanks: 'Grazie!',
      thanksText: 'Abbiamo ricevuto la tua risposta.',
      another: 'Invia un’altra risposta',

      todoTitle: 'Cosa fare',
      todoSub: 'Qualche idea per chi si ferma qualche giorno in più ad Alghero e dintorni.'
    },
    en: {
      htmlLang: 'en',
      metaTitle: 'Marta & Giuliano · 3 October 2027 · Alghero',
      metaDescription: 'Marta and Giuliano’s wedding in Alghero, Sunday 3 October 2027.',
      nav: { home: 'HOME', info: 'WEDDING INFO', rsvp: 'RSVP', todo: 'THINGS TO DO' },
      langLabel: 'Change language',
      menuLabel: 'Menu',
      languages: { it: 'Italiano', en: 'English' },

      heroAlt: 'Marta and Giuliano with their dog, at sunset by the sea in Alghero',
      homeIntro: 'We can’t wait to celebrate with you.',
      saveLabel: 'Save the date:',
      saveDate: 'SUNDAY 3 OCTOBER 2027',
      countdown: ['days', 'hours', 'minutes', 'seconds'],
      cta: 'CONFIRM YOUR ATTENDANCE',

      infoTitle: 'Wedding info',
      infoSub: 'Sunday 3 October 2027 · Alghero',
      directions: 'GET DIRECTIONS',
      giftTitle: 'GIFTS',
      giftText: 'Your presence is the best gift. If you wish, you can contribute to our honeymoon.',
      holderLabel: 'Account holder',
      bankLabel: 'Bank',
      reasonLabel: 'Reference',
      reasonText: 'Wedding gift Marta and Giuliano',
      copyIban: 'Copy IBAN',
      ibanCopied: 'IBAN copied',

      rsvpTitle: 'RSVP',
      rsvpSub: 'Please reply by 30 June 2027.',
      fName: 'FULL NAME',
      namePlaceholder: 'e.g. Laura White',
      fAttend: 'WILL YOU JOIN US?',
      yes: 'Yes, I’ll be there',
      no: 'Sadly, no',
      fDiet: 'DIETARY NOTES',
      specify: 'please specify',
      fSongs: 'SONG SUGGESTIONS',
      fSongsHelp: 'Up to 2 per person: we’ll add them to the party playlist.',
      song1: 'Song 1 · title and artist',
      song2: 'Song 2 · title and artist',
      send: 'SEND YOUR REPLY',
      sending: 'SENDING…',
      sendError: 'We couldn’t send your reply. Please check your connection and try again.',
      thanks: 'Thank you!',
      thanksText: 'We’ve received your reply.',
      another: 'Send another reply',

      todoTitle: 'Things to do',
      todoSub: 'A few ideas for those staying a few extra days in and around Alghero.'
    }
  }
};
