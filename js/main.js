/* ============================================================
   NORIOMA — main.js
   Carrusel, Intersection Observer, Contadores animados,
   Nav sticky (clase .scrolled al scrollear)
   ============================================================ */

// ══════════════════════════════════════════════════════════════
// 1. CARRUSEL
// ══════════════════════════════════════════════════════════════
let carouselIndex = 0;
const slides = document.querySelectorAll('.carousel-images img');
const indicators = document.querySelectorAll('.indicator');
const carousel = document.getElementById('carousel');

function moveSlide(direction) {
  const total = slides.length;
  if (total === 0) return;
  carouselIndex = (carouselIndex + direction + total) % total;
  updateCarousel();
}

function currentSlide(n) {
  carouselIndex = n;
  updateCarousel();
}

function updateCarousel() {
  const track = document.querySelector('.carousel-images');
  if (track) track.style.transform = `translateX(-${carouselIndex * 100}%)`;
  indicators.forEach((ind, i) => ind.classList.toggle('active', i === carouselIndex));
}

// Con soporte táctil (swipe)
if (carousel) {
  let startX = 0;
  let isDragging = false;

  // Mouse
  carousel.addEventListener('mousedown', e => { isDragging = true; startX = e.pageX; carousel.style.cursor = 'grabbing'; });
  carousel.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    const track = document.querySelector('.carousel-images');
    if (track) track.style.transform = `translateX(calc(-${carouselIndex * 100}% + ${diff}px))`;
  });
  carousel.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';
    const diff = e.pageX - startX;
    if (Math.abs(diff) > 60) moveSlide(diff < 0 ? 1 : -1);
    else updateCarousel();
  });
  carousel.addEventListener('mouseleave', () => { if (isDragging) { isDragging = false; updateCarousel(); } });

  // Touch
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) moveSlide(diff < 0 ? 1 : -1);
  });

  // Inicializar
  updateCarousel();

  // Autoplay cada 6 s
  let autoplay = setInterval(() => moveSlide(1), 6000);
  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', () => { autoplay = setInterval(() => moveSlide(1), 6000); });
}


// ══════════════════════════════════════════════════════════════
// 2. NAV STICKY — clase .scrolled al scrollear
// ══════════════════════════════════════════════════════════════
const navEl = document.querySelector('nav');
if (navEl) {
  const onScroll = () => navEl.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // ejecutar al cargar
}


// ══════════════════════════════════════════════════════════════
// 3. INTERSECTION OBSERVER — animaciones de entrada
// ══════════════════════════════════════════════════════════════
const animateEls = document.querySelectorAll('[data-animate]');
if (animateEls.length > 0) {
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger: retraso escalonado si hay varios dentro del mismo bloque
        const siblings = entry.target.closest('.why-grid, .services-grid, .testimonials-grid, .stats-container, .card-container');
        let delay = 0;
        if (siblings) {
          const allInGroup = [...siblings.querySelectorAll('[data-animate]')];
          const idx = allInGroup.indexOf(entry.target);
          delay = idx * 100; // 100ms por cada elemento
        }
        setTimeout(() => entry.target.classList.add('visible'), delay);
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animateEls.forEach(el => animObserver.observe(el));
}


// ══════════════════════════════════════════════════════════════
// 4. CONTADOR ANIMADO — sección stats
// ══════════════════════════════════════════════════════════════
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800; // ms
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsSection = document.getElementById('stats');
if (statsSection) {
  let counted = false;
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-number').forEach(animateCounter);
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);
}
