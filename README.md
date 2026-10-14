# 🎯 Fanculometro Giornaliero (Web App in Bun)

Un'applicazione web leggera, reattiva e divertente creata con **Bun** e **Vanilla JavaScript/CSS/SVG**, ispirata fedelmente al tachimetro a 5 settori colorati per calcolare con precisione quantistica il **livello di fanculizzazione giornaliera**.

---

## ✨ Caratteristiche Principali

1. **Grafica fedele all'immagine di riferimento**:
   - Tachimetro semicircolare suddiviso in **5 settori colorati** (Azzurro, Verde, Giallo, Arancione, Rosso) con scanalature bianche di separazione.
   - Indicatori di fondo scala **LOW** (azzurro) e **HIGH** (rosso).
   - Testata centrale **FANCULOMETRO GIORNALIERO** con la medesima tipografia bold dell'originale.
   - Perno e lancetta rastremata con ombreggiatura e rotazione fluida (-90° a +90°).

2. **Oscillazione realistica di 5 secondi**:
   - Al click del pulsante, la lancetta inizia una misurazione lenta e drammatica che **oscilla avanti e indietro per esattamente 5 secondi** (1.1s sweep alto, 2.2s discesa, 3.25s risalita, convergenza smorzata con micro-vibrazioni meccaniche e blocco sul valore finale casuale).
   - Messaggi di scansione a video che si aggiornano dinamicamente in tempo reale durante i 5 secondi (*"Scansione audio WhatsApp oltre 2 minuti..."*, *"Rilevamento colleghi con call urgente..."*).

3. **Effetti Sonori Procedurali (Web Audio API)**:
   - Zero file mp3 esterni pesanti: sintetizzati al volo tramite oscillatori audio nativi!
   - Ticchettio meccanico della lancetta che cambia pitch in base alla velocità.
   - Tensione crescente in sottofondo nei 5 secondi.
   - Fanfara finale differenziata:
     - Livello basso (<30%): campanella Zen tibetana.
     - Livello medio (30-60%): bip di avviso.
     - Livello elevato (>60%): allarme DEFCON 1 con sirena soft e scuotimento comico dello schermo!
   - Pulsante toggle per mutare/attivare i suoni in qualsiasi momento.

4. **Diagnosi ironiche e Prescrizioni**:
   - **0-20%**: *Zen Totale / Santo Subito 😇*
   - **21-40%**: *Tolleranza Normale / Calma Apparente 🌿*
   - **41-60%**: *Attenzione Gialla / Miccia Corta ⚠️*
   - **61-80%**: *Allerta Arancione / Fanculo Preventivo 🔥*
   - **81-100%**: *DEFCON 1 / Catastrofe Nucleare di Vaffanculo 💥*

5. **Funzionalità Extra**:
   - Selettore del *"Fattore di disturbo"* (audio WhatsApp, riunioni inutili, traffico, ecc.).
   - Pulsante **"Copia per WhatsApp / Social"** per condividere la scheda di diagnosi formattata.
   - Storico locale delle ultime misurazioni salvato in `localStorage`.

---

## 🚀 Avvio Rapido con Bun

Assicurati di avere Bun installato, poi avvia il server:

```bash
bun run server.js
```

Oppure in modalità sviluppo con live reload:

```bash
bun dev
```

Apri quindi il browser su:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Struttura del Progetto

```
gallant-borg/
├── package.json        # Configurazione Bun
├── server.js           # Server HTTP nativo ultra-veloce (Bun.serve)
├── README.md           # Documentazione
└── public/
    ├── index.html      # Struttura e card dell'interfaccia
    ├── style.css       # Design responsive e moderno
    ├── gauge.js        # Motore SVG e fisica di oscillazione a 5 secondi
    ├── audio.js        # Motore audio procedurale (Web Audio API)
    └── app.js          # Controller logica, diagnosi e condivisione
```
