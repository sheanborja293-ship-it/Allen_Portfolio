const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeToggle = document.querySelector('.theme-toggle');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeToggle.querySelector('i').className = `bi bi-${dark ? 'sun' : 'moon'}`;
}
updateThemeButton();
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('allen-theme', theme); } catch (_) { /* Optional persistence. */ }
  updateThemeButton();
});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.nav')) closeMenu(); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const backTop = document.querySelector('.back-top');
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  backTop.classList.toggle('shown', window.scrollY > 500);
  const length = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${length > 0 ? window.scrollY / length * 100 : 0}%`;
}
window.addEventListener('scroll', updateScroll, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !reducedMotion) {
  document.body.classList.add('js-reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
const typedRole = document.querySelector('#typed-role');
if (typedRole && !reducedMotion) {
  const roles = ['Web Developer', 'Software Developer', 'IT Student'];
  let role = 0;
  let position = roles[0].length;
  let deleting = true;
  function typeRole() {
    const text = roles[role];
    position += deleting ? -1 : 1;
    typedRole.textContent = text.slice(0, position);
    let delay = deleting ? 45 : 85;
    if (position === 0) { deleting = false; role = (role + 1) % roles.length; delay = 300; }
    if (!deleting && position === roles[role].length) { deleting = true; delay = 2500; }
    window.setTimeout(typeRole, delay);
  }
  window.setTimeout(typeRole, 2800);
}
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    if (!contactForm.checkValidity()) return;
    event.preventDefault();
    const fields = new FormData(contactForm);
    const name = fields.get('name').trim();
    const email = fields.get('email').trim();
    const subject = fields.get('subject').trim();
    const message = fields.get('message').trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${contactForm.dataset.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let count = 0;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = button.dataset.filter === 'All' || card.dataset.categories.split(' ').includes(button.dataset.filter);
      card.hidden = !show;
      card.classList.remove('filter-enter');
      if (show) {
        count++;
        card.classList.add('visible');
        requestAnimationFrame(() => card.classList.add('filter-enter'));
      }
    });
    document.querySelector('.project-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
  });
});
// Read each project's details directly from its HTML card.
const dialog = document.querySelector('#project-dialog');
if (dialog) {
dialog.setAttribute('aria-labelledby', 'dialog-title');
document.querySelectorAll('.open-project').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    document.querySelector('#dialog-title').textContent = card.querySelector('h3').textContent;
    document.querySelector('#dialog-description').textContent = card.querySelector('p').textContent;

    const dialogTech = document.querySelector('#dialog-tech');
    dialogTech.replaceChildren();
    card.querySelectorAll('.tags span').forEach(tech => {
      const tag = document.createElement('span');
      tag.textContent = tech.textContent;
      dialogTech.appendChild(tag);
    });

    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
} });
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
}
