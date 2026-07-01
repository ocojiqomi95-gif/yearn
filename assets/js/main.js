/* Yearn Finance – shared site JS */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Navbar: mobile menu toggle                                           */
  /* ------------------------------------------------------------------ */
  function initNavbar() {
    var nav = document.querySelector('[data-section="navbar"]');
    if (!nav) return;

    var toggleBtn = nav.querySelector('[data-nav-toggle]');
    var menu      = nav.querySelector('[data-nav-menu]');
    var icon      = toggleBtn ? toggleBtn.querySelector('svg') : null;

    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', function () {
      var isOpen = menu.style.maxHeight && menu.style.maxHeight !== '0px';
      if (isOpen) {
        menu.style.maxHeight = '0';
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        menu.style.maxHeight = menu.scrollHeight + 'px';
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (icon) icon.style.transform = 'rotate(45deg)';
      }
    });

    /* Close menu when a link inside it is clicked */
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.style.maxHeight = '0';
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = 'rotate(0deg)';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        menu.style.maxHeight = '0';
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* FAQ accordion                                                        */
  /* ------------------------------------------------------------------ */
  function initFAQ() {
    var faqItems = document.querySelectorAll('[data-faq-item]');
    faqItems.forEach(function (item) {
      /* The whole card is clickable */
      var answer = item.querySelector('[data-faq-answer]');
      var icon   = item.querySelector('[data-faq-trigger] svg, svg');

      if (!answer) return;

      /* Set initial state */
      answer.style.overflow   = 'hidden';
      answer.style.maxHeight  = '0';
      answer.style.transition = 'max-height 0.3s ease';
      answer.style.marginTop  = '0.75rem';

      item.addEventListener('click', function () {
        var isOpen = item.classList.toggle('faq-open');
        answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
        if (icon) {
          icon.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)';
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll-reveal (simple fade-in on scroll)                            */
  /* ------------------------------------------------------------------ */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('[data-reveal]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                 */
  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initFAQ();
    initScrollReveal();
  });
}());
