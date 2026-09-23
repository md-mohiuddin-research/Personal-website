/* 
   Md. Mohiuddin - Interactive DFT Band Gap Visualizer
   Custom canvas renderer for electronic band structure simulation
   Theme: Perovskite Mg3ZBr3 (Z = As, Sb, Bi) band alignment (ACS Omega paper)
*/

class DFTBandgapWidget {
  constructor() {
    this.canvas = document.getElementById('bandgapCanvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    
    // Materials data (grounded in the applicant's actual research parameters)
    this.materials = {
      As: {
        name: 'Mg₃AsBr₃',
        bandgap: 2.12,
        type: 'Indirect (X → Γ)',
        lattice: '6.68 Å',
        absorb: '585 nm (Visible)',
        colorConduction: '#0066cc',
        colorValence: '#e84118',
        // Parabolas/curves parameters for DFT band plot
        conductionBands: [
          { start: 1.06, min: 1.06, end: 1.4, symmetryOffset: 0.3 }, // split bands
          { start: 1.15, min: 1.15, end: 1.55, symmetryOffset: 0 }
        ],
        valenceBands: [
          { start: -1.0, max: -1.0, end: -1.3, symmetryOffset: 0 },
          { start: -1.05, max: -1.05, end: -1.45, symmetryOffset: 0 },
          { start: -1.25, max: -1.35, end: -1.6, symmetryOffset: 0 }
        ]
      },
      Sb: {
        name: 'Mg₃SbBr₃',
        bandgap: 1.58,
        type: 'Direct (Γ → Γ)',
        lattice: '6.76 Å',
        absorb: '785 nm (Near-IR)',
        colorConduction: '#0066cc',
        colorValence: '#008060',
        conductionBands: [
          { start: 0.79, min: 0.79, end: 1.25, symmetryOffset: 0 },
          { start: 0.88, min: 0.88, end: 1.4, symmetryOffset: 0 }
        ],
        valenceBands: [
          { start: -0.79, max: -0.79, end: -1.15, symmetryOffset: 0 },
          { start: -0.84, max: -0.84, end: -1.25, symmetryOffset: 0 },
          { start: -1.15, max: -1.2, end: -1.5, symmetryOffset: 0 }
        ]
      },
      Bi: {
        name: 'Mg₃BiBr₃',
        bandgap: 1.18,
        type: 'Direct (Γ → Γ)',
        lattice: '6.84 Å',
        absorb: '1050 nm (Short-IR)',
        colorConduction: '#0066cc',
        colorValence: '#b25e00',
        conductionBands: [
          { start: 0.59, min: 0.59, end: 1.1, symmetryOffset: 0 },
          { start: 0.7, min: 0.7, end: 1.3, symmetryOffset: 0 }
        ],
        valenceBands: [
          { start: -0.59, max: -0.59, end: -1.05, symmetryOffset: 0 },
          { start: -0.63, max: -0.63, end: -1.15, symmetryOffset: 0 },
          { start: -1.0, max: -1.05, end: -1.4, symmetryOffset: 0 }
        ]
      }
    };
    
    this.currentMaterial = 'Sb'; // default
    this.animationProgress = 1;
    this.prevMaterial = 'Sb';
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Bind buttons
    const buttons = document.querySelectorAll('.element-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mat = e.target.getAttribute('data-element');
        if (mat && mat !== this.currentMaterial) {
          this.switchMaterial(mat);
          
          // Update active button classes
          buttons.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
        }
      });
    });
    
    this.render();
  }
  
  resize() {
    const parent = this.canvas.parentElement;
    this.width = parent.clientWidth - 48; // accounting for padding
    this.height = 200;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.draw();
  }
  
  switchMaterial(mat) {
    this.prevMaterial = this.currentMaterial;
    this.currentMaterial = mat;
    this.animationProgress = 0;
    
    // Smooth transition
    const duration = 240; // ms
    const startTime = Date.now();
    
    // Update numerical UI stats smoothly
    const statsBg = document.getElementById('statBandgap');
    const statsLat = document.getElementById('statLattice');
    const statsAbs = document.getElementById('statAbsorption');
    const statsType = document.getElementById('statType');
    
    if (statsBg) statsBg.textContent = `${this.materials[mat].bandgap.toFixed(2)} eV`;
    if (statsLat) statsLat.textContent = this.materials[mat].lattice;
    if (statsAbs) statsAbs.textContent = this.materials[mat].absorb;
    if (statsType) statsType.textContent = this.materials[mat].type.split(' ')[0];
    
    const animateSwitch = () => {
      const elapsed = Date.now() - startTime;
      this.animationProgress = Math.min(1, elapsed / duration);
      
      this.draw();
      
      if (this.animationProgress < 1) {
        requestAnimationFrame(animateSwitch);
      }
    };
    
    requestAnimationFrame(animateSwitch);
  }
  
  render() {
    this.draw();
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;
    
    const plotWidth = this.width - paddingLeft - paddingRight;
    const plotHeight = this.height - paddingTop - paddingBottom;
    
    // Draw Coordinate Box and Grid Lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(paddingLeft, paddingTop, plotWidth, plotHeight);
    
    // Symmetry vertical lines (High symmetry paths: L - Gamma - X - U)
    const symPoints = [
      { name: 'L', ratio: 0 },
      { name: 'Γ', ratio: 0.35 },
      { name: 'X', ratio: 0.7 },
      { name: 'U,K', ratio: 1.0 }
    ];
    
    symPoints.forEach(pt => {
      const x = paddingLeft + pt.ratio * plotWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, paddingTop);
      this.ctx.lineTo(x, paddingTop + plotHeight);
      this.ctx.stroke();
      
      // Labels on X axis
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.font = '10px var(--font-mono)';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(pt.name, x, paddingTop + plotHeight + 16);
    });
    
    // Draw Fermi Level dashed line (Energy = 0)
    const yCenter = paddingTop + plotHeight / 2;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(paddingLeft, yCenter);
    this.ctx.lineTo(paddingLeft + plotWidth, yCenter);
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset
    
    // Text for Fermi Level
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.font = '8px var(--font-mono)';
    this.ctx.textAlign = 'right';
    this.ctx.fillText('E_F', paddingLeft - 8, yCenter + 3);
    
    // Interpolate band properties between previous and current selection (smooth morph)
    const t = this.animationProgress;
    const currentMatData = this.materials[this.currentMaterial];
    const prevMatData = this.materials[this.prevMaterial];
    
    // Interpolate energy values
    const interpolate = (start, end) => start + (end - start) * t;
    
    // Drawing Conduction Bands (CB)
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowBlur = 4;
    
    const drawBand = (conduction, index) => {
      this.ctx.beginPath();
      
      const currBands = conduction ? currentMatData.conductionBands : currentMatData.valenceBands;
      const prevBands = conduction ? prevMatData.conductionBands : prevMatData.valenceBands;
      
      const currBand = currBands[index] || currBands[0];
      const prevBand = prevBands[index] || prevBands[0];
      
      // Interpolate offsets
      const startEnergy = interpolate(prevBand.start || prevBand.max, currBand.start || currBand.max);
      const centerEnergy = interpolate(prevBand.min || prevBand.max, currBand.min || currBand.max);
      const endEnergy = interpolate(prevBand.end, currBand.end);
      const symmetryOffset = interpolate(prevBand.symmetryOffset || 0, currBand.symmetryOffset || 0);
      
      this.ctx.strokeStyle = conduction ? currentMatData.colorConduction : currentMatData.colorValence;
      this.ctx.shadowColor = this.ctx.strokeStyle;
      
      // Generate band path across high symmetry points
      for (let sx = 0; sx <= plotWidth; sx++) {
        const normX = sx / plotWidth;
        const screenX = paddingLeft + sx;
        
        // Use multi-harmonic sine/parabolic curves to map band dispersion relation E(k)
        let energyValue = 0;
        
        if (normX <= 0.35) {
          // L -> Gamma
          const innerT = normX / 0.35;
          const delta = startEnergy - centerEnergy;
          energyValue = centerEnergy + delta * Math.pow(1 - innerT, 2);
        } else if (normX <= 0.7) {
          // Gamma -> X (Here indirect valleys might occur)
          const innerT = (normX - 0.35) / 0.35;
          // If symmetryOffset > 0, the minimum is shifted towards X (Indirect bandgap valley)
          const shiftedMinX = 0.35 + symmetryOffset;
          const deltaL = endEnergy - centerEnergy;
          
          if (symmetryOffset === 0) {
            energyValue = centerEnergy + deltaL * Math.pow(innerT, 2);
          } else {
            // Parabolic valley shifted
            const vertexT = symmetryOffset / 0.35;
            const b = -2 * vertexT;
            const c = 1;
            const scaledInner = innerT * innerT + b * innerT + c;
            energyValue = centerEnergy + (endEnergy - centerEnergy) * scaledInner * 0.5;
          }
        } else {
          // X -> U
          const innerT = (normX - 0.7) / 0.3;
          energyValue = endEnergy - (endEnergy - startEnergy * 1.1) * Math.sin(innerT * Math.PI / 2) * 0.4;
        }
        
        // Map Energy (eV) to Screen Y coordinates
        // Let's say energy range is -2.5 eV to +2.5 eV
        const yRange = 5.0; // eV
        const screenY = yCenter - (energyValue / yRange) * plotHeight;
        
        if (sx === 0) this.ctx.moveTo(screenX, screenY);
        else this.ctx.lineTo(screenX, screenY);
      }
      this.ctx.stroke();
    };
    
    // Draw Conduction Bands
    currentMatData.conductionBands.forEach((_, i) => drawBand(true, i));
    
    // Draw Valence Bands
    currentMatData.valenceBands.forEach((_, i) => drawBand(false, i));
    
    // Reset shadows
    this.ctx.shadowBlur = 0;
    
    // Draw Bandgap size label arrow
    const currentGap = interpolate(prevMatData.bandgap, currentMatData.bandgap);
    const cbMin = conductionMinEnergy(currentMatData);
    const vbMax = valenceMaxEnergy(currentMatData);
    const prevCbMin = conductionMinEnergy(prevMatData);
    const prevVbMax = valenceMaxEnergy(prevMatData);
    
    const midCb = interpolate(prevCbMin, cbMin);
    const midVb = interpolate(prevVbMax, vbMax);
    
    const yRange = 5.0;
    // Find x-coordinate of direct/indirect minimum
    const minShiftX = currentMatData.conductionBands[0].symmetryOffset || 0;
    const arrowX = paddingLeft + (0.35 + minShiftX) * plotWidth;
    const arrowY1 = yCenter - (midCb / yRange) * plotHeight;
    const arrowY2 = yCenter - (midVb / yRange) * plotHeight;
    
    // Draw the Arrow line representing Eg (bandgap)
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(arrowX, arrowY1);
    this.ctx.lineTo(arrowX, arrowY2);
    this.ctx.stroke();
    
    // Draw arrow heads
    this.ctx.fillStyle = '#fff';
    
    // Top arrow head
    this.ctx.beginPath();
    this.ctx.moveTo(arrowX, arrowY1);
    this.ctx.lineTo(arrowX - 4, arrowY1 + 6);
    this.ctx.lineTo(arrowX + 4, arrowY1 + 6);
    this.ctx.fill();
    
    // Bottom arrow head
    this.ctx.beginPath();
    this.ctx.moveTo(arrowX, arrowY2);
    this.ctx.lineTo(arrowX - 4, arrowY2 - 6);
    this.ctx.lineTo(arrowX + 4, arrowY2 - 6);
    this.ctx.fill();
    
    // Draw label "Eg = 1.58 eV" next to arrow
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '10px var(--font-mono)';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Eg = ${currentGap.toFixed(2)} eV`, arrowX + 8, (arrowY1 + arrowY2) / 2 + 3);
  }
}

// Helpers
function conductionMinEnergy(mat) {
  return Math.min(...mat.conductionBands.map(b => b.min));
}

function valenceMaxEnergy(mat) {
  return Math.max(...mat.valenceBands.map(b => b.max));
}

// Initialise Widget
document.addEventListener('DOMContentLoaded', () => {
  window.dftBandgapWidgetInstance = new DFTBandgapWidget();
});
