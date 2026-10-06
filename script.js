/* Al-Noor Auto Workshop: navigation, WhatsApp links, form validation. */
(() => {
  'use strict';

  // ---- Edit these two values to change every WhatsApp link on the page ----
  const WHATSAPP = {
    number: '920000000000', // international format, digits only (DEMO placeholder)
    message: "Hello Al-Noor Auto Workshop, I'd like to book a service."
  };
<button id="menuBtn">
  const $ = (selector, scope = document) => scope.querySelector(selector);

  // ---- WhatsApp links ----
  const waUrl = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}`;
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  // ---- Mobile menu ----
  const header = $('.site-header');
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 68em)').addEventListener('change', () => setMenu(false));

  // ---- Header shadow + active link while scrolling ----
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = [...document.querySelectorAll('.nav-link')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((link) => { const target = $(link.hash); if (target) spy.observe(target); });

  // ---- Contact form (frontend demo only) ----
  const form = $('#contact-form');
  const success = $('#form-success');

  const rules = {
    name: (v) => v.trim().length >= 2 || 'Enter your full name.',
    phone: (v) => /^\+?[\d\s()-]{10,18}$/.test(v.trim()) && v.replace(/\D/g, '').length >= 10
      || 'Enter a valid phone number, for example +92 300 0000000.',
    email: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      || 'Enter a valid email address, for example you@example.com.',
    service: (v) => v.trim().length >= 3 || 'Tell us your vehicle or the service you need.',
    message: (v) => !v.trim() || v.trim().length >= 10 || 'Add a little more detail (at least 10 characters).'
  };

  const validate = (field) => {
    const result = rules[field.name](field.value);
    const error = $(`#${field.id}-error`);
    const valid = result === true;
    error.textContent = valid ? '' : result;
    field.setAttribute('aria-invalid', String(!valid));
    return valid;
  };

  const fields = [...form.elements].filter((el) => rules[el.name]);
  fields.forEach((field) => {
    field.addEventListener('blur', () => { if (field.value || field.required) validate(field); });
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    form.hidden = true;
    form.reset();
    success.hidden = false;
    success.focus();
  });

  $('#form-reset').addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    fields[0].focus();
  });
})();
