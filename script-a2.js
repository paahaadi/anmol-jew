/* ============================================================
   ANMOL JEWELLERS v2 — script-a2.js
   Bridal scroll hero frame sequencer + carousel + shared UX
   ============================================================ */

/* ── Navbar ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hamburger ───────────────────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════
   HERO — BRIDAL SCROLL FRAME SEQUENCER
   The hero section is 100vh tall but has an additional
   invisible "scroll space" below it.  As the user scrolls
   through that space the frames cross-fade:
     Frame 0: Full bridal look         (scroll 0 – 25%)
     Frame 1: Necklace close-up        (scroll 25 – 50%)
     Frame 2: Bangles close-up         (scroll 50 – 75%)
     Frame 3: Earrings / pan shot      (scroll 75 – 100%)
   After the scroll space ends, the hero snaps out and the
   rest of the page scrolls normally.
   ══════════════════════════════════════════════════════════ */

const frames      = document.querySelectorAll('.hero-frame');
const dots        = document.querySelectorAll('.frame-dot');
const frameLabelEl= document.getElementById('frameLabelText');
const heroSection = document.getElementById('hero');

const frameLabels = [
  'Full Bridal Look',
  'Necklace Detail',
  'Bangle Collection',
  'Earrings & Maang Tikka'
];

let currentFrame  = 0;
let lastFrame     = -1;

function setFrame(idx) {
  if (idx === lastFrame) return;
  lastFrame = idx;

  frames.forEach((f, i) => {
    f.classList.toggle('active', i === idx);
  });
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
  frameLabelEl.textContent = frameLabels[idx];
}

/* Dot click → jump to frame (also auto-advances) */
dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.frame);
    setFrame(idx);
    currentFrame = idx;
  });
});

/* Scroll-driven frame change */
function updateHeroFrameOnScroll() {
  const heroH   = heroSection.offsetHeight;
  const scrollY = window.scrollY;

  // Determine progress within the hero viewport (0→1)
  const pct = Math.min(1, Math.max(0, scrollY / (heroH * 0.8)));

  let newFrame;
  if      (pct < 0.25) newFrame = 0;
  else if (pct < 0.50) newFrame = 1;
  else if (pct < 0.75) newFrame = 2;
  else                 newFrame = 3;

  setFrame(newFrame);
  currentFrame = newFrame;
}

window.addEventListener('scroll', updateHeroFrameOnScroll, { passive: true });

/* Auto-play when not scrolling (every 3.5s) */
let autoplay = setInterval(() => {
  if (window.scrollY < 100) {  // only when user hasn't scrolled yet
    currentFrame = (currentFrame + 1) % frames.length;
    setFrame(currentFrame);
  }
}, 3500);

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    clearInterval(autoplay);
  }
}, { passive: true, once: true });

/* Initial frame */
setFrame(0);

/* ── Scroll Reveal (Intersection Observer) ───────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-up').forEach(el => revealObs.observe(el));

/* Hero reveals on load */
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#hero .reveal,.hero-inner .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 90}ms`;
    setTimeout(() => el.classList.add('visible'), 100 + i * 90);
  });
});

/* Floating mascot logic removed - it is now fixed to bottom-right as a chat trigger */

/* ══════════════════════════════════════════════════════════
   CATALOGUE CAROUSEL
   Arrow buttons + drag-to-scroll + keyboard
   ══════════════════════════════════════════════════════════ */
const rail     = document.getElementById('catRail');
const prevBtn  = document.getElementById('railPrev');
const nextBtn  = document.getElementById('railNext');

