// Fade between portfolio pages while keeping normal links and Flask routes.
const portfolioPages = ['/', '/about', '/skills', '/projects', '/contact'];
let pageNavigationTimer;

document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');

  // Keep new tabs, downloads, and reduced-motion navigation immediate.
  if (!link || event.defaultPrevented || event.button !== 0 ||
      event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
      link.hasAttribute('download') || (link.target && link.target !== '_self') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin ||
      !portfolioPages.includes(destination.pathname) ||
      (destination.pathname === window.location.pathname &&
       destination.search === window.location.search)) {
    return;
  }

  event.preventDefault();
  window.clearTimeout(pageNavigationTimer);
  document.body.classList.add('page-leaving');

  // Match the 160 ms exit animation in style.css.
  pageNavigationTimer = window.setTimeout(() => {
    window.location.assign(destination.href);
  }, 160);
});

// A page restored with Back/Forward must be visible again.
window.addEventListener('pageshow', () => {
  window.clearTimeout(pageNavigationTimer);
  document.body.classList.remove('page-leaving');
});

window.addEventListener('pagehide', () => {
  window.clearTimeout(pageNavigationTimer);
});
