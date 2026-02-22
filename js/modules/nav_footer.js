// ============================================================
// nav_footer.js — Carga dinámica del nav y footer
// Compatible con index.html (raíz) y pages/*.html (subpáginas)
// ============================================================

// Detecta si estamos en una subpágina (pages/) o en la raíz
const isSubpage = window.location.pathname.includes('/pages/');
const base = isSubpage ? '../' : './';

// Cargar nav
fetch(`${base}partials/nav.html`)
  .then(res => res.text())
  .then(data => {
    document.querySelector('.contenedor-nav').innerHTML = data;
    inicializarMenuMovil();
  })
  .catch(err => console.warn('No se pudo cargar el nav:', err));

// Cargar footer
fetch(`${base}partials/footer.html`)
  .then(res => res.text())
  .then(data => {
    document.querySelector('.contenedor-footer').innerHTML = data;
  })
  .catch(err => console.warn('No se pudo cargar el footer:', err));

// ── Menú móvil ──────────────────────────────────────────────
function inicializarMenuMovil() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const iconOpen = document.getElementById('nav-toggle-open');
  const iconClose = document.getElementById('nav-toggle-close');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    iconOpen.style.display = isActive ? 'none' : 'block';
    iconClose.style.display = isActive ? 'block' : 'none';
  });

  // Cerrar menú al hacer clic en un enlace
  navMenu.querySelectorAll('.lista-a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      iconOpen.style.display = 'block';
      iconClose.style.display = 'none';
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      iconOpen.style.display = 'block';
      iconClose.style.display = 'none';
    }
  });
}
