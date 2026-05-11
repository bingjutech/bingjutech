/* ============================================================
   Main JavaScript
   Suzhou Bingju Network Technology Co., Ltd
   ============================================================ */

(function () {
  'use strict';

  /* ── Page Loader ──────────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 400);
      }, 300);
    }
  });

  /* ── Navigation ───────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.add('nav--transparent');
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  (function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const hrefFile = href.split('/').pop();
      if (
        hrefFile === path ||
        (path === '' && hrefFile === 'index.html') ||
        (path === 'index.html' && hrefFile === 'index.html')
      ) {
        link.classList.add('active');
      }
    });
  })();

  /* ── Cursor Glow (desktop only) ───────────────────────────── */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    let raf;
    let mx = 0, my = 0, cx = 0, cy = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    function animateCursor() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top  = cy + 'px';
      raf = requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }

  /* ── Scroll Reveal (Intersection Observer) ────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger, [data-scroll]'
  ).forEach(el => {
    revealObserver.observe(el);
    if (el.hasAttribute('data-scroll')) {
      const type = el.getAttribute('data-scroll');
      el.classList.add(type === 'fade-up' || type === 'fade-left' || type === 'fade-right' || type === 'zoom-in' ? '' : '');
    }
  });

  // data-scroll observer
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // add delay if set
        const delay = entry.target.dataset.delay;
        if (delay) entry.target.style.transitionDelay = delay + 'ms';
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-scroll]').forEach(el => scrollObserver.observe(el));

  /* ── Stagger Observer ─────────────────────────────────────── */
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.stagger').forEach(el => staggerObserver.observe(el));

  /* ── Counter Animation ────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration || '2000', 10);
    const start = performance.now();

    function ease(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(ease(progress) * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── Accordion ────────────────────────────────────────────── */
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const body = item.querySelector('.accordion__body');
      const isOpen = item.classList.contains('open');

      // Close siblings
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion__item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion__body').style.maxHeight = '0';
          }
        });
      }

      item.classList.toggle('open', !isOpen);
      body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
    });
  });

  /* ── Tabs ─────────────────────────────────────────────────── */
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tab__btn');
    const panes   = tabs.querySelectorAll('.tab__pane');

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panes[i]) panes[i].classList.add('active');
      });
    });
  });

  /* ── Parallax on hero bg ──────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxEls.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.3;
            const rect  = el.getBoundingClientRect();
            const offset = rect.top * speed;
            el.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 3D Tilt Cards ────────────────────────────────────────── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
    });
  });

  /* ── Contact Form ─────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate submission (replace with actual endpoint)
      setTimeout(() => {
        showFormMessage(contactForm, 'success', 'Thank you! Your message has been sent. We\'ll respond within 24 hours.');
        contactForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }

  function showFormMessage(form, type, message) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-message';
      form.appendChild(msg);
    }
    msg.textContent = message;
    msg.style.cssText = `
      padding: 1rem 1.25rem;
      border-radius: 6px;
      font-size: 0.9rem;
      margin-top: 1rem;
      background: ${type === 'success' ? 'rgba(200,169,110,0.1)' : 'rgba(220,50,50,0.1)'};
      border: 1px solid ${type === 'success' ? 'rgba(200,169,110,0.4)' : 'rgba(220,50,50,0.4)'};
      color: ${type === 'success' ? '#c8a96e' : '#e06060'};
    `;
    setTimeout(() => { if (msg) msg.remove(); }, 6000);
  }

  /* ── Smooth anchor scroll ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Page transition effect ───────────────────────────────── */
  const transition = document.getElementById('page-transition');
  if (transition) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('http') &&
        !a.hasAttribute('target')
      ) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          const dest = this.href;
          transition.classList.add('active');
          setTimeout(() => { window.location.href = dest; }, 350);
        });
      }
    });

    window.addEventListener('pageshow', () => {
      transition.classList.remove('active');
    });
  }

  /* ── Marquee duplicate for seamless loop ──────────────────── */
  document.querySelectorAll('.marquee-inner').forEach(inner => {
    const clone = inner.cloneNode(true);
    inner.parentElement.appendChild(clone);
  });

  /* ── News filter tabs ─────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('[data-category]').forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.classList.add('reveal');
            setTimeout(() => card.classList.add('visible'), 50);
          } else {
            card.style.display = 'none';
            card.classList.remove('visible');
          }
        });
      });
    });
  }

  /* ── Back to top ──────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'all' : 'none';
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
