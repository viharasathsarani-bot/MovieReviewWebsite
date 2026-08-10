/* ==========================================================================
   CineVerse - Global JavaScript
   Shared movie dataset + navigation, theme, reveal, toast, scroll-to-top
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. MOVIE DATABASE
   This is the ONE movie list for the whole site (home, top rated, reviews,
   and the movies page all read from here). Posters are your real images in
   /images. To add, remove or edit a movie, just edit this array - it will
   automatically show up everywhere.
   Rating/votes below are placeholder numbers - edit them to whatever you want.
   -------------------------------------------------------------------------- */
const MOVIES = [
  { id: 1,  title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8, votes: '2.4M',
    desc: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: 'Inception.jpg' },
  { id: 2,  title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0, votes: '2.9M',
    desc: "When the menace known as the Joker wreaks havoc and chaos on Gotham City, Batman must accept one of the greatest tests of his ability to fight injustice.",
    poster: 'The Dark Knight.jpg' },
  { id: 3,  title: 'Interstellar', genre: 'Sci-Fi', year: 2014, rating: 8.7, votes: '2.2M',
    desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces catastrophic famine.",
    poster: 'Interstellar.jpg' },
  { id: 4,  title: 'Oppenheimer', genre: 'Drama', year: 2023, rating: 8.4, votes: '800K',
    desc: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    poster: 'Oppenheimer.jpg' },
  { id: 5,  title: 'The Shawshank Redemption', genre: 'Drama', year: 1994, rating: 9.3, votes: '2.9M',
    desc: "Over the course of several years, two convicts form a strong friendship while finding solace and eventual redemption through basic human compassion.",
    poster: 'The Shawshank Redemption.jpg' },
  { id: 6,  title: 'Kung Fu Panda', genre: 'Animation', year: 2008, rating: 7.6, votes: '300K',
    desc: "Po the panda is unexpectedly chosen to fulfill an ancient prophecy and study kung fu alongside his idols, the Furious Five.",
    poster: 'Kung Fu Panda.jpg' },
  { id: 7,  title: 'Deadpool', genre: 'Action', year: 2016, rating: 8.0, votes: '1.2M',
    desc: "A wisecracking mercenary with accelerated healing abilities hunts down the man who nearly destroyed his life with a rogue experiment.",
    poster: 'Deadpool.jpg' },
  { id: 8,  title: 'Spider-Man: Into the Spider-Verse', genre: 'Animation', year: 2018, rating: 8.4, votes: '600K',
    desc: "Teen Miles Morales becomes the new Spider-Man and joins forces with five alternate-universe heroes to stop a threat to all reality.",
    poster: 'Spider-Man Into the Spider-Verse.jpg' },
  { id: 9,  title: 'The Conjuring', genre: 'Horror', year: 2013, rating: 7.5, votes: '600K',
    desc: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    poster: 'The Conjuring.jpg' },
  { id: 10, title: 'Jurassic Park', genre: 'Sci-Fi', year: 1993, rating: 8.2, votes: '1M',
    desc: "A pragmatic paleontologist visiting an almost-complete theme park is tasked with protecting two kids after a power failure sets cloned dinosaurs free.",
    poster: 'Jurassic Park.jpg' },
  { id: 11, title: 'Gladiator', genre: 'Action', year: 2000, rating: 8.5, votes: '1.6M',
    desc: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    poster: 'Gladiator.jpg' },
  { id: 12, title: 'Home Alone', genre: 'Comedy', year: 1990, rating: 7.7, votes: '650K',
    desc: "An eight-year-old troublemaker must protect his house from a pair of burglars when he is accidentally left home alone by his family during Christmas vacation.",
    poster: 'Home Alone.jpg' },
  { id: 13, title: 'Whiplash', genre: 'Drama', year: 2014, rating: 8.5, votes: '1M',
    desc: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an abusive instructor.",
    poster: 'Whiplash.jpg' },
  { id: 14, title: 'Parasite', genre: 'Drama', year: 2019, rating: 8.5, votes: '900K',
    desc: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: 'Parasite.jpg' },
  { id: 15, title: 'Rush Hour', genre: 'Comedy', year: 1998, rating: 6.9, votes: '190K',
    desc: "A loyal Hong Kong inspector pairs up with a reckless LAPD officer to rescue the kidnapped daughter of a Chinese diplomat.",
    poster: 'Rush Hour.jpg' }
];

