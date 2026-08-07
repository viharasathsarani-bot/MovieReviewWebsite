/* ==========================================================================
   Top Rated page - ranking list, animated rating bars, counters
   ========================================================================== */

/* ---------- Top 10 by rating ---------- */
const topTen = [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 10);

document.getElementById('rankList').innerHTML = topTen.map((m, i) => `
  <article class="card rank-item reveal">
    <div class="rank-num">${String(i + 1).padStart(2, '0')}</div>
    ${posterHTML(m)}
    <div>
      <div class="rank-title">
        <div>
          <h3>${m.title}</h3>
          <div class="rank-meta">${m.genre} &bull; ${m.year} &bull; ${m.votes} votes</div>
        </div>
        <span class="rating"><span class="imdb">IMDb</span> ${m.rating.toFixed(1)}</span>
      </div>
      <div class="bar"><i data-fill="${m.rating * 10}"></i></div>
      <div class="bar-label"><span>Community score</span><span>${(m.rating * 10).toFixed(0)}%</span></div>
    </div>
  </article>`).join('');

/* ---------- Movie of the month ---------- */
const motm = topTen[0];
document.getElementById('motmPoster').innerHTML = posterHTML(motm, 'MOVIE OF THE MONTH');
document.getElementById('motmTitle').textContent = motm.title;
document.getElementById('motmDesc').textContent = motm.desc;
document.getElementById('motmFacts').innerHTML = `
  <span>⭐ ${motm.rating.toFixed(1)} / 10</span>
  <span>🎭 ${motm.genre}</span>
  <span>📅 ${motm.year}</span>
  <span>👥 ${motm.votes} votes</span>`;

/* ---------- Animate rating bars when they scroll into view ---------- */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.fill + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.bar i').forEach(b => barObserver.observe(b));

/* ---------- Count-up statistics ---------- */
function countUp(el, target, suffix) {
  const duration = 1400, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + (suffix || '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target, Number(entry.target.dataset.count), entry.target.dataset.suffix);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

/* Reveal any elements added above */
refreshReveal();
