/* ============================================================
   ANMOL JEWELLERS — Shared Script (both variations)
   ============================================================ */

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) closeMobile();
});

// Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up').forEach(el => revealObserver.observe(el));

// Hero instant reveal
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#hero .reveal, #hero .reveal-right, #hero .reveal-left').forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
    setTimeout(() => el.classList.add('visible'), 80 + i * 80);
  });
});

// Mascot parallax
const mascot = document.getElementById('mascot');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      mascot.style.transform = `translateY(calc(-50% + ${p * -100}px))`;
      mascot.style.opacity   = p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.15) : 1;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    }
  });
});

// Date min
const dateInput = document.getElementById('date');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

// Booking form → WhatsApp
function handleBooking(e) {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const form = document.getElementById('bookingForm');
  const succ = document.getElementById('formSuccess');
  btn.textContent = 'Sending…'; btn.disabled = true;
  const msg = encodeURIComponent(
    `Hello Anmol Jewellers! I'd like to book an appointment.\n\n` +
    `*Name:* ${document.getElementById('name').value}\n` +
    `*Phone:* ${document.getElementById('phone').value}\n` +
    `*Date:* ${document.getElementById('date').value}\n` +
    `*Interested in:* ${document.getElementById('interest').value}\n` +
    (document.getElementById('message').value ? `*Message:* ${document.getElementById('message').value}` : '')
  );
  setTimeout(() => {
    form.style.display = 'none';
    succ.style.display = 'block';
    window.open(`https://wa.me/918628911161?text=${msg}`, '_blank');
  }, 900);
}

// Product card 3D tilt
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Marquee pause on hover
const track = document.querySelector('.marquee-track');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

console.log('%c✦ Anmol Jewellers', 'color:#D4AF37;font-size:16px;font-weight:bold;');
