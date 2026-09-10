// Apply the saved theme before the first paint. Storage may be unavailable.
try {
  const theme = localStorage.getItem('allen-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch (_) { /* Keep the default theme. */ }
