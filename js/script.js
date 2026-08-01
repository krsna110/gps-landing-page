/* 
 * GPS ADVISORY — Pure Vanilla JavaScript
 * Handles Starfield, Countdown, Header Scroll, Scroll Reveals, FAQ Accordions & CountUp
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initCountdown();
  initHeaderScroll();
  initScrollReveals();
  initFaqAccordion();
  initCountUp();
  initGalleryLightbox();
});

/* ---------------- Starfield Canvas Animation ---------------- */
function initStarfield() {
  const container = document.getElementById('starfield');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = [];
    const count = Math.min(Math.floor((width * height) / 3800), 220);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let star of stars) {
      star.phase += star.speed;
      const currentAlpha = star.alpha + Math.sin(star.phase) * 0.3;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 215, 170, ${Math.max(0.05, Math.min(1, currentAlpha))})`;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ---------------- Countdown Timer ---------------- */
function initCountdown() {
  const TARGET_DATE = new Date("2026-08-06T19:00:00+05:30").getTime();
  
  const daysElems = document.querySelectorAll('.cd-d');
  const hoursElems = document.querySelectorAll('.cd-h');
  const minsElems = document.querySelectorAll('.cd-m');
  const secsElems = document.querySelectorAll('.cd-s');

  function update() {
    const now = Date.now();
    const diff = Math.max(0, TARGET_DATE - now);

    const d = String(Math.floor(diff / 86400000)).padStart(2, '0');
    const h = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
    const m = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
    const s = String(Math.floor(diff / 1000) % 60).padStart(2, '0');

    daysElems.forEach(el => el.textContent = d);
    hoursElems.forEach(el => el.textContent = h);
    minsElems.forEach(el => el.textContent = m);
    secsElems.forEach(el => el.textContent = s);
  }

  update();
  setInterval(update, 1000);
}

/* ---------------- Header Sticky Scroll ---------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------- Scroll Reveals ---------------- */
function initScrollReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(el);
  });
}

/* ---------------- FAQ Accordion ---------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-button');
    if (!button) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ---------------- CountUp Animation ---------------- */
function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 40));

        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          entry.target.textContent = count + suffix;
        }, 30);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(el => observer.observe(el));
}

/* ---------------- Gallery Lightbox Modal ---------------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('.gallery-img-card img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Gallery Photo';
      lightbox.classList.add('active');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

