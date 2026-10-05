'use strict';
// Apply before styles load, so returning visitors never see the wrong theme flash.
(() => {
  const root = document.documentElement;
  const key = 'jk-portfolio-theme';
  const requested = new URLSearchParams(location.search).get('theme');
  let stored;
  try { stored = localStorage.getItem(key); } catch { /* Storage may be unavailable. */ }
  const valid = value => value === 'light' || value === 'dark';
  function apply(theme, persist = false) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f3f4ed' : '#111311';
    const button = document.querySelector('#theme-toggle');
    if (button) {
      const next = theme === 'light' ? '暗色' : '亮色';
      button.setAttribute('aria-label', `切换至${next}`);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      document.querySelector('#theme-label').textContent = next;
    }
    if (persist) {
      try { localStorage.setItem(key, theme); } catch { /* Theme still works without storage. */ }
      // A shared theme link chooses the initial look; a subsequent choice survives reload.
      if (valid(requested)) {
        const url = new URL(location.href);
        url.searchParams.delete('theme');
        history.replaceState(history.state, '', url);
      }
    }
    window.dispatchEvent(new CustomEvent('portfolio-theme-change', { detail: { theme } }));
  }
  apply(valid(requested) ? requested : valid(stored) ? stored : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('#theme-toggle').addEventListener('click', () => {
      apply(root.dataset.theme === 'light' ? 'dark' : 'light', true);
    });
  }, { once: true });
})();
