(() => {
  const editions = { blueprint: '#193eb8', fieldnotes: '#f4efe3' };
  const key = 'jk-portfolio-theme';
  const valid = value => Object.hasOwn(editions, value);
  function themeFromLocation() {
    const requested = new URLSearchParams(location.search).get('theme');
    if (requested) return valid(requested) ? requested : 'blueprint';
    let saved;
    try { saved = localStorage.getItem(key); } catch {}
    return valid(saved) ? saved : 'blueprint';
  }

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = editions[theme];
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
    window.dispatchEvent(new CustomEvent('portfolio-theme-change', {detail: {theme}}));
  }
  apply(themeFromLocation());
  window.addEventListener('popstate', () => apply(themeFromLocation()));
  document.addEventListener('DOMContentLoaded', () => {
    apply(themeFromLocation());
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.dataset.themeChoice;
        apply(theme);
        try { localStorage.setItem(key, theme); } catch {}
        const url = new URL(location.href);
        url.searchParams.set('theme', theme);
        history.replaceState(history.state, '', url);
      });
    });
  }, {once: true});
})();
