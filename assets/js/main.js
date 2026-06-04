/* ── Nav scroll ── */
async function initNav() {
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}


async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url);
  const html = await res.text();
  el.outerHTML = html;
}

async function loadComponents() {
  await Promise.all([
    loadPartial('#nav-placeholder', '../../assets/partials/nav.html'),
    loadPartial('#footer-placeholder', '../../assets/partials/footer.html'),
  ]);
  // Reinicia scripts que dependen del nav/footer (ej: scroll, carrusel)
  initNav();
}

loadComponents();