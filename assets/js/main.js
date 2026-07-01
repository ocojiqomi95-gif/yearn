/**
 * Yearn Finance — Main JavaScript
 * Handles: navbar scroll, mobile menu, dropdowns, FAQ accordion, animations
 */

(function () {
  'use strict';

  /* =====================
     NAVBAR
     ===================== */
  const navbar  = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll state
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger && hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Desktop dropdown — keyboard accessibility
  document.querySelectorAll('.nav-item').forEach(function (item) {
    const link = item.querySelector('.nav-link');
    if (!link) return;
    link.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
    // Close on Escape
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') item.classList.remove('open');
    });
    // Close when focus leaves
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) item.classList.remove('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.open').forEach(function (item) {
        item.classList.remove('open');
      });
    }
  });

  // Highlight active page in nav
  (function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[href], .mobile-nav-link[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const hrefPage = href.split('/').pop();
      if (hrefPage === currentPath || (currentPath === '' && hrefPage === 'index.html')) {
        link.classList.add('active');
        // Also mark parent nav-item
        const parent = link.closest('.nav-item');
        if (parent) parent.classList.add('active');
      }
    });
  })();

  /* =====================
     FAQ ACCORDION
     ===================== */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      if (!item) return;

      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        const answer = openItem.querySelector('.faq-answer-inner');
        if (answer) answer.style.paddingTop = '';
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* =====================
     SCROLL REVEAL
     ===================== */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .reveal.revealed { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .vault-card, .product-card, .resource-card, .contact-social-card, .stat-card, .feature-card').forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* =====================
     SMOOTH SCROLL for anchor links
     ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =====================
     TOAST HELPER (global)
     ===================== */
  window.showToast = function (message, emoji) {
    emoji = emoji || '✓';
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span>' + emoji + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  };

  /* =====================
     COUNTER ANIMATION
     ===================== */
  function animateCounter(el, target, suffix) {
    suffix = suffix || '';
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.dataset.count;
          const suffix = el.dataset.suffix || '';
          if (raw) animateCounter(el, parseFloat(raw), suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

})();
