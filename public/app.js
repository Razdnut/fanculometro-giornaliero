/**
 * Fanculometro Giornaliero - App Controller
 * Con database potenziato di Prescrizioni Mediche e Motti Odierni
 */

document.addEventListener('DOMContentLoaded', () => {
  const gauge = new FanculometroGauge('gauge-mount');
  const measureBtn = document.getElementById('btn-measure');
  const resultCard = document.getElementById('result-card');
  const statusBanner = document.getElementById('status-banner');
  const soundToggleBtn = document.getElementById('btn-sound-toggle');
  const copyBtn = document.getElementById('btn-copy-result');
  const contextSelect = document.getElementById('trigger-context');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('btn-clear-history');

  const btnNextPrescription = document.getElementById('btn-next-prescription');
  const btnNextQuote = document.getElementById('btn-next-quote');

  let currentResult = null;

  // Rich Database of Diagnoses, Prescriptions and Mottos (8 per tier)
  const diagnoses = [
    {
      min: 0,
      max: 20,
      category: 'Zen Totale',
      badge: '😇 SANTO SUBITO',
      color: '#2bb0ec',
      emoji: '🧘‍♂️🕊️✨',
      title: 'Aura Celestiale e Pace Interiore',
      diagnosis: 'Oggi sei un monaco tibetano sotto sedativi. Nulla può scalfire la tua serenità, nemmeno una riunione alle 17:30 di venerdì o un audio WhatsApp di 9 minuti senza pause.',
      prescriptions: [
        'Approfittane subito: rispondi a tutte le email odiose e sbriga le faccende burocratiche prima che questo miracoloso stato di grazia svanisca.',
        'Dona un po\' della tua immensa pazienza a chi ti circonda. Oppure no: tienitela stretta che domani è un altro giorno.',
        'Assumi 200mg di realtà prima di cena per non svegliarti domattina con un contraccolpo psicologico.',
        'Accetta pure quell\'invito a cena con i parenti molesti: oggi il tuo scudo energetico è impenetrabile.',
        'Ascolta un messaggio vocale di 12 minuti a velocità 1x senza accelerarlo: oggi puoi compiere questo prodigio mistico.',
        'Cammina scalzo nell\'erba e respira profondo. Se qualcuno prova a farti arrabbiare, fagli un cenno benedicente con due dita.',
        'Offri un caffè a quel collega che di solito non sopporti: oggi hai l\'animo talmente nobile da sembrare sospetto.',
        'Fai una sessione di decluttering digitale e ripulisci il desktop: la tua mente è pura come una limpida sorgente alpina.'
      ],
      quotes: [
        '"Pace, amore e che ognuno vada per la sua strada con grazia."',
        '"Non vedo, non sento, non mando a stendere nessuno."',
        '"Oggi sono fatto d\'aria e compassione: provateci pure, non mi scalfite."',
        '"Beati i miti, perché oggi non finiranno sulle prime pagine di cronaca."',
        '"La mia serenità è sponsorizzata dall\'indifferenza selettiva."',
        '"Se la vita ti dà limoni, tu fai il limoncello e offrilo con un sorriso serafico."',
        '"Respiro dentro pace, respiro fuori la mediocrità altrui."',
        '"Un vero maestro zen non risponde alle provocazioni: le visualizza e le lascia evaporare."'
      ]
    },
    {
      min: 21,
      max: 40,
      category: 'Tolleranza Normale',
      badge: '🌿 CALMA APPARENTE',
      color: '#48bb3f',
      emoji: '☕🙂👌',
      title: 'Equilibrio Civile & Diplomazia Tattica',
      diagnosis: 'Reggi bene. Sorridi per educazione, ma dentro fai un rapido calcolo di quanti anni di reclusione comporterebbe strozzare chi usa il vivavoce nei luoghi pubblici.',
      prescriptions: [
        'Un buon caffè caldo, cuffie alle orecchie e distanza di sicurezza di almeno 2 metri da chi inizia le frasi con "Non vorrei dirti come fare il tuo lavoro, ma...".',
        'Limitare i contatti con individui che mandano messaggi con solo scritto "Ciao" senza aggiungere altro per i successivi 10 minuti.',
        'Fare 3 respiri profondi ogni volta che il Wi-Fi rallenta o qualcuno ti chiede una password che gli hai già mandato 4 volte.',
        'Pillola di pragmatismo: annuire lentamente fingendo di ascoltare, mentre mentalmente canti la sigla di un cartone animato anni \'90.',
        'Evitare le pause caffè aziendali sovraffollate: rischio impennata verso il livello arancione in meno di 90 secondi.',
        'Camomilla preventiva alle ore 15:00 per disinnescare il consueto picco di idiozia pomeridiana.',
        'Imposta lo stato di Teams/Slack su "In riunione" e usa quel tempo per guardare il soffitto in santa pace.',
        'Non aprire la cartella spam e non rispondere a chiamate da numeri con prefisso sconosciuto.'
      ],
      quotes: [
        '"Non cerco guai, ma non provocarmi dopo pranzo."',
        '"Diplomazia è l\'arte di dire \'interessante\' quando intendi \'ma cosa stai dicendo\'."',
        '"Oggi sono civile per legge costituzionale, non per vocazione naturale."',
        '"Sorrido educatamente perché non posso ancora incenerirvi con lo sguardo."',
        '"La mia pazienza non è infinita: ha scadenza a breve termine come lo yogurt fresco."',
        '"Tolleranza al 100%, ma con franchigia a vostro carico in caso di sciocchezze."',
        '"Non ho tempo per i vostri drammi, ho già la mia vita da tenere in piedi."',
        '"La calma è la virtù dei forti, ma anche i forti a una certa ora staccano il telefono."'
      ]
    },
    {
      min: 41,
      max: 60,
      category: 'Attenzione Gialla',
      badge: '⚠️ MICCIA CORTA',
      color: '#fad02c',
      emoji: '⚡🤨🍵',
      title: 'Pazienza in Riserva (Spia Accesa)',
      diagnosis: 'Il fanculo è sulla punta della lingua, armato e pronto al decollo balistico. Basta un file Excel corrotto o un "Hai 2 minuti per una call veloce?" per scatenare l\'inferno.',
      prescriptions: [
        'Evita assolutamente discussioni di condominio, parenti stretti e colleghi con l\'entusiasmo mattutino ingiustificato. Conta fino a 10... poi valuta se mandare comunque tutti a quel paese.',
        'Disattivare le notifiche dei gruppi WhatsApp con più di 3 partecipanti. Se è davvero un\'emergenza chiameranno i pompieri, non te.',
        'Fai una passeggiata solitaria. Se qualcuno ti incrocia e prova a chiacchierare del meteo, tossisci rumorosamente e guarda l\'orologio con ansia.',
        'Dose massiccia di carboidrati complessi (focaccia, pizza o brioche calda) per abbattere i livelli di cortisolo e bile.',
        'Metti lo screensaver con la scritta "OCCUPATO: NON INTERAGIRE" e fissa un grafico a caso su Excel per scoraggiare intrusi.',
        'Respirazione diaframmatica 4-7-8: inspira per 4 secondi, trattieni per 7, all\'ottavo sibila a denti stretti.',
        'Bevi un sorso d\'acqua ogni volta che vorresti correggere l\'ennesimo refuso o strafalcione grammaticale di qualcuno.',
        'Usa la tecnica del gatto: se qualcuno cerca di coinvolgerti in problemi non tuoi, fissalo senza battere ciglio e leccati il dorso della mano.'
      ],
      quotes: [
        '"Ancora un piccolo passo falso e vi mando tutti in orbita stazionaria."',
        '"Ho la miccia corta e la polvere da sparo inzuppata nel caffè amaro."',
        '"Non sono di cattivo umore, è la vostra esistenza che crea interferenze col mio feng shui."',
        '"Sto esaurendo la pazienza e i punti fedeltà dell\'autocontrollo civico."',
        '"Parlami solo se hai buone notizie, bonifici confermati o del cibo caldo da offrirmi."',
        '"Tra il dire e il fare c\'è di mezzo un Vaffa che attende solo un pretesto grammaticale."',
        '"Ho il semaforo interiore arancione lampeggiante: rallentare e mantenere la distanza di sicurezza."',
        '"Non mettetemi alla prova: oggi non ho ripassato la tolleranza."'
      ]
    },
    {
      min: 61,
      max: 80,
      category: 'Nervosismo Acuto',
      badge: '🔥 ALLERTA ARANCIONE',
      color: '#f36c21',
      emoji: '🤬🌋💥',
      title: 'Fanculo Preventivo Attivo',
      diagnosis: 'Hai già mandato affanculo 4 persone col pensiero prima ancora di uscire dal letto. Se qualcuno ti saluta con troppa allegria lo consideri una provocazione premeditata.',
      prescriptions: [
        'Indossa cuffie a padiglione gigante (anche a volume zero) per scoraggiare qualsiasi approccio umano. Sguardo truce d\'ordinanza e camminata marziale.',
        'Terapia d\'urto: non aprire l\'email del capo fino a domani. Se ti cercano, dì che sei in "allineamento strategico con stakeholders esterni".',
        'Eliminare la caffeina immediatamente. Oggi anche il decaffeinato potrebbe farti detonare come una carica di tritolo.',
        'Scrivere su un foglio tutti i nomi di chi vorresti mandare a quel paese, appallottolarlo e canestrarlo nel cestino con rabbia agonistica.',
        'Trattamento d\'urto: 45 minuti di musica rock/metal a palla o video di ruspe che abbattono edifici fatiscenti per catarsi interiore.',
        'Nessuna decisione irrevocabile prima delle 20:00. Non licenziarti, non diseredare i congiunti, non bloccare l\'intero albero genealogico.',
        'Cammina guardando ostentatamente in basso sul telefono, simulando di essere concentratissimo su un\'operazione finanziaria a Wall Street.',
        'Se qualcuno ti dice "Dovresti sorridere di più", rispondi con un ghigno che ricorda Hannibal Lecter prima della cena.'
      ],
      quotes: [
        '"Non sei tu, sono tutti. Ma soprattutto sei tu."',
        '"Oggi non prendo prigionieri, prendo solo ferie mentali forzate senza preavviso."',
        '"Ho un limite di sopportazione giornaliero e l\'ho consumato per intero alle 08:12."',
        '"Cammino sul filo della legalità e oggi ho pure le suole lisce."',
        '"Se la pazienza è la virtù dei forti, io oggi sono un fuscello in mezzo all\'uragano Katrina."',
        '"La mia cortesia è terminata con l\'ultimo aggiornamento: ora sono in modalità solo acido."',
        '"Non ho problemi di gestione della rabbia, ho problemi di gestione degli scemi."',
        '"Fanculo preventivo: non so chi sei, ma nel dubbio portati avanti e vacci."'
      ]
    },
    {
      min: 81,
      max: 100,
      category: 'Fanculo Nucleare',
      badge: '💥 DEFCON 1 - APOCALISSE',
      color: '#ea3929',
      emoji: '☢️🚀💀🌪️',
      title: 'Catastrofe da Fanculizzazione Totale',
      diagnosis: 'RADIAZIONI INCONTROLLATE. Sei un distributore automatico di vaffanculo a ripetizione con mirino termico. Anche il cane del vicino ti ha visto dalla finestra e ha preferito cambiare stanza per sicurezza.',
      prescriptions: [
        'ISOLAMENTO BIOLOGICO IMMEDIATO. Metti lo smartphone in modalità aereo, abbassa le tapparelle, stacca il citofono e bevi 3 litri di camomilla rinforzata.',
        'Chiuditi in bagno, metti le mani a conca sotto il rubinetto dell\'acqua gelata, bagnati la faccia e ripeti: "Domani è un altro giorno per mandarli affanculo tutti".',
        'Non uscire di casa per nessun motivo. Se bussa il corriere, fagli scivolare il pacco sotto la porta senza aprire né proferire sillaba.',
        'Terapia acustica: urla dentro un cuscino ortopedico per 30 secondi consecutivi, finché non vedi i puntini fosforescenti.',
        'Brucia simbolicamente (o cancella) tutti i memo urgenti. Se il mondo va a fuoco, tanto vale sedersi e arrostire i marshmallow.',
        'Tè caldo e gatti. Se non hai un gatto, adotta virtualmente un felino arrabbiato su internet e condividete il disprezzo per la razza umana.',
        'Imposta la risposta automatica via email: "Sono temporaneamente assente e con ogni probabilità non mi interessa ciò che avete da dirmi".',
        'Trattamento intensivo a base di divano, copertina di pile e serie tv splatter dove vince il mostro.'
      ],
      quotes: [
        '"Andateci piano? No, andateci proprio tutti a quel paese senza scalo."',
        '"Non è un giorno no, è un vaffanculo con una data di nascita e di morte sopra."',
        '"Ho più rancore in corpo io oggi che un\'assemblea condominiale alle 21:30 di mercoledì."',
        '"Non parlatemi, non guardatemi, non respirate nella mia stessa coordinata GPS."',
        '"Oggi ho il lanciamissili verbale con puntamento automatico su qualsiasi bipede senziente."',
        '"Defcon 1 dichiarato: l\'umanità è pregata di evacuare il mio raggio visivo."',
        '"Se dovessi quantificare quanto mi avete stufato, servirebbe la notazione scientifica con 10 alla ventiquattresima."',
        '"Chi semina vento raccoglie tempesta. Chi rompe le scatole a me oggi raccoglie un Vaffa nucleare."'
      ]
    }
  ];

  function getDiagnosisForPercent(pct) {
    return diagnoses.find(d => pct >= d.min && pct <= d.max) || diagnoses[diagnoses.length - 1];
  }

  function getRandomItem(arr, currentItem = null) {
    if (!arr || arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    let candidate = arr[Math.floor(Math.random() * arr.length)];
    while (candidate === currentItem && arr.length > 1) {
      candidate = arr[Math.floor(Math.random() * arr.length)];
    }
    return candidate;
  }

  // Audio Toggle
  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = window.soundEngine.toggle();
    soundToggleBtn.innerHTML = isEnabled 
      ? '🔊 Suoni: ON' 
      : '🔇 Suoni: OFF';
    soundToggleBtn.classList.toggle('muted', !isEnabled);
  });

  // Load history from localStorage
  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem('fanculometro_history') || '[]');
      renderHistory(saved);
    } catch (e) {
      renderHistory([]);
    }
  }

  function saveToHistory(record) {
    try {
      const saved = JSON.parse(localStorage.getItem('fanculometro_history') || '[]');
      saved.unshift(record);
      const trimmed = saved.slice(0, 10);
      localStorage.setItem('fanculometro_history', JSON.stringify(trimmed));
      renderHistory(trimmed);
    } catch (e) {}
  }

  function renderHistory(items) {
    if (!historyList) return;
    if (items.length === 0) {
      historyList.innerHTML = '<li class="history-empty">Nessuna misurazione recente registrata.</li>';
      return;
    }

    historyList.innerHTML = items.map(item => `
      <li class="history-item" style="border-left-color: ${item.color}">
        <div class="history-left">
          <span class="history-badge" style="background-color: ${item.color}22; color: ${item.color}">
            ${item.percent}%
          </span>
          <span class="history-category">${item.category}</span>
          ${item.context ? `<span class="history-context">(${item.context})</span>` : ''}
        </div>
        <span class="history-time">${item.time}</span>
      </li>
    `).join('');
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      localStorage.removeItem('fanculometro_history');
      renderHistory([]);
    });
  }

  // Interactive Re-roll buttons
  if (btnNextPrescription) {
    btnNextPrescription.addEventListener('click', () => {
      if (!currentResult || !currentResult.prescriptions) return;
      const nextPrescription = getRandomItem(currentResult.prescriptions, currentResult.prescription);
      currentResult.prescription = nextPrescription;
      
      const presEl = document.getElementById('res-prescription');
      presEl.textContent = nextPrescription;
      presEl.classList.remove('fade-highlight');
      void presEl.offsetWidth; // trigger reflow
      presEl.classList.add('fade-highlight');

      if (window.soundEngine && soundToggleBtn && !soundToggleBtn.classList.contains('muted')) {
        window.soundEngine.playTick(1.2);
      }
    });
  }

  if (btnNextQuote) {
    btnNextQuote.addEventListener('click', () => {
      if (!currentResult || !currentResult.quotes) return;
      const nextQuote = getRandomItem(currentResult.quotes, currentResult.quote);
      currentResult.quote = nextQuote;
      
      const quoteEl = document.getElementById('res-quote');
      quoteEl.textContent = nextQuote;
      quoteEl.classList.remove('fade-highlight');
      void quoteEl.offsetWidth; // trigger reflow
      quoteEl.classList.add('fade-highlight');

      if (window.soundEngine && soundToggleBtn && !soundToggleBtn.classList.contains('muted')) {
        window.soundEngine.playTick(1.4);
      }
    });
  }

  // Measure Trigger
  measureBtn.addEventListener('click', async () => {
    if (gauge.isMeasuring) return;

    // Reset result UI
    resultCard.classList.add('hidden');
    resultCard.classList.remove('revealed');
    document.body.classList.remove('shake-alarm');
    measureBtn.disabled = true;
    measureBtn.classList.add('measuring');
    measureBtn.innerHTML = `
      <span class="spinner"></span>
      Misurazione in corso... (5s)
    `;

    statusBanner.classList.remove('hidden');
    statusBanner.textContent = 'Avvio scansione oscillometrica a 5 secondi...';

    // Generate random value (pull from Bun server API if available, or generate client-side on static hosts like GitHub Pages)
    let targetPercent;
    const isStaticHost = window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:';
    if (!isStaticHost) {
      try {
        const res = await fetch('/api/measure');
        if (res.ok) {
          const data = await res.json();
          targetPercent = data.level;
        }
      } catch (e) {
        // Fallback to client-side generation
      }
    }

    if (targetPercent === undefined || isNaN(targetPercent)) {
      targetPercent = Math.floor(Math.random() * 101);
    }

    // Launch the 5-second back-and-forth oscillation
    gauge.start5SecondMeasurement(
      targetPercent,
      // Status update callback during the 5s
      (msg) => {
        statusBanner.textContent = msg;
      },
      // Final completion callback after 5s
      (finalPercent) => {
        measureBtn.disabled = false;
        measureBtn.classList.remove('measuring');
        measureBtn.innerHTML = `🔄 Ricalcola Fanculometro`;
        statusBanner.textContent = `🎯 Misurazione completata con precisione quantistica!`;

        const diag = getDiagnosisForPercent(finalPercent);
        
        // Pick random prescription and quote from the pool
        const initialPrescription = getRandomItem(diag.prescriptions);
        const initialQuote = getRandomItem(diag.quotes);

        currentResult = {
          percent: finalPercent,
          ...diag,
          prescription: initialPrescription,
          quote: initialQuote,
          context: contextSelect ? contextSelect.value : '',
          time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        // Screen shake on severe level
        if (finalPercent >= 80) {
          document.body.classList.add('shake-alarm');
          setTimeout(() => document.body.classList.remove('shake-alarm'), 1200);
        }

        // Show result card
        displayResult(currentResult);
        saveToHistory(currentResult);

        // Smooth scroll to result
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    );
  });

  function displayResult(res) {
    document.getElementById('res-badge').textContent = `${res.badge} (${res.percent}%)`;
    document.getElementById('res-badge').style.backgroundColor = `${res.color}20`;
    document.getElementById('res-badge').style.color = res.color;
    document.getElementById('res-badge').style.borderColor = res.color;

    document.getElementById('res-title').textContent = res.title;
    document.getElementById('res-emoji').textContent = res.emoji;
    document.getElementById('res-description').textContent = res.diagnosis;
    document.getElementById('res-prescription').textContent = res.prescription;
    document.getElementById('res-quote').textContent = res.quote;

    const contextEl = document.getElementById('res-context-tag');
    if (res.context && res.context !== 'Tutto e tutti') {
      contextEl.textContent = `Fattore critico: ${res.context}`;
      contextEl.classList.remove('hidden');
    } else {
      contextEl.classList.add('hidden');
    }

    resultCard.classList.remove('hidden');
    // Animate entry
    setTimeout(() => {
      resultCard.classList.add('revealed');
    }, 20);
  }

  // Copy result for WhatsApp / Social
  copyBtn.addEventListener('click', () => {
    if (!currentResult) return;

    const triggerInfo = currentResult.context ? `\n📌 Causa: ${currentResult.context}` : '';
    const shareText = `📊 FANCULOMETRO GIORNALIERO 📊
Data: ${currentResult.date} ore ${currentResult.time}
Livello di Fanculizzazione: ${currentResult.percent}%
Stato: ${currentResult.badge} ${currentResult.emoji}${triggerInfo}

Diagnosi: "${currentResult.diagnosis}"
💊 Prescrizione Medica: ${currentResult.prescription}
💬 Motto Odierno: ${currentResult.quote}

⚠️ Calcolato con precisione su Fanculometro Giornaliero Web App!`;

    navigator.clipboard.writeText(shareText).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '✅ Copiato negli Appunti!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('copied');
      }, 2500);
    }).catch(() => {
      alert('Impossibile copiare automaticamente. Seleziona il testo manualmente.');
    });
  });

  loadHistory();
});
