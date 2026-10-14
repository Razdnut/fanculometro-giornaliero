/**
 * Fanculometro Gauge Engine
 * SVG-based precision speedometer matching the reference image geometry
 */

class FanculometroGauge {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentPercent = 0;
    this.isMeasuring = false;
    this.animId = null;
    this.lastTickDeg = null;

    // Segment definitions matching the reference image colors
    this.segments = [
      { id: 'seg-1', name: 'Zen Totale', color: '#2bb0ec', startDeg: 180, endDeg: 144, minPct: 0, maxPct: 20 },
      { id: 'seg-2', name: 'Tolleranza Normale', color: '#48bb3f', startDeg: 144, endDeg: 108, minPct: 20, maxPct: 40 },
      { id: 'seg-3', name: 'Attenzione / Giallo', color: '#fad02c', startDeg: 108, endDeg: 72, minPct: 40, maxPct: 60 },
      { id: 'seg-4', name: 'Nervosismo Acuto', color: '#f36c21', startDeg: 72, endDeg: 36, minPct: 60, maxPct: 80 },
      { id: 'seg-5', name: 'Fanculo Nucleare', color: '#ea3929', startDeg: 36, endDeg: 0, minPct: 80, maxPct: 100 }
    ];

    this.render();
  }

  // Polar to Cartesian conversion for SVG arc paths
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY - radius * Math.sin(angleInRadians)
    };
  }

  // Describe an annular sector (donut wedge)
  describeRingSegment(x, y, rIn, rOut, startAngle, endAngle) {
    const startOuter = this.polarToCartesian(x, y, rOut, startAngle);
    const endOuter = this.polarToCartesian(x, y, rOut, endAngle);
    const startInner = this.polarToCartesian(x, y, rIn, endAngle);
    const endInner = this.polarToCartesian(x, y, rIn, startAngle);

    const arcSweep = Math.abs(endAngle - startAngle) <= 180 ? 0 : 1;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOut} ${rOut} 0 ${arcSweep} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${rIn} ${rIn} 0 ${arcSweep} 0 ${endInner.x} ${endInner.y}`,
      'Z'
    ].join(' ');
  }

  render() {
    const cx = 250;
    const cy = 250;
    const rOuter = 210;
    const rInner = 152;
    const rTrackInner = 100;

    let segmentsHtml = '';
    this.segments.forEach((seg, idx) => {
      const d = this.describeRingSegment(cx, cy, rInner, rOuter, seg.startDeg, seg.endDeg);
      segmentsHtml += `
        <path id="${seg.id}" 
              d="${d}" 
              fill="${seg.color}" 
              stroke="#ffffff" 
              stroke-width="5" 
              stroke-linejoin="round"
              class="gauge-segment" 
              data-index="${idx}"
              data-name="${seg.name}" />
      `;
    });

    // Inner subtle grey background track
    const innerTrackD = this.describeRingSegment(cx, cy, rTrackInner, rInner - 1, 180, 0);

    this.container.innerHTML = `
      <div class="gauge-wrapper">
        <svg viewBox="0 0 500 360" class="gauge-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="needle-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#1a202c" flood-opacity="0.3"/>
            </filter>
            <filter id="hub-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
            <radialGradient id="hubGradient" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#64748b"/>
              <stop offset="55%" stop-color="#475569"/>
              <stop offset="100%" stop-color="#334155"/>
            </radialGradient>
            <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155"/>
              <stop offset="50%" stop-color="#475569"/>
              <stop offset="100%" stop-color="#334155"/>
            </linearGradient>
          </defs>

          <!-- Inner light grey track matching reference image -->
          <path d="${innerTrackD}" fill="#f1f5f9" class="inner-track" />

          <!-- Colored Segments -->
          <g class="segments-group">
            ${segmentsHtml}
          </g>

          <!-- Labels LOW and HIGH -->
          <text x="60" y="278" class="gauge-label label-low">LOW</text>
          <text x="440" y="278" class="gauge-label label-high">HIGH</text>

          <!-- Needle Indicator with Shadow -->
          <g id="needle-group" transform="rotate(-90, 250, 250)" filter="url(#needle-shadow)">
            <!-- Needle pointer: tapered hand extending towards colored arc -->
            <path d="M 243 250 L 248.2 96 Q 250 88 251.8 96 L 257 250 Z" 
                  fill="url(#needleGradient)" 
                  class="needle-pointer" />
          </g>

          <!-- Center Pivot Hub -->
          <circle cx="${cx}" cy="${cy}" r="22" fill="url(#hubGradient)" filter="url(#hub-shadow)" class="needle-hub" />
          <circle cx="${cx}" cy="${cy}" r="7" fill="#1e293b" opacity="0.75" />

          <!-- Two-line title in exact style of SKILL LEVEL from reference image -->
          <text x="250" y="298" text-anchor="middle" class="gauge-title-line1">FANCULOMETRO</text>
          <text x="250" y="328" text-anchor="middle" class="gauge-title-line2">GIORNALIERO</text>
        </svg>

        <!-- Dynamic digital reading badge below -->
        <div class="gauge-digital-readout">
          <span id="readout-pct">0%</span>
          <span id="readout-status">Pronto alla misurazione</span>
        </div>
      </div>
    `;

    this.needleGroup = document.getElementById('needle-group');
    this.readoutPct = document.getElementById('readout-pct');
    this.readoutStatus = document.getElementById('readout-status');

    this.setPercentage(0);
  }

  /**
   * Set gauge percentage directly (0 to 100)
   * 0% = -90 deg (pointing left)
   * 50% = 0 deg (pointing straight up)
   * 100% = +90 deg (pointing right)
   */
  setPercentage(pct) {
    this.currentPercent = Math.max(0, Math.min(100, pct));
    const angle = -90 + (this.currentPercent / 100) * 180;
    
    if (this.needleGroup) {
      this.needleGroup.setAttribute('transform', `rotate(${angle.toFixed(2)}, 250, 250)`);
    }

    if (this.readoutPct) {
      this.readoutPct.textContent = `${Math.round(this.currentPercent)}%`;
    }

    // Audio tick on crossing degree steps
    const intDeg = Math.floor(angle / 2.5);
    if (this.lastTickDeg !== intDeg) {
      this.lastTickDeg = intDeg;
      if (window.soundEngine && this.isMeasuring) {
        const pitchMod = 0.8 + (this.currentPercent / 100) * 0.9;
        window.soundEngine.playTick(pitchMod);
      }
    }

    // Highlight active segment
    this.highlightSegmentForPercent(this.currentPercent);
  }

  highlightSegmentForPercent(pct) {
    const segElements = this.container.querySelectorAll('.gauge-segment');
    segElements.forEach((el, index) => {
      const seg = this.segments[index];
      if (pct >= seg.minPct && (pct <= seg.maxPct || (index === 4 && pct >= 100))) {
        el.classList.add('active-segment');
      } else {
        el.classList.remove('active-segment');
      }
    });
  }

  /**
   * Smoothstep interpolation helper
   */
  smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  /**
   * 5-Second oscillating measurement animation
   * Slowly and dramatically moves back and forth before locking into target
   */
  start5SecondMeasurement(targetPercent, onStatusUpdate, onComplete) {
    if (this.isMeasuring) return;
    this.isMeasuring = true;

    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.startTension();
    }

    const duration = 5000; // Exact 5 seconds
    const startTime = performance.now();

    // Funny scanning status messages during the 5s
    const scanSteps = [
      { at: 0, text: 'Inizializzazione sensori di pazienza...' },
      { at: 800, text: 'Scansione messaggi vocali WhatsApp oltre 2 minuti...' },
      { at: 1600, text: 'Rilevamento: "Hai 5 minuti per una call veloce?"...' },
      { at: 2500, text: 'Analisi semafori rossi e traffico in tangenziale...' },
      { at: 3400, text: 'Valutazione battute non richieste e scadenze...' },
      { at: 4200, text: 'Calibrazione fine del vaffanculo quantistico...' },
      { at: 4700, text: 'Stabilizzazione coordinate di precisione...' }
    ];

    let lastStepIdx = -1;

    // Defined keyframes for the back-and-forth oscillation over 5000ms
    // p: progress (0 to 1), val: percentage on dial
    const startVal = this.currentPercent || 0;
    const peak1 = 78;
    const valley1 = 18;
    const peak2 = 92;
    const valley2 = Math.max(12, Math.min(88, targetPercent + (targetPercent > 50 ? -28 : 28)));
    const overshoot = Math.max(2, Math.min(98, targetPercent + (targetPercent > 50 ? 7 : -7)));

    const keyframes = [
      { t: 0.00, val: startVal },
      { t: 0.22, val: peak1 },    // ~1.1s: sweeps up high
      { t: 0.44, val: valley1 },  // ~2.2s: swings back low
      { t: 0.65, val: peak2 },    // ~3.25s: surges high
      { t: 0.82, val: valley2 },  // ~4.1s: sweeps towards target zone
      { t: 0.93, val: overshoot },// ~4.65s: slight overshoot bounce
      { t: 1.00, val: targetPercent } // 5.0s: settles on exact value
    ];

    const animate = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);

      // Status text updates
      for (let i = scanSteps.length - 1; i >= 0; i--) {
        if (elapsed >= scanSteps[i].at) {
          if (lastStepIdx !== i) {
            lastStepIdx = i;
            if (onStatusUpdate) onStatusUpdate(scanSteps[i].text);
            if (this.readoutStatus) this.readoutStatus.textContent = scanSteps[i].text;
          }
          break;
        }
      }

      // Find current keyframe segment
      let currentPct = targetPercent;
      for (let i = 0; i < keyframes.length - 1; i++) {
        const kf1 = keyframes[i];
        const kf2 = keyframes[i + 1];
        if (p >= kf1.t && p <= kf2.t) {
          const localT = (p - kf1.t) / (kf2.t - kf1.t);
          // Smooth sinusoidal ease in and out for natural momentum
          const ease = 0.5 - 0.5 * Math.cos(localT * Math.PI);
          currentPct = kf1.val + (kf2.val - kf1.val) * ease;

          // Add a tiny realistic needle vibration during high speed sweeps
          if (p < 0.9) {
            const tremor = Math.sin(elapsed * 0.05) * 0.8 * (1 - p);
            currentPct += tremor;
          }
          break;
        }
      }

      currentPct = Math.max(0, Math.min(100, currentPct));
      this.setPercentage(currentPct);

      if (p < 1) {
        this.animId = requestAnimationFrame(animate);
      } else {
        this.isMeasuring = false;
        this.setPercentage(targetPercent);

        if (window.soundEngine) {
          window.soundEngine.playResultFanfare(targetPercent);
        }

        if (this.readoutStatus) {
          this.readoutStatus.textContent = 'Diagnosi registrata!';
        }

        if (onComplete) {
          onComplete(targetPercent);
        }
      }
    };

    this.animId = requestAnimationFrame(animate);
  }
}

if (typeof window !== 'undefined') {
  window.FanculometroGauge = FanculometroGauge;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FanculometroGauge };
}
