/* ==========================================================================
   Reviews page - render reviews, validate the form, persist to localStorage
   ========================================================================== */

const STORAGE_KEY = 'cineverse-reviews';

/* Seed reviews shipped with the site (shown when the user has none yet). */
const SEED_REVIEWS = [
  { movie: 'The Shawshank Redemption', name: 'Amara Silva', rating: 5, seed: true, date: '2026-05-02',
    text: 'The most quietly devastating drama I have ever watched. It trusts the audience completely and the final act earns every tear I had.' },
  { movie: 'The Dark Knight', name: 'Dinesh Kumar', rating: 4, seed: true, date: '2026-04-21',
    text: 'Relentless pacing, practical stunts and a villain with an actual point of view. It never feels like a gimmick even on a rewatch.' },
  { movie: 'Spider-Man: Into the Spider-Verse', name: 'Leah Fernando', rating: 5, seed: true, date: '2026-04-08',
    text: 'Animation this bold should be illegal. Every frame looks hand painted and the ending is pure joy.' },
  { movie: 'The Conjuring', name: 'Marcus Reid', rating: 4, seed: true, date: '2026-03-30',
    text: 'Slow-burn horror that earns its scares with sound design instead of jump cuts. The third act loses a little nerve but it stays with you.' }
];

const listEl = document.getElementById('reviewList');
const form = document.getElementById('reviewForm');
const picker = document.getElementById('starPicker');
const ratingInput = document.getElementById('ratingValue');
const movieSelect = document.getElementById('movieSelect');
const emptyFilterBtns = document.querySelectorAll('.filter-row .filter-btn');

let currentFilter = 'all';

/* ---------- localStorage helpers ---------- */
function loadStored() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch (e) { return []; }
}
function saveStored(reviews) { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); }

/* ---------- Rendering ---------- */
function reviewHTML(r, index) {
  const movie = MOVIES.find(m => m.title === r.movie) || MOVIES[0];
  return `
    <article class="card rcard reveal">
      ${posterHTML(movie)}
      <div>
        <div class="rhead">
          <h3>${r.movie}</h3>
          <span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        </div>
        <p class="rtext">${r.text}</p>
        <div class="rfoot">
          <span class="who"><span class="avatar" style="width:30px;height:30px;font-size:.8rem">${r.name.charAt(0).toUpperCase()}</span>
            ${r.name} &bull; ${r.date}
            ${r.seed ? '' : '<span class="badge-user">Your review</span>'}</span>
          ${r.seed ? '' : `<button class="delete-btn" data-index="${index}">Delete</button>`}
        </div>
      </div>
    </article>`;
}

function renderReviews() {
  const stored = loadStored();
  // Newest user reviews first, then the seeded editorial reviews.
  const all = [
    ...stored.map((r, i) => ({ ...r, _index: i })),
    ...SEED_REVIEWS
  ];
  const list = currentFilter === 'mine' ? all.filter(r => !r.seed) : all;

  listEl.innerHTML = list.length
    ? list.map(r => reviewHTML(r, r._index)).join('')
    : `<div class="no-results" style="text-align:center;padding:60px;color:var(--muted)">
         <div style="font-size:3rem">✍️</div><h3>No reviews yet</h3>
         <p>Be the first to post one using the form.</p></div>`;

  // Wire up delete buttons for user-created reviews
  listEl.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => {
    const stored = loadStored();
    stored.splice(Number(btn.dataset.index), 1);
    saveStored(stored);
    renderReviews();
    showToast('Review deleted', 'Your review was removed from this browser.');
  }));

  refreshReveal();
}

/* ---------- Populate movie dropdown ---------- */
movieSelect.innerHTML = '<option value="">Select a movie...</option>' +
  MOVIES.map(m => `<option value="${m.title}">${m.title} (${m.year})</option>`).join('');

/* ---------- Interactive star rating picker ---------- */
picker.innerHTML = [1, 2, 3, 4, 5].map(n => `<span data-value="${n}">★</span>`).join('');
const starEls = picker.querySelectorAll('span');
function paintStars(value) { starEls.forEach(s => s.classList.toggle('on', Number(s.dataset.value) <= value)); }
starEls.forEach(s => {
  s.addEventListener('mouseenter', () => paintStars(Number(s.dataset.value)));
  s.addEventListener('click', () => { ratingInput.value = s.dataset.value; paintStars(Number(s.dataset.value)); });
});
picker.addEventListener('mouseleave', () => paintStars(Number(ratingInput.value || 0)));

/* ---------- Validation helpers ---------- */
function setError(fieldId, message) {
  const field = document.getElementById(fieldId).closest('.field');
  field.classList.add('invalid');
  field.querySelector('.error-msg').textContent = message;
}
function clearError(fieldId) { document.getElementById(fieldId).closest('.field').classList.remove('invalid'); }

/* ---------- Form submission ---------- */
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('reviewerName').value.trim();
  const movie = movieSelect.value;
  const text = document.getElementById('reviewText').value.trim();
  const rating = Number(ratingInput.value);

  ['reviewerName', 'movieSelect', 'reviewText', 'ratingValue'].forEach(clearError);

  if (name.length < 3) { setError('reviewerName', 'Please enter at least 3 characters.'); valid = false; }
  if (!movie) { setError('movieSelect', 'Choose the movie you are reviewing.'); valid = false; }
  if (!rating) { setError('ratingValue', 'Pick a star rating.'); valid = false; }
  if (text.length < 15) { setError('reviewText', 'Your review needs at least 15 characters.'); valid = false; }

  if (!valid) { showToast('Check the form', 'Some fields still need your attention.', true); return; }

  const stored = loadStored();
  stored.unshift({ name, movie, rating, text, date: new Date().toISOString().slice(0, 10) });
  saveStored(stored);

  form.reset();
  ratingInput.value = '';
  paintStars(0);
  renderReviews();
  showToast('Review published!', 'Thanks ' + name + ', your review is saved on this device.');
});

/* ---------- Filter tabs ---------- */
emptyFilterBtns.forEach(btn => btn.addEventListener('click', () => {
  emptyFilterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  renderReviews();
}));

renderReviews();
