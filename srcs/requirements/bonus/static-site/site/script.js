// ---------- Typing effect in hero prompt ----------
const typedEl = document.getElementById('typedText');
const phrases = ['whoami', 'cat about.txt', 'echo "hire me"'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 90);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  typedEl.textContent = phrases[0];
} else {
  typeLoop();
}

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ---------- Sticky nav shrink + active link ----------
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('main section[id], header#top');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let currentId = 'top';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120) currentId = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === currentId);
  });

  const backToTop = document.getElementById('backToTop');
  backToTop.classList.toggle('visible', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinksList.classList.remove('open'));
});

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// ---------- Copy email to clipboard ----------
const copyBtn = document.getElementById('copyEmail');
const toast = document.getElementById('toast');
copyBtn.addEventListener('click', async () => {
  const email = 'boscott.isaev@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
  } catch (e) {
    const temp = document.createElement('textarea');
    temp.value = email;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
});

// ---------- Back to top ----------
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});