/* Movies shown in the home page hero slider */
const HERO_IDS = [2, 5, 3, 8];

/* --------------------------------------------------------------------------
   2. HELPERS
   -------------------------------------------------------------------------- */

/** Build the poster markup for a movie, using its real image if it has one. */
function posterHTML(movie, badge) {
  // Real posters render as a dedicated <img> layer, because the ::before /
  // ::after CSS artwork paints on top of the element's own background.
  const grad = movie.grad || 'linear-gradient(150deg,#2b2f3a,#11151b)';
  const photo = movie.poster
    ? `<img class="poster-photo" src="images/${encodeURI(movie.poster)}" alt="${movie.title} poster" loading="lazy">`
    : '';
  return `
    <div class="poster${movie.poster ? ' has-photo' : ''}" style="--poster-grad:${grad}">
      ${photo}
      ${badge ? `<span class="poster-badge">${badge}</span>` : ''}
      <div>
        <div class="poster-title">${movie.title}</div>
        <div class="poster-year">${movie.genre.toUpperCase()} &bull; ${movie.year}</div>
      </div>
    </div>`;
}


/** Convert a 0-10 rating into 5 star characters. */
function starsFromRating(rating) {
  const full = Math.round(rating / 2);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

/** Show a slide-in toast notification. */
function showToast(title, message, isError) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.classList.toggle('error', !!isError);
  toast.innerHTML = `<div style="font-size:1.2rem">${isError ? '⚠️' : '✅'}</div>
                     <div><strong>${title}</strong><span>${message}</span></div>`;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3800);
}

/* --------------------------------------------------------------------------
   3. NAVIGATION - sticky styling, active link, mobile hamburger
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const burger = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');

  // Sticky background once the page is scrolled
  const onScroll = () => navbar && navbar.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Highlight the link matching the current file name
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Mobile menu
  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
    }));
  }
}

/* --------------------------------------------------------------------------
   4. DARK / LIGHT MODE (persisted in localStorage)
   -------------------------------------------------------------------------- */
function initTheme() {
  const btn = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('cineverse-theme') || 'dark';
  document.body.classList.toggle('light', saved === 'light');
  if (btn) {
    btn.textContent = saved === 'light' ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
      const light = document.body.classList.toggle('light');
      btn.textContent = light ? '🌙' : '☀️';
      localStorage.setItem('cineverse-theme', light ? 'light' : 'dark');
    });
  }
}

/* --------------------------------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
  items.forEach(i => io.observe(i));
}

/** Re-scan for newly injected .reveal elements (used by dynamic grids). */
function refreshReveal() { initReveal(); }

/* --------------------------------------------------------------------------
   6. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const btn = document.querySelector('.to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 420));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --------------------------------------------------------------------------
   7. SMOOTH SCROLLING for in-page anchors
   -------------------------------------------------------------------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* --------------------------------------------------------------------------
   8. FOOTER YEAR + NEWSLETTER
   -------------------------------------------------------------------------- */
function initFooter() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input').value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      showToast(ok ? 'Subscribed!' : 'Invalid email',
        ok ? 'You are on the CineVerse weekly list.' : 'Please enter a valid email address.', !ok);
      if (ok) form.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   9. HERO SLIDER (home page only)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const wrap = document.querySelector('.hero-slides');
  if (!wrap) return;

  const slides = HERO_IDS.map(id => MOVIES.find(m => m.id === id));
  wrap.innerHTML = slides.map((m, i) => {
    const bg = m.poster
      ? `url('images/${encodeURI(m.poster)}') center/cover no-repeat`
      : (m.grad || 'linear-gradient(150deg,#2b2f3a,#11151b)');
    return `<div class="hero-slide ${i === 0 ? 'active' : ''}" style="background:${bg}"></div>`;
  }).join('');

  const dots = document.querySelector('.hero-dots');
  dots.innerHTML = slides.map((m, i) =>
    `<button class="${i === 0 ? 'active' : ''}" aria-label="Slide ${i + 1}"></button>`).join('');

  const titleEl = document.getElementById('heroTitle');
  const descEl = document.getElementById('heroDesc');
  const metaEl = document.getElementById('heroMeta');
  let index = 0, timer;

  function go(i) {
    index = (i + slides.length) % slides.length;
    const m = slides[index];
    wrap.querySelectorAll('.hero-slide').forEach((s, k) => s.classList.toggle('active', k === index));
    dots.querySelectorAll('button').forEach((d, k) => d.classList.toggle('active', k === index));
    titleEl.innerHTML = `Now Streaming <em>${m.title}</em>`;
    descEl.textContent = m.desc;
    metaEl.innerHTML = `<span class="rating"><span class="imdb">IMDb</span> ${m.rating.toFixed(1)}</span>
      <span>${m.genre}</span><span>${m.year}</span><span>${m.votes} votes</span>`;
  }

  function play() { clearInterval(timer); timer = setInterval(() => go(index + 1), 6000); }
  dots.querySelectorAll('button').forEach((d, i) => d.addEventListener('click', () => { go(i); play(); }));
  go(0);
  play();
}

