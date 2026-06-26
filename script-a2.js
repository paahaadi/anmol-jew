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
   HERO — BRIDAL SCROLL CINEMATIC (GSAP + CANVAS)
   ══════════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-canvas");
const context = canvas ? canvas.getContext("2d") : null;
const frameLabelEl = document.getElementById("frameLabelText");

const frameCount = 241;
const currentFrame = index => (
  `hero_section/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.webp`
);

const images = [];
const bridalSeq = { frame: 0 };

if (canvas) {
  // Pre-allocate array
  for (let i = 0; i < frameCount; i++) {
    images.push(null);
  }
  
  // Load first frame immediately to unblock rendering
  const firstImg = new Image();
  firstImg.src = currentFrame(0);
  images[0] = firstImg;

  // Parallel chunked loading to eliminate latency overhead
  const CHUNK_SIZE = 20;
  let currentLoadIndex = 1;

  function loadNextChunk() {
    if (currentLoadIndex >= frameCount) return;
    
    let loadedInChunk = 0;
    let chunkEnd = Math.min(currentLoadIndex + CHUNK_SIZE, frameCount);
    let amountToLoad = chunkEnd - currentLoadIndex;

    for (let i = currentLoadIndex; i < chunkEnd; i++) {
      const idx = i; // capture in closure
      const img = new Image();
      img.src = currentFrame(idx);
      
      const onComplete = () => {
        loadedInChunk++;
        if (loadedInChunk === amountToLoad) {
          currentLoadIndex = chunkEnd;
          loadNextChunk();
        }
      };
      
      img.onload = () => {
        images[idx] = img;
        onComplete();
      };
      img.onerror = onComplete; // Skip errors and continue
    }
  }

  firstImg.onload = () => {
    render(); // Render first frame immediately
    loadNextChunk(); // Start parallel chunked loading
  };

  gsap.to(bridalSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#hero-pin-wrapper",
      start: "top top",
      end: "+=3500", // longer scroll distance for smoother playback
      scrub: 0.5,
      pin: true
    },
    onUpdate: render
  });

  function render() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const img = images[bridalSeq.frame];
    if (!img) return;
    
    // Update labels based on frame progress
    if (bridalSeq.frame < 60) frameLabelEl.textContent = 'The Journey Begins';
    else if (bridalSeq.frame < 120) frameLabelEl.textContent = 'Adorning Tradition';
    else if (bridalSeq.frame < 180) frameLabelEl.textContent = 'The Golden Details';
    else frameLabelEl.textContent = 'Full Bridal Look';
    
    // Cover the canvas properly without stretching
    const canvasRatio = width / height;
    const imgRatio = img.width / img.height;
    
    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawHeight = width / imgRatio;
      offsetY = 0; // Pin to top so the head stays in frame
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  window.addEventListener("resize", render);
}

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
  // Clone items for infinite scroll effect
  rail.innerHTML += rail.innerHTML;

  const SCROLL_AMT = 320;

  function smoothScrollBy(amount) {
    rail.style.scrollBehavior = 'smooth';
    rail.scrollLeft += amount;
    setTimeout(() => rail.style.scrollBehavior = 'auto', 400);
  }

  prevBtn.addEventListener('click', () => smoothScrollBy(-SCROLL_AMT));
  nextBtn.addEventListener('click', () => smoothScrollBy(SCROLL_AMT));

  /* Infinite Auto-Scroll */
  let isInteracting = false;
  const scrollSpeed = 1.5; // pixels per frame
  
  rail.parentElement.addEventListener('mouseenter', () => isInteracting = true);
  rail.parentElement.addEventListener('mouseleave', () => isInteracting = false);
  rail.addEventListener('touchstart', () => isInteracting = true, {passive: true});
  rail.addEventListener('touchend', () => { setTimeout(() => isInteracting = false, 1000); }, {passive: true});

  function autoScroll() {
    if (!isInteracting && rail.style.scrollBehavior !== 'smooth') {
      rail.scrollLeft += scrollSpeed;
      if (rail.scrollLeft >= rail.scrollWidth / 2) {
        rail.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);

  /* Drag-to-scroll */
  let isDragging = false;
  let startX, startScroll;
  rail.addEventListener('mousedown', (e) => {
    isInteracting = true;
    isDragging = true; startX = e.pageX; startScroll = rail.scrollLeft;
    rail.style.userSelect = 'none';
  });
  rail.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    rail.scrollLeft = startScroll - (e.pageX - startX);
  });
  window.addEventListener('mouseup', () => { isDragging = false; rail.style.userSelect = ''; });
  rail.addEventListener('mouseleave', () => { isDragging = false; rail.style.userSelect = ''; });

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
