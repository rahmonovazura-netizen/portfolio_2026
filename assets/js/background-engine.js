/**
 * BACKGROUND ANIMATION ENGINE & MATCHED ELEMENTS CONTROLLER
 * Modes:
 * 1. neural-mesh: Interactive constellation particle web + cosmic orbital nodes
 * 2. cyber-matrix: 3D perspective cyber grid + digital code streams + cyber HUD
 * 3. aurora-liquid: Mesmerizing chromatic fluid waves + frosted glass prisms
 */

class BackgroundEngine {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.elementsContainer = document.getElementById('matched-elements-layer');
    
    this.modes = ['neural-mesh', 'cyber-matrix', 'aurora-liquid'];
    this.currentMode = localStorage.getItem('portfolio_bg_mode') || 'neural-mesh';
    
    this.width = 0;
    this.height = 0;
    this.animationFrameId = null;
    this.time = 0;

    // Mouse coordinates
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false
    };

    // Mode specific state
    this.particles = [];
    this.matrixDrops = [];
    this.auroraOrbs = [];

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isHovered = true;

      const cursorGlow = document.getElementById('cursor-glow');
      if (cursorGlow) {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      }
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.isHovered = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.setMode(this.currentMode);
    this.animate();
    this.setupUIControls();
  }

  handleResize() {
    this.width = document.documentElement.clientWidth || window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Re-init mode objects on screen resize
    if (this.currentMode === 'neural-mesh') this.initNeuralMesh();
    else if (this.currentMode === 'cyber-matrix') this.initCyberMatrix();
    else if (this.currentMode === 'aurora-liquid') this.initAuroraLiquid();
  }

  setMode(mode) {
    if (!this.modes.includes(mode)) mode = 'neural-mesh';
    this.currentMode = mode;
    localStorage.setItem('portfolio_bg_mode', mode);

    // Update body theme class
    document.body.classList.remove('theme-neural-mesh', 'theme-cyber-matrix', 'theme-aurora-liquid');
    document.body.classList.add(`theme-${mode}`);

    // Update switcher buttons UI
    document.querySelectorAll('.bg-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Populate mode-specific matching DOM elements
    this.renderMatchedDOMElements(mode);

    // Initialize canvas state
    if (mode === 'neural-mesh') this.initNeuralMesh();
    else if (mode === 'cyber-matrix') this.initCyberMatrix();
    else if (mode === 'aurora-liquid') this.initAuroraLiquid();

    if (window.AudioSynth) {
      window.AudioSynth.playTone(440, 0.08, 'sine');
    }
  }

  /* ===================================================
     MODE 1: NEURAL MESH & COSMIC CONSTELLATION
     =================================================== */
  initNeuralMesh() {
    this.particles = [];
    const count = Math.min(Math.floor((this.width * this.height) / 12000), 100);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  renderNeuralMesh() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Deep cosmic space background tint
    const grad = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.width * 0.7);
    grad.addColorStop(0, '#0c1022');
    grad.addColorStop(1, '#060810');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    const maxDist = 130;
    const pCount = this.particles.length;

    // Connect particles
    for (let i = 0; i < pCount; i++) {
      const p1 = this.particles[i];

      // Move
      p1.x += p1.vx;
      p1.y += p1.vy;

      if (p1.x < 0 || p1.x > this.width) p1.vx *= -1;
      if (p1.y < 0 || p1.y > this.height) p1.vy *= -1;

      // Mouse attraction
      if (this.mouse.isHovered) {
        const mdx = this.mouse.x - p1.x;
        const mdy = this.mouse.y - p1.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 160) {
          p1.x += (mdx / mDist) * 0.7;
          p1.y += (mdy / mDist) * 0.7;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(this.mouse.x, this.mouse.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - mDist / 160) * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw particle
      const alpha = p1.baseAlpha + Math.sin(this.time * p1.pulseSpeed + p1.pulseOffset) * 0.2;
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(165, 180, 252, ${Math.max(0.1, alpha)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#6366f1';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect to neighbors
      for (let j = i + 1; j < pCount; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  /* ===================================================
     MODE 2: CYBER MATRIX & PERSPECTIVE GRID
     =================================================== */
  initCyberMatrix() {
    this.matrixDrops = [];
    const fontSize = 16;
    const columns = Math.floor(this.width / fontSize);
    const chars = '01010101XYZΩλπΣ#&@µ{}[]<>=+*⚡◈';
    
    for (let i = 0; i < columns; i++) {
      this.matrixDrops.push({
        x: i * fontSize,
        y: Math.random() * -this.height,
        speed: Math.random() * 3 + 2,
        length: Math.floor(Math.random() * 14 + 6),
        charList: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)])
      });
    }
  }

  renderCyberMatrix() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(5, 10, 8, 0.25)';
    ctx.fillRect(0, 0, this.width, this.height);

    // 1. Perspective Grid at Bottom
    ctx.save();
    const horizon = this.height * 0.48;
    const vanishX = this.width / 2 + (this.mouse.isHovered ? (this.mouse.x - this.width / 2) * 0.08 : 0);
    
    // Draw horizon line
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(this.width, horizon);
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffcc';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Moving horizontal grid lines
    const gridSpeed = (this.time * 2.5) % 40;
    for (let y = horizon; y < this.height; y += Math.pow((y - horizon + 10) / 10, 1.35)) {
      const actualY = y + gridSpeed * ((y - horizon) / (this.height - horizon));
      if (actualY <= this.height) {
        ctx.beginPath();
        ctx.moveTo(0, actualY);
        ctx.lineTo(this.width, actualY);
        ctx.strokeStyle = `rgba(16, 185, 129, ${Math.min(0.35, (actualY - horizon) / (this.height - horizon) * 0.4)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Perspective vertical fan lines
    const lineCount = 24;
    for (let i = 0; i <= lineCount; i++) {
      const bottomX = (this.width / lineCount) * i;
      ctx.beginPath();
      ctx.moveTo(vanishX, horizon);
      ctx.lineTo(bottomX, this.height);
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Matrix Digital Rain Streams
    ctx.font = '13px monospace';
    this.matrixDrops.forEach(drop => {
      drop.y += drop.speed;
      if (drop.y > this.height + drop.length * 16) {
        drop.y = Math.random() * -120;
        drop.speed = Math.random() * 3.5 + 2;
      }

      for (let j = 0; j < drop.length; j++) {
        const charY = drop.y - j * 16;
        if (charY > 0 && charY < this.height) {
          const char = drop.charList[j % drop.charList.length];
          if (j === 0) {
            ctx.fillStyle = '#ffffff'; // Head of the drop
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffcc';
          } else {
            const alpha = 1 - j / drop.length;
            ctx.fillStyle = `rgba(0, 255, 204, ${alpha * 0.75})`;
            ctx.shadowBlur = 0;
          }
          ctx.fillText(char, drop.x, charY);
        }
      }
    });
    ctx.shadowBlur = 0;
  }

  /* ===================================================
     MODE 3: AURORA LIQUID WAVES & GRADIENT BLOBS
     =================================================== */
  initAuroraLiquid() {
    this.auroraOrbs = [
      { x: this.width * 0.25, y: this.height * 0.35, r: 240, vx: 0.6, vy: 0.4, color: 'rgba(236, 72, 153, 0.28)' },
      { x: this.width * 0.75, y: this.height * 0.4, r: 280, vx: -0.5, vy: 0.7, color: 'rgba(139, 92, 246, 0.32)' },
      { x: this.width * 0.5, y: this.height * 0.7, r: 220, vx: 0.4, vy: -0.5, color: 'rgba(6, 182, 212, 0.26)' }
    ];
  }

  renderAuroraLiquid() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Deep cosmic magenta-slate background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#0c0716');
    bgGrad.addColorStop(0.5, '#130e24');
    bgGrad.addColorStop(1, '#07050e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Floating morphing liquid circles
    this.auroraOrbs.forEach(orb => {
      orb.x += orb.vx;
      orb.y += orb.vy;

      if (orb.x < orb.r * 0.5 || orb.x > this.width - orb.r * 0.5) orb.vx *= -1;
      if (orb.y < orb.r * 0.5 || orb.y > this.height - orb.r * 0.5) orb.vy *= -1;

      // Mouse repulsion
      if (this.mouse.isHovered) {
        const dx = orb.x - this.mouse.x;
        const dy = orb.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 260) {
          orb.x += (dx / dist) * 2;
          orb.y += (dy / dist) * 2;
        }
      }

      const radGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
      radGrad.addColorStop(0, orb.color);
      radGrad.addColorStop(0.6, orb.color.replace(/[\d\.]+\)$/, '0.1)'));
      radGrad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sinusoidal aurora liquid wave curtains
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      const waveHeight = 60 + layer * 25;
      const baseAlpha = 0.14 - layer * 0.03;
      
      const waveGrad = ctx.createLinearGradient(0, 0, this.width, 0);
      if (layer === 0) {
        waveGrad.addColorStop(0, `rgba(236, 72, 153, ${baseAlpha})`);
        waveGrad.addColorStop(0.5, `rgba(139, 92, 246, ${baseAlpha * 1.5})`);
        waveGrad.addColorStop(1, `rgba(6, 182, 212, ${baseAlpha})`);
      } else {
        waveGrad.addColorStop(0, `rgba(99, 102, 241, ${baseAlpha})`);
        waveGrad.addColorStop(1, `rgba(244, 114, 182, ${baseAlpha})`);
      }

      ctx.fillStyle = waveGrad;
      ctx.moveTo(0, this.height);
      
      for (let x = 0; x <= this.width; x += 15) {
        const y = this.height * (0.68 - layer * 0.12) +
          Math.sin(x * 0.003 + this.time * 0.02 + layer * 1.5) * waveHeight +
          Math.cos(x * 0.007 - this.time * 0.015) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(this.width, this.height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /* ===================================================
     RENDER MATCHED DOM ELEMENTS PER ACTIVE BACKGROUND
     =================================================== */
  renderMatchedDOMElements(mode) {
    if (!this.elementsContainer) return;
    this.elementsContainer.innerHTML = '';

    if (mode === 'neural-mesh') {
      // 1. Orbital Rings & Neural Chips
      this.elementsContainer.innerHTML = `
        <div class="neural-node-ring" style="width: 480px; height: 480px; top: 12%; right: 6%;"></div>
        <div class="neural-node-ring" style="width: 260px; height: 260px; bottom: 18%; left: 8%; animation-direction: reverse; animation-duration: 22s;"></div>
        
        <div class="neural-data-chip" style="top: 22%; left: 12%; animation-delay: 0s;">
          <span class="neural-pulse-dot"></span> NEURAL_NODE_01: ONLINE
        </div>
        <div class="neural-data-chip" style="bottom: 30%; right: 14%; animation-delay: 2s;">
          <span class="neural-pulse-dot"></span> SYNAPSE_LATENCY: 0.12ms
        </div>
        <div class="neural-data-chip" style="top: 72%; left: 18%; animation-delay: 4s;">
          <span class="neural-pulse-dot"></span> QUANTUM_LINK: ACTIVE
        </div>
      `;
    } else if (mode === 'cyber-matrix') {
      // 2. Cyber HUD Brackets & Reticles
      this.elementsContainer.innerHTML = `
        <div class="cyber-scanline"></div>
        <div class="cyber-reticle" style="top: 25%; right: 15%;"></div>
        <div class="cyber-reticle" style="bottom: 22%; left: 10%; width: 110px; height: 110px; animation-duration: 18s;"></div>
        
        <div class="cyber-hud-badge" style="top: 18%; left: 14%; animation-delay: 0s;">
          [SYS_PROTOCOL: CYBER_GRID_v3]
        </div>
        <div class="cyber-hud-badge" style="bottom: 28%; right: 12%; animation-delay: 1.5s;">
          [SECURITY: 256-BIT_ENCRYPTED]
        </div>
        <div class="cyber-hud-badge" style="top: 68%; right: 8%; animation-delay: 3s;">
          [FIREWALL_STATE: 100%_OPTIMAL]
        </div>
      `;
    } else if (mode === 'aurora-liquid') {
      // 3. Frosted Prisms & Liquid Orbs
      this.elementsContainer.innerHTML = `
        <div class="aurora-liquid-orb" style="width: 400px; height: 400px; top: 15%; right: 10%; background: radial-gradient(circle, #ec4899, #8b5cf6);"></div>
        <div class="aurora-liquid-orb" style="width: 350px; height: 350px; bottom: 15%; left: 5%; background: radial-gradient(circle, #06b6d4, #6366f1); animation-delay: 3s;"></div>
        
        <div class="aurora-glass-prism" style="width: 140px; height: 140px; top: 28%; left: 16%;"></div>
        <div class="aurora-glass-prism" style="width: 180px; height: 180px; bottom: 24%; right: 18%; animation-delay: 2.5s; transform: rotate(-20deg);"></div>
        
        <div class="aurora-crystal-tag" style="top: 20%; right: 22%; animation-delay: 1s;">
          ✨ CHROMATIC_AURA: 432Hz
        </div>
        <div class="aurora-crystal-tag" style="bottom: 35%; left: 20%; animation-delay: 3.5s;">
          💎 PRISMATIC_HARMONY
        </div>
      `;
    }
  }

  setupUIControls() {
    const trigger = document.getElementById('dock-trigger');
    const switcherCard = document.getElementById('bg-switcher-dock');
    
    if (trigger && switcherCard) {
      trigger.addEventListener('click', () => {
        switcherCard.classList.toggle('active');
        if (window.AudioSynth) window.AudioSynth.playTone(580, 0.05, 'triangle');
      });

      // Close on clicking outside
      document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !switcherCard.contains(e.target)) {
          switcherCard.classList.remove('active');
        }
      });
    }

    // Switch buttons
    document.querySelectorAll('.bg-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mode = btn.dataset.mode;
        this.setMode(mode);
        if (window.showToast) {
          const names = {
            'neural-mesh': '🌌 Neyron Tarmoq & Kosmik Fon',
            'cyber-matrix': '⚡ Kiberpank & Matritsa Fon',
            'aurora-liquid': '🌊 Aura & Suyuq Gradient Fon'
          };
          window.showToast(`${names[mode] || mode} faollashtirildi!`);
        }
      });
    });
  }

  animate() {
    this.time += 1;
    if (this.currentMode === 'neural-mesh') {
      this.renderNeuralMesh();
    } else if (this.currentMode === 'cyber-matrix') {
      this.renderCyberMatrix();
    } else if (this.currentMode === 'aurora-liquid') {
      this.renderAuroraLiquid();
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Instantiate engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.bgEngine = new BackgroundEngine();
});
