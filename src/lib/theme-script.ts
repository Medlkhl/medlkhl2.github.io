import { PREF_KEYS } from './prefs.ts';

/**
 * Inline script for <head>. It runs before first paint so the page never
 * flashes the wrong theme, and re-runs after every ClientRouter swap (the new
 * document's <html> arrives without our data attributes). It mirrors the rules
 * in prefs.ts; the keys are imported from there so they cannot drift.
 */
export const themeScript = `(() => {
  const root = document.documentElement;
  const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const query = (q) => window.matchMedia(q);
  const apply = () => {
    const theme = read(${JSON.stringify(PREF_KEYS.theme)});
    root.dataset.theme = theme === 'graphite' || theme === 'paper'
      ? theme
      : query('(prefers-color-scheme: light)').matches ? 'paper' : 'graphite';
    const motion = read(${JSON.stringify(PREF_KEYS.motion)});
    root.dataset.motion = motion === 'full' || motion === 'reduced'
      ? motion
      : query('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
    root.setAttribute('data-3d', 'off');
    root.classList.remove('no-js');
    root.classList.add('js');
  };
  apply();
  document.addEventListener('astro:after-swap', apply);
  query('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (!read(${JSON.stringify(PREF_KEYS.theme)})) apply();
  });
})();`;
