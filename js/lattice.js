/* 
   Md. Mohiuddin - Lattice & Particle Canvas Engine
   Custom lightweight, high-performance 3D canvas renderer
   Theme: Perovskite Crystal Lattice, Quantum Waves & ML Networks
*/

class QuantumLattice {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;
    
    // Mouse interaction
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    
    // Animation properties
    this.angleX = 0.5; // pitch
    this.angleY = 0.5; // yaw
    this.targetAngleX = 0.5;
    this.targetAngleY = 0.5;
    this.scrollRatio = 0;
    
    // Theme colors (Optimized for Light Backgrounds)
    this.colorCyan = '#0066cc'; // Cobalt Blue (DFT / Simulation)
    this.colorBlue = '#0071e3'; // Tech Blue
    this.colorTeal = '#008060'; // Deep Emerald (Perovskite / Synthesis)
    
    // Crystal Lattice (Perovskite ABX3 structure)
    this.latticeNodes = [];
    this.latticeBonds = [];
    this.initLattice();
    
    // Wave particles (Laser / Wave-Particle Duality)
    this.waveParticles = [];
    this.initWaves();
    
    // Neural Network/ML particles
    this.mlParticles = [];
    this.initMLGraph();
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('scroll', () => this.onScroll());
    
    this.animate();
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }
  
  onMouseMove(e) {
    // Normalise to -1 to 1
    this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
    this.mouse.targetY = (e.clientY / this.height) * 2 - 1;
    this.mouse.active = true;
  }
  
  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    
    // Control rotations based on scroll
    this.targetAngleY = 0.5 + this.scrollRatio * Math.PI * 2.5;
    this.targetAngleX = 0.5 + Math.sin(this.scrollRatio * Math.PI) * 0.8;
  }
  
  initLattice() {
    // A-site corners (e.g. Mg / Pb) - 8 corners of cube of size 1.5
    const size = 1.6;
    const corners = [
      { x: -size, y: -size, z: -size, type: 'A', name: 'Mg' },
      { x: size, y: -size, z: -size, type: 'A', name: 'Mg' },
      { x: size, y: size, z: -size, type: 'A', name: 'Mg' },
      { x: -size, y: size, z: -size, type: 'A', name: 'Mg' },
      { x: -size, y: -size, z: size, type: 'A', name: 'Mg' },
      { x: size, y: -size, z: size, type: 'A', name: 'Mg' },
      { x: size, y: size, z: size, type: 'A', name: 'Mg' },
      { x: -size, y: size, z: size, type: 'A', name: 'Mg' }
    ];
    
    // B-site center (e.g. Z = As, Sb, Bi) - 1 center
    const center = [
      { x: 0, y: 0, z: 0, type: 'B', name: 'Sb' }
    ];
    
    // X-site face centers (e.g. Br) - 6 faces
    const faces = [
      { x: 0, y: 0, z: -size, type: 'X', name: 'Br' },
      { x: 0, y: 0, z: size, type: 'X', name: 'Br' },
      { x: 0, y: -size, z: 0, type: 'X', name: 'Br' },
      { x: 0, y: size, z: 0, type: 'X', name: 'Br' },
      { x: -size, y: 0, z: 0, type: 'X', name: 'Br' },
      { x: size, y: 0, z: 0, type: 'X', name: 'Br' }
    ];
    
    this.latticeNodes = [...corners, ...center, ...faces];
    
    // Define chemical bonds
    // Connect corners to make outline cube
    const cubeEdges = [
      [0,1], [1,2], [2,3], [3,0], // back
      [4,5], [5,6], [6,7], [7,4], // front
      [0,4], [1,5], [2,6], [3,7]  // depths
    ];
    
    // Connect face-centers to B-site (octahedral coordination BX6)
    // Center is index 8 (since corners are 0-7)
    // Faces are index 9 to 14
    const octahedralBonds = [
      [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14]
    ];
    
    // Connect face-centers to each other to outline the octahedron
    const octaEdges = [
      [9, 11], [9, 12], [9, 13], [9, 14], // top face to sides
      [10, 11], [10, 12], [10, 13], [10, 14], // bottom face to sides
      [11, 13], [13, 12], [12, 14], [14, 11] // side ring
    ];
    
    this.latticeBonds = [...cubeEdges, ...octahedralBonds, ...octaEdges];
  }
  
  initWaves() {
    // Generate particles for the laser wave section
    const numPoints = 80;
    for (let i = 0; i < numPoints; i++) {
      this.waveParticles.push({
        x: (i / numPoints) * 2 - 1, // normalized -1 to 1
        y: 0,
        phase: i * 0.15,
        speed: 0.04
      });
    }
  }
  
  initMLGraph() {
    // Generates clusters representing machine learning weights and descriptors
    const nodesCount = 35;
    for (let i = 0; i < nodesCount; i++) {
      this.mlParticles.push({
        x: (Math.random() * 2 - 1) * 1.8,
        y: (Math.random() * 2 - 1) * 1.8,
        z: (Math.random() * 2 - 1) * 1.8,
        vx: (Math.random() - 0.5) * 0.005,
        vy: (Math.random() - 0.5) * 0.005,
        vz: (Math.random() - 0.5) * 0.005,
        size: Math.random() * 2 + 1
      });
    }
  }
  
  // 3D projections
  project3D(x, y, z, scale, translation) {
    // 3D rotation around Y axis (yaw)
    let cosY = Math.cos(this.angleY);
    let sinY = Math.sin(this.angleY);
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;
    
    // 3D rotation around X axis (pitch)
    let cosX = Math.cos(this.angleX);
    let sinX = Math.sin(this.angleX);
    let y2 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;
    
    // Perspective division
    const d = 5; // distance of camera
    const perspective = d / (d + z2);
    
    return {
      x: this.width / 2 + x1 * scale * perspective + translation.x,
      y: this.height / 2 + y2 * scale * perspective + translation.y,
      zDepth: z2,
      visible: z2 > -d
    };
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Lerp mouse and scroll values for ultra-smooth animations (Apple effect)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;
    
    this.angleX += (this.targetAngleX - this.angleX + this.mouse.y * 0.15) * 0.05;
    this.angleY += (this.targetAngleY - this.angleY + this.mouse.x * 0.15) * 0.05;
    
    // Determine the scroll stage
    // Stage 0: 0% - 25% (Hero Lattice)
    // Stage 1: 25% - 50% (Quantum Wave Packets)
    // Stage 2: 50% - 75% (ML descriptor mesh)
    // Stage 3: 75% - 100% (Subtle stellar space)
    
    if (this.scrollRatio < 0.35) {
      this.drawLatticeSection();
    } else if (this.scrollRatio >= 0.35 && this.scrollRatio < 0.65) {
      this.drawLaserWaveSection();
    } else {
      this.drawMLGraphSection();
    }
  }
  
  drawLatticeSection() {
    // Fade out lattice as scroll increases past 20%
    const opacity = this.scrollRatio < 0.15 ? 1 : Math.max(0, 1 - (this.scrollRatio - 0.15) * 5);
    if (opacity <= 0) return;
    
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    
    // Scale and position lattice
    // Zoom in slightly on scroll
    const scale = Math.min(this.width, this.height) * (0.16 + this.scrollRatio * 0.12);
    
    // Desktop shifts right, mobile stays centered
    const targetShiftX = this.width > 768 ? (this.width * 0.18 + this.scrollRatio * 150) : 0;
    const translation = { x: targetShiftX, y: -this.scrollRatio * 100 };
    
    // Project all nodes
    const projected = this.latticeNodes.map(node => {
      const proj = this.project3D(node.x, node.y, node.z, scale, translation);
      return { ...proj, type: node.type, name: node.name };
    });
    
    // Draw Bonds
    this.latticeBonds.forEach(bond => {
      const p1 = projected[bond[0]];
      const p2 = projected[bond[1]];
      
      if (p1.visible && p2.visible) {
        // Opacity depends on depth
        const avgDepth = (p1.zDepth + p2.zDepth) / 2;
        const depthOpacity = Math.max(0.1, 1 - (avgDepth + 1.5) / 3);
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        
        // Gradient bonds or colored bonds
        let gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        const col1 = p1.type === 'B' ? this.colorCyan : (p1.type === 'A' ? this.colorBlue : this.colorTeal);
        const col2 = p2.type === 'B' ? this.colorCyan : (p2.type === 'A' ? this.colorBlue : this.colorTeal);
        
        gradient.addColorStop(0, col1);
        gradient.addColorStop(1, col2);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = (p1.type === 'B' || p2.type === 'B') ? 1.5 : 0.8;
        this.ctx.globalAlpha = depthOpacity * opacity * 0.5;
        this.ctx.stroke();
      }
    });
    
    // Draw Atomic Nuclei (Nodes)
    projected.forEach(node => {
      if (node.visible) {
        const depthOpacity = Math.max(0.2, 1 - (node.zDepth + 1.5) / 3);
        this.ctx.globalAlpha = depthOpacity * opacity;
        
        let radius = 6;
        let color = this.colorBlue;
        
        if (node.type === 'B') {
          radius = 12;
          color = this.colorCyan;
        } else if (node.type === 'X') {
          radius = 8;
          color = this.colorTeal;
        }
        
        // Glow effect
        this.ctx.shadowBlur = radius * 2;
        this.ctx.shadowColor = color;
        
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        let grad = this.ctx.createRadialGradient(node.x - radius/3, node.y - radius/3, radius * 0.1, node.x, node.y, radius);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, color);
        grad.addColorStop(1, '#050510');
        
        this.ctx.fillStyle = grad;
        this.ctx.fill();
        
        // Labelling nodes when close-up
        if (this.scrollRatio < 0.1) {
          this.ctx.shadowBlur = 0;
          this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
          this.ctx.font = `9px ${this.colorCyan === color ? 'var(--font-mono)' : 'sans-serif'}`;
          this.ctx.fillText(node.name, node.x + radius + 4, node.y + 3);
        }
      }
    });
    
    this.ctx.restore();
  }
  
  drawLaserWaveSection() {
    // Fade in as we scroll into the middle section
    const startScroll = 0.3;
    const endScroll = 0.7;
    let opacity = 0;
    
    if (this.scrollRatio > startScroll && this.scrollRatio < endScroll) {
      if (this.scrollRatio < 0.45) {
        opacity = (this.scrollRatio - startScroll) / 0.15; // fade in
      } else if (this.scrollRatio > 0.55) {
        opacity = 1 - (this.scrollRatio - 0.55) / 0.15; // fade out
      } else {
        opacity = 1;
      }
    }
    
    if (opacity <= 0) return;
    
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    
    const amplitude = 80;
    const waveLength = 0.015;
    const shiftY = this.height * 0.55;
    const shiftX = this.width * 0.2;
    const widthWave = this.width > 768 ? this.width * 0.6 : this.width * 0.8;
    
    // Draw wave envelopes representing laser pulses or quantum wave packets
    this.ctx.strokeStyle = this.colorCyan;
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.colorCyan;
    
    // Draw laser beam guide path
    this.ctx.beginPath();
    for (let x = 0; x < widthWave; x++) {
      const normX = x / widthWave;
      // Gaussian envelope for wave packet
      const envelope = Math.exp(-Math.pow((normX - 0.5) * 3.5, 2));
      // Quantum superpositions: multiple wave components
      const sineVal1 = Math.sin(x * waveLength - Date.now() * 0.006);
      const sineVal2 = Math.cos(x * (waveLength * 1.5) - Date.now() * 0.003) * 0.4;
      
      const y = (sineVal1 + sineVal2) * amplitude * envelope;
      
      const screenX = shiftX + x;
      const screenY = shiftY + y;
      
      if (x === 0) this.ctx.moveTo(screenX, screenY);
      else this.ctx.lineTo(screenX, screenY);
    }
    this.ctx.stroke();
    
    // Draw a secondary harmonical wave (representing quantum probability density |psi|^2)
    this.ctx.shadowColor = this.colorTeal;
    this.ctx.strokeStyle = 'rgba(0, 255, 135, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let x = 0; x < widthWave; x++) {
      const normX = x / widthWave;
      const envelope = Math.exp(-Math.pow((normX - 0.5) * 3.5, 2));
      const psiSq = Math.pow(Math.sin(x * waveLength - Date.now() * 0.006), 2) * amplitude * 1.1 * envelope;
      
      const screenX = shiftX + x;
      const screenY = shiftY + amplitude * 0.8 * envelope - psiSq;
      
      if (x === 0) this.ctx.moveTo(screenX, screenY);
      else this.ctx.lineTo(screenX, screenY);
    }
    this.ctx.stroke();
    
    // Floating quantum particles orbiting the laser pulse
    this.waveParticles.forEach(p => {
      p.phase += p.speed;
      const normX = (p.x + 1) / 2; // 0 to 1
      const envelope = Math.exp(-Math.pow((normX - 0.5) * 3.5, 2));
      
      const y = Math.sin(normX * widthWave * waveLength - Date.now() * 0.006 + p.phase) * amplitude * envelope;
      // Orbiting around the envelope
      const dy = Math.sin(p.phase * 3) * 12;
      const dx = Math.cos(p.phase * 3) * 12;
      
      const px = shiftX + normX * widthWave + dx;
      const py = shiftY + y + dy;
      
      this.ctx.beginPath();
      this.ctx.arc(px, py, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colorTeal;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = this.colorTeal;
      this.ctx.fill();
    });
    
    this.ctx.restore();
  }
  
  drawMLGraphSection() {
    // Fade in from 60% scroll onwards
    const opacity = this.scrollRatio < 0.6 ? 0 : Math.min(1, (this.scrollRatio - 0.6) * 4.5);
    if (opacity <= 0) return;
    
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    
    const scale = Math.min(this.width, this.height) * 0.18;
    const targetShiftX = this.width > 768 ? -(this.width * 0.2) : 0;
    const translation = { x: targetShiftX, y: 0 };
    
    // Project neural network nodes
    const projected = this.mlParticles.map(p => {
      // Drift nodes slightly
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      
      // Boundary check
      if (Math.abs(p.x) > 2) p.vx *= -1;
      if (Math.abs(p.y) > 2) p.vy *= -1;
      if (Math.abs(p.z) > 2) p.vz *= -1;
      
      const proj = this.project3D(p.x, p.y, p.z, scale, translation);
      return { ...proj, size: p.size };
    });
    
    // Draw web connections
    this.ctx.strokeStyle = this.colorBlue;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const p1 = projected[i];
        const p2 = projected[j];
        
        if (p1.visible && p2.visible) {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const maxConnDist = this.width > 768 ? 100 : 70;
          if (dist < maxConnDist) {
            const depthOpacity = Math.max(0.1, 1 - (p1.zDepth + p2.zDepth + 4) / 8);
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.lineWidth = (1 - dist / maxConnDist) * 0.6;
            this.ctx.strokeStyle = `rgba(79, 172, 254, ${(1 - dist / maxConnDist) * depthOpacity * opacity * 0.35})`;
            this.ctx.stroke();
          }
        }
      }
    }
    
    // Draw nodes
    projected.forEach(node => {
      if (node.visible) {
        const depthOpacity = Math.max(0.2, 1 - (node.zDepth + 2) / 4);
        this.ctx.globalAlpha = depthOpacity * opacity;
        
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.size + 1.5, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colorBlue;
        this.ctx.shadowBlur = node.size * 2;
        this.ctx.shadowColor = this.colorBlue;
        this.ctx.fill();
      }
    });
    
    this.ctx.restore();
  }
}

// Initialise on load
document.addEventListener('DOMContentLoaded', () => {
  window.quantumLatticeInstance = new QuantumLattice('canvas3d');
});
