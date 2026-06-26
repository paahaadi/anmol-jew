/* ============================================================
   ANMOL JEWELLERS — JavaScript
   Scroll reveal · Nav · Mascot parallax · Form · Hamburger
   ============================================================ */

// ── Navbar scroll effect ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ── Hamburger / Mobile menu ──────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobile();
  }
});

// ── Scroll Reveal ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up').forEach(el => {
  revealObserver.observe(el);
});

// ── Mascot parallax on scroll ────────────────────────────
const mascot = document.getElementById('mascot');
let ticking  = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY   = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress  = scrollY / docHeight;

      // Vertical drift: moves from center to slightly higher as user scrolls
      const verticalOffset = progress * -120;
      mascot.style.transform = `translateY(calc(-50% + ${verticalOffset}px))`;

      // Fade out near bottom
      const opacity = progress > 0.85 ? 1 - ((progress - 0.85) / 0.15) : 1;
      mascot.style.opacity = Math.max(0, opacity);

      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ── Smooth anchor scrolling with nav offset ──────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Set date min to today ────────────────────────────────
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// ── Booking form submission ──────────────────────────────
function handleBooking(e) {
  e.preventDefault();

  const btn     = document.getElementById('submitBtn');
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');

  // Gather data
  const name     = document.getElementById('name').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const date     = document.getElementById('date').value;
  const interest = document.getElementById('interest').value;
  const message  = document.getElementById('message').value.trim();

  // Button loading state
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Build WhatsApp message as the booking channel
  const whatsappMsg = encodeURIComponent(
    `Hello Anmol Jewellers! I'd like to book an appointment.\n\n` +
    `*Name:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `*Date:* ${date}\n` +
    `*Interested in:* ${interest}\n` +
    (message ? `*Message:* ${message}` : '')
  );

  // Simulate brief processing then open WhatsApp
  setTimeout(() => {
    // Show success state
    form.style.display    = 'none';
    success.style.display = 'block';

    // Open WhatsApp booking
    window.open(`https://wa.me/918628911161?text=${whatsappMsg}`, '_blank');
  }, 900);
}

// ── Subtle product card tilt on mouse move ───────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const rotX   = y * -6;
    const rotY   = x *  6;
    card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.8,0.25,1)';
  });
});

// ── Active nav link highlight on scroll ─────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Hero text stagger ────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('#hero .reveal');
  heroEls.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    setTimeout(() => el.classList.add('visible'), 100 + i * 100);
  });
});

// ── Marquee pause on hover ───────────────────────────────
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

console.log('%c✦ Anmol Jewellers — Website loaded', 'color:#B8860B;font-size:14px;font-weight:bold;');
