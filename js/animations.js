/* ============================================================
   Animations JavaScript
   Suzhou Bingju Network Technology Co., Ltd
   ============================================================ */

(function () {
  'use strict';

  /* ── Particle Canvas (Hero) ───────────────────────────────── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 200 + 100;
    };

    Particle.prototype.update = function () {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life += 1;
      if (this.life > this.maxLife || this.y < 0) this.reset();
    };

    Particle.prototype.draw = function () {
      const prog = this.life / this.maxLife;
      const a = this.alpha * (1 - prog * prog);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${a})`;
      ctx.fill();
    };

    // Create particles
    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.life = Math.random() * p.maxLife; // stagger start
      particles.push(p);
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }

    loop();
  }

  /* ── Typing Effect ────────────────────────────────────────── */
  document.querySelectorAll('[data-typing]').forEach(el => {
    const phrases = JSON.parse(el.dataset.typing || '[]');
    if (!phrases.length) return;

    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    let paused    = false;

    function tick() {
      const phrase = phrases[phraseIdx];

      if (paused) {
        paused = false;
        setTimeout(tick, deleting ? 60 : 1800);
        return;
      }

      if (!deleting) {
        el.textContent = phrase.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === phrase.length) {
          deleting = true;
          paused   = true;
        }
      } else {
        el.textContent = phrase.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting  = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          paused    = true;
        }
      }

      setTimeout(tick, deleting ? 50 : 90);
    }

    tick();
  });

  /* ── SVG Path Draw on scroll ─────────────────────────────── */
  const svgDrawObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        svgDrawObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.svg-draw').forEach(el => svgDrawObserver.observe(el));

  /* ── Hero Parallax ────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }, { passive: true });
  }

  /* ── Number ticker ────────────────────────────────────────── */
  function ticker(el, from, to, duration, suffix) {
    const start = performance.now();
    const range = to - from;

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + range * ease).toLocaleString() + (suffix || '');
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const to      = parseInt(el.dataset.target, 10);
        const suffix  = el.dataset.suffix || '';
        const dur     = parseInt(el.dataset.duration || '2000', 10);
        ticker(el, 0, to, dur, suffix);
        entry.target.closest('.stat-item__number')?.classList.add('counting');
        this.unobserve(el);
      }
    });
  }, { threshold: 0.6 }).observe;

  /* ── Horizontal scroll section ────────────────────────────── */
  document.querySelectorAll('.h-scroll-track').forEach(track => {
    let isDown  = false;
    let startX;
    let scrollL;

    track.addEventListener('mousedown', e => {
      isDown  = true;
      track.style.cursor = 'grabbing';
      startX  = e.pageX - track.offsetLeft;
      scrollL = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup',    () => { isDown = false; track.style.cursor = 'grab'; });

    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollL - walk;
    });
  });

  /* ── Magnetic buttons ─────────────────────────────────────── */
  document.querySelectorAll('.btn--magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2)  * 0.35;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── Scroll progress bar ──────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total  = document.documentElement.scrollHeight - window.innerHeight;
      const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Animate service card numbers ─────────────────────────── */
  document.querySelectorAll('.service-card__number').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  /* ── Hover ripple effect ──────────────────────────────────── */
  document.querySelectorAll('.btn--primary, .btn--outline').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left  - size / 2;
      const y      = e.clientY - rect.top   - size / 2;

      ripple.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${x}px;top:${y}px;
        border-radius:50%;
        background:rgba(255,255,255,0.12);
        transform:scale(0);
        animation:rippleAnim 0.6s ease forwards;
        pointer-events:none;
      `;

      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = '@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}';
        document.head.appendChild(style);
      }

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ── Image lazy loading ───────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  /* ── Section background animated gradient ─────────────────── */
  document.querySelectorAll('.animated-bg').forEach(el => {
    el.style.background = 'linear-gradient(270deg, #0d0d0d, #1a1410, #0d0d0d)';
    el.style.backgroundSize = '400% 400%';
    el.style.animation = 'bgDrift 10s ease infinite';
  });

})();