if (rail) {
  const SCROLL_AMT = 320; // px per arrow click

  prevBtn.addEventListener('click', () => {
    rail.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    rail.scrollBy({ left: SCROLL_AMT, behavior: 'smooth' });
  });

  /* Show/hide arrows */
  function updateArrows() {
    prevBtn.style.opacity = rail.scrollLeft <= 10 ? '0.3' : '1';
    nextBtn.style.opacity = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 10 ? '0.3' : '1';
    prevBtn.style.pointerEvents = rail.scrollLeft <= 10 ? 'none' : 'auto';
  }
  rail.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();

  /* Drag-to-scroll */
  let isDragging = false;
  let startX, startScroll;
  rail.addEventListener('mousedown', (e) => {
    isDragging = true; startX = e.pageX; startScroll = rail.scrollLeft;
    rail.style.userSelect = 'none';
  });
  rail.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    rail.scrollLeft = startScroll - (e.pageX - startX);
  });
  rail.addEventListener('mouseup',   () => { isDragging = false; rail.style.userSelect = ''; });
  rail.addEventListener('mouseleave',() => { isDragging = false; rail.style.userSelect = ''; });

  /* Card hover tilt */
  document.querySelectorAll('.cat-card, .3d-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── Smooth Anchors ──────────────────────────────────────── */
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

/* ── Date input min ──────────────────────────────────────── */
const dateInput = document.getElementById('date');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

/* ── Booking form → WhatsApp ─────────────────────────────── */
function handleBooking(e) {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const form = document.getElementById('bookingForm');
  const succ = document.getElementById('formSuccess');
  btn.textContent = 'Opening WhatsApp…'; btn.disabled = true;
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
  }, 800);
}

/* ── Marquee pause on hover ──────────────────────────────── */
const mTrack = document.querySelector('.marquee-track');
if (mTrack) {
  mTrack.addEventListener('mouseenter', () => mTrack.style.animationPlayState = 'paused');
  mTrack.addEventListener('mouseleave', () => mTrack.style.animationPlayState = 'running');
}

console.log('%c✦ Anmol Jewellers — Premium Jewellery, Sundar Nagar', 'color:#C9A84C;font-size:14px;font-weight:bold;');

/* ── Chatbot Logic ──────────────────────────────────────── */
const chatTrigger = document.getElementById('chatTrigger');
const chatbox     = document.getElementById('chatbox');
const chatClose   = document.getElementById('chatClose');
const chatInput   = document.getElementById('chatInput');
const chatSend    = document.getElementById('chatSend');
const chatMsgs    = document.getElementById('chatMessages');
const qrChips     = document.querySelectorAll('.qr-chip');

if (chatTrigger && chatbox) {
  chatTrigger.addEventListener('click', () => {
    console.log('Chat mascot clicked!');
    chatbox.classList.toggle('open');
  });
  if (chatClose) chatClose.addEventListener('click', () => chatbox.classList.remove('open'));

  const faqs = {
    location: "We are located at Bhojpur, Sundar Nagar, Himachal Pradesh 175002. We're right in the heart of the city! You can find our Google Maps link in the 'Find Us' section.",
    catalogue: "We offer a premium collection of Hallmark Gold, Silver, and Diamond jewellery. This includes bridal sets, Jadau work, gold watches, silver pendants, and custom designs! Check out our 'Collections' section for a preview.",
    hours: "We are open every day from 9:00 AM onwards. Note that during festivals or Ashura, hours might slightly vary.",
    booking: "You can book a personal consultation easily! Just scroll to the 'Book Appointment' section or click 'Book Appointment' in the navigation bar to connect to our official WhatsApp.",
    hallmark: "Yes! We guarantee 100% HUID Certified Hallmark Gold, ensuring total purity and trust for generations.",
    default: "Namaste! I'm the Anmol Assistant. I can help with our location, operating hours, product catalogue, or booking a consultation. How can I assist you today?"
  };

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <div class="msg-time">${time}</div>
    `;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function handleQuery(query) {
    if (!query.trim()) return;
    addMessage(query, 'user');
    chatInput.value = '';
    
    // Quick typing simulation
    setTimeout(() => {
      const q = query.toLowerCase();
      let response = faqs.default;
      
      if (q.includes('locat') || q.includes('where') || q.includes('address') || q.includes('map')) response = faqs.location;
      else if (q.includes('catalog') || q.includes('product') || q.includes('buy') || q.includes('sell') || q.includes('jewel') || q.includes('gold') || q.includes('silver') || q.includes('diamond')) response = faqs.catalogue;
      else if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('close')) response = faqs.hours;
      else if (q.includes('book') || q.includes('appoint') || q.includes('consult')) response = faqs.booking;
      else if (q.includes('hallmark') || q.includes('huid') || q.includes('pure') || q.includes('certif')) response = faqs.hallmark;
      
      addMessage(response, 'bot');
    }, 500);
  }

  if (chatSend) chatSend.addEventListener('click', () => handleQuery(chatInput.value));
  if (chatInput) chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleQuery(chatInput.value);
  });

  qrChips.forEach(chip => {
    chip.addEventListener('click', () => handleQuery(chip.textContent));
  });
}