/* --------------------------------------------------------------------------
   10. BOOTSTRAP
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTheme();
  initScrollTop();
  initSmoothAnchors();
  initFooter();
  initHeroSlider();
  initReveal();
});

/* ==========================================================================
   HOME PAGE RENDERING (only runs when the matching containers exist)
   ========================================================================== */

/** Small poster collage next to the welcome copy. */
function renderWelcomeArt() {
  const el = document.getElementById('welcomeArt');
  if (!el) return;
  el.innerHTML = [2, 5, 8, 11].map(i => posterHTML(MOVIES[i])).join('');
}

/** Trending rail: 6 highest-voted recent titles. */
function renderTrending() {
  const rail = document.getElementById('trendingRail');
  if (!rail) return;
  const list = MOVIES.filter(m => m.year >= 2023).slice(0, 6);
  rail.innerHTML = list.map(m => `
    <article class="card movie-card reveal">
      ${posterHTML(m, m.rating >= 9 ? 'TOP' : '')}
      <div class="body">
        <h3>${m.title}</h3>
        <div class="meta">
          <span class="tag">${m.genre}</span>
          <span class="rating"><span class="imdb">IMDb</span> ${m.rating.toFixed(1)}</span>
        </div>
      </div>
    </article>`).join('');
  refreshReveal();
}

/** Three hand-picked community reviews. */
function renderFeaturedReviews() {
  const el = document.getElementById('featuredReviews');
  if (!el) return;
  const picks = [
    { name: 'Amara Silva', movie: 'The Shawshank Redemption', rating: 9.5,
      text: 'The most quietly devastating drama in years. It trusts the audience completely and the final act earns every bit of hope it builds.' },
    { name: 'Dinesh Kumar', movie: 'The Dark Knight', rating: 9.0,
      text: 'Relentless pacing and a villain with an actual point of view. Every rewatch finds something new in it.' },
    { name: 'Leah Fernando', movie: 'Spider-Man: Into the Spider-Verse', rating: 8.5,
      text: 'Animation this bold should be illegal. Every frame is hand-crafted and the ending is pure joy.' }
  ];
  el.innerHTML = picks.map(r => `
    <article class="card review-quote reveal">
      <div class="stars">${starsFromRating(r.rating)}</div>
      <p style="margin-top:10px">${r.text}</p>
      <div class="review-who">
        <div class="avatar">${r.name.charAt(0)}</div>
        <div><b>${r.name}</b><small>on ${r.movie}</small></div>
      </div>
    </article>`).join('');
  refreshReveal();
}

/** Genre category tiles. */
function renderCategories() {
  const el = document.getElementById('catGrid');
  if (!el) return;
  const genres = ['Action', 'Comedy', 'Horror', 'Drama', 'Sci-Fi', 'Animation'];
  el.innerHTML = genres.map(g => {
    const count = MOVIES.filter(m => m.genre === g).length;
    const sample = MOVIES.find(m => m.genre === g);
    const bg = sample.poster
      ? `url('images/${encodeURI(sample.poster)}') center/cover no-repeat`
      : (sample.grad || 'linear-gradient(150deg,#2b2f3a,#11151b)');
    return `<a class="cat reveal zoom" href="movies.html?genre=${encodeURIComponent(g)}"
              style="background:${bg}">
              <span>${g}<small>${count} titles</small></span>
            </a>`;
  }).join('');
  refreshReveal();
}

document.addEventListener('DOMContentLoaded', () => {
  renderWelcomeArt();
  renderTrending();
  renderFeaturedReviews();
  renderCategories();
});
