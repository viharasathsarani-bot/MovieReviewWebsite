/* ==========================================================================
   Contact page - form validation, success message and the FAQ accordion
   ========================================================================== */

const contactForm = document.getElementById('contactForm');
const successBox = document.getElementById('successBox');

/* ---------- Validation helpers ---------- */
function fieldOf(id) { return document.getElementById(id).closest('.field'); }
function fail(id, message) {
  const f = fieldOf(id);
  f.classList.add('invalid');
  f.querySelector('.error-msg').textContent = message;
}
function pass(id) { fieldOf(id).classList.remove('invalid'); }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validate a single field; returns true when valid. */
function validateField(id) {
  const value = document.getElementById(id).value.trim();
  switch (id) {
    case 'cName':
      if (value.length < 3) { fail(id, 'Please enter your full name (min 3 characters).'); return false; }
      break;
    case 'cEmail':
      if (!EMAIL_RE.test(value)) { fail(id, 'Enter a valid email address, e.g. you@mail.com.'); return false; }
      break;
    case 'cSubject':
      if (value.length < 4) { fail(id, 'Subject must be at least 4 characters.'); return false; }
      break;
    case 'cMessage':
      if (value.length < 20) { fail(id, 'Tell us a bit more (min 20 characters).'); return false; }
      break;
  }
  pass(id);
  return true;
}

/* Live validation as the user leaves / edits a field */
['cName', 'cEmail', 'cSubject', 'cMessage'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', () => validateField(id));
  el.addEventListener('input', () => { if (fieldOf(id).classList.contains('invalid')) validateField(id); });
});

/* ---------- Submit ---------- */
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const results = ['cName', 'cEmail', 'cSubject', 'cMessage'].map(validateField);
  if (results.includes(false)) {
    showToast('Message not sent', 'Please fix the highlighted fields.', true);
    return;
  }
  const name = document.getElementById('cName').value.trim();
  contactForm.reset();
  successBox.innerHTML = `<strong>Thanks ${name}, your message is on its way!</strong>
    <span>Our team replies within one business day.</span>`;
  successBox.style.display = 'flex';
  showToast('Message sent!', 'We have received your message.');
  successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* ---------- FAQ accordion (one panel open at a time) ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const panel = item.querySelector('.faq-a');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});
