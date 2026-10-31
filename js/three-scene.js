/**
 * 3D Creation of Adam ASCII Hands Controller & Ambient Engine
 * Inspired by Anthracite Studio (Awwwards Nominee by Alexandre Huet)
 * 
 * Features:
 * 1. 3D Perspective Parallax Tilt on the authentic Creation of Adam ASCII Hands
 * 2. Real-time mouse tracking with inertial lerp (rotateX, rotateY, translate3d)
 * 3. Dynamic ambient floating ASCII data dust with depth attenuation
 * 4. Cursor proximity energy shimmer & particle field
 * 5. Smooth scroll fadeout past the hero section
 */

(function () {
  'use strict';

  const handsFrame = document.getElementById('hero-hands-frame');
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Screen Dimensions & DPR
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Mouse & Scroll State (with smooth inertial lerp)
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;
  let targetScrollY = 0;

  // Alphanumeric character pool for ambient code dust
  const CHAR_POOL = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%*+=-:.';

  // -------------------------------------------------------------------------
  // 1. AMBIENT ASCII DATA DUST PARTICLES
  // -------------------------------------------------------------------------
  const DUST_COUNT = 85;
  const dustParticles = [];

  for (let i = 0; i < DUST_COUNT; i++) {
    dustParticles.push({
      char: CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 80 + 20,
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      alpha: 0.12 + Math.random() * 0.28,
      size: 9 + Math.random() * 4,
      flicker: Math.random() * 100
    });
  }

  // Interactive Cursor Aura Particles
  const AURA_COUNT = 24;
  const auraParticles = [];
  for (let i = 0; i < AURA_COUNT; i++) {
    auraParticles.push({
      char: CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
      angle: Math.random() * Math.PI * 2,
      dist: 25 + Math.random() * 65,
      speed: (Math.random() - 0.5) * 1.5,
      alpha: 0.2 + Math.random() * 0.5
    });
  }

  // -------------------------------------------------------------------------
  // 2. RESIZE HANDLER & RETINA SCALING
  // -------------------------------------------------------------------------
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse Listener
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / width) - 0.5;
    mouse.targetY = (e.clientY / height) - 0.5;
  }, { passive: true });

  // Scroll Listener
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 3. MAIN ANIMATION & RENDERING LOOP
  // -------------------------------------------------------------------------
  let lastTime = performance.now();
  let time = 0;

  function render(now) {
    requestAnimationFrame(render);

    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    time += delta;

    // Smooth inertial lerp for 3D physics
    mouse.x += (mouse.targetX - mouse.x) * 0.07;
    mouse.y += (mouse.targetY - mouse.y) * 0.07;
    scrollY += (targetScrollY - scrollY) * 0.09;

    // -----------------------------------------------------------------------
    // A. 3D PERSPECTIVE PARALLAX TILT ON HANDS STAGE
    // -----------------------------------------------------------------------
    if (handsFrame) {
      // 3D Tilt angles based on mouse offset
      const rotY = (mouse.x * 14).toFixed(3);   // Tilt yaw
      const rotX = (-mouse.y * 9).toFixed(3);   // Tilt pitch
      const transX = (mouse.x * 28).toFixed(2);
      const transY = (mouse.y * 18).toFixed(2);

      handsFrame.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${transX}px, ${transY}px, 0)`;

      // Smooth opacity fadeout when scrolling down into content
      const fadeProgress = Math.min(Math.max((scrollY - 220) / 450, 0), 1);
      const handsAlpha = (1 - fadeProgress).toFixed(3);
      handsFrame.style.opacity = handsAlpha;
    }

    // -----------------------------------------------------------------------
    // B. RENDER AMBIENT ASCII CODE DUST ON CANVAS
    // -----------------------------------------------------------------------
    ctx.clearRect(0, 0, width, height);

    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Global fade with scroll
    const ambientAlpha = 1 - Math.min(Math.max((scrollY - 500) / 600, 0), 0.7);

    for (let i = 0; i < dustParticles.length; i++) {
      const p = dustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      // Occasional character glitch
      p.flicker -= delta * 60;
      if (p.flicker <= 0) {
        p.char = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
        p.flicker = 100 + Math.random() * 250;
      }

      // 3D Parallax offset based on depth (z)
      const depthRatio = p.z / 100;
      const px = p.x * width + (mouse.x * 35 * depthRatio);
      const py = p.y * height + (mouse.y * 30 * depthRatio);

      // Color based on depth: cobalt blue to soft sky blue
      const blueTone = depthRatio > 0.6 ? 'rgba(0, 68, 255,' : 'rgba(0, 41, 255,';
      ctx.fillStyle = `${blueTone} ${p.alpha * ambientAlpha})`;
      ctx.fillText(p.char, px, py);
    }

    // -----------------------------------------------------------------------
    // C. MOUSE PROXIMITY INTERACTIVE ENERGY SWIRL
    // -----------------------------------------------------------------------
    const cursorX = (mouse.x + 0.5) * width;
    const cursorY = (mouse.y + 0.5) * height;

    if (ambientAlpha > 0.1) {
      for (let i = 0; i < auraParticles.length; i++) {
        const ap = auraParticles[i];
        ap.angle += ap.speed * delta;
        const ax = cursorX + Math.cos(ap.angle) * ap.dist;
        const ay = cursorY + Math.sin(ap.angle) * ap.dist;

        ctx.fillStyle = `rgba(0, 240, 255, ${ap.alpha * 0.45 * ambientAlpha})`;
        ctx.fillText(ap.char, ax, ay);
      }
    }
  }

  requestAnimationFrame(render);
})();
