/* ==========================================================================
   Movies page - live search, genre filtering and card rendering
   Card layout: poster image (top) -> title & year (middle) -> description (bottom)
   ========================================================================== */

/* This page uses the shared MOVIES list defined in js/script.js -
   nothing to duplicate here. Add/edit/remove movies there and this
   page (and every other page) updates automatically. */

const grid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const countEl = document.getElementById('resultCount');
const filterBtns = document.querySelectorAll('.filter-btn');

let activeGenre = 'All';
let query = '';

/** Render one movie card: poster (top) -> title & year (middle) -> description (bottom). */
function cardHTML(m) {
  return `
    <article class="card mcard reveal">
      <div class="poster-wrap">
        <img class="poster-img" src="images/${m.poster}" alt="${m.title} poster" loading="lazy">
      </div>
      <div class="info">
        <h3>${m.title} <span class="year">(${m.year})</span></h3>
        <p class="desc">${m.desc}</p>
      </div>
    </article>`;
}

/** Apply search + genre filter and repaint the grid. */
function renderMovies() {
  const q = query.trim().toLowerCase();
  const list = MOVIES.filter(m => {
    const matchesGenre = activeGenre === 'All' || m.genre.toLowerCase().includes(activeGenre.toLowerCase());
    const matchesQuery = !q ||
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q) ||
      String(m.year).includes(q);
    return matchesGenre && matchesQuery;
  });

  countEl.innerHTML = `Showing <b>${list.length}</b> of ${MOVIES.length} movies` +
    (activeGenre !== 'All' ? ` in <b>${activeGenre}</b>` : '') +
    (q ? ` matching &ldquo;<b>${q}</b>&rdquo;` : '');

  grid.innerHTML = list.length
    ? list.map(cardHTML).join('')
    : `<div class="no-results" style="grid-column:1/-1"><div>🍿</div>
         <h3>No movies found</h3><p>Try a different keyword or genre filter.</p></div>`;
  refreshReveal();
}

/* ---------- Live search (fires on every keystroke) ---------- */
searchInput.addEventListener('input', e => { query = e.target.value; renderMovies(); });

/* ---------- Genre filter buttons ---------- */
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeGenre = btn.dataset.genre;
  renderMovies();
}));

/* ---------- Preselect a genre coming from the home page tiles ---------- */
(function initFromURL() {
  const genre = new URLSearchParams(location.search).get('genre');
  if (genre) {
    const btn = [...filterBtns].find(b => b.dataset.genre === genre);
    if (btn) { filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeGenre = genre; }
  }
  renderMovies();
})();
