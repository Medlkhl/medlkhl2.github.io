import { colors } from '../styles/tokens.ts';
import { PREF_KEYS, PREFS_EVENT } from './prefs.ts';

/** Browser-bar colour per theme: the page background, mirrored from tokens.ts. */
const THEME_COLOR = { graphite: colors.graphite.bg, paper: colors.paper.bg };

/**
 * Inline script for <head>. It runs before first paint so the page never
 * flashes the wrong theme, and re-runs after every ClientRouter swap (the new
 * document's <html> arrives without our data attributes) and on every
 * `prefs:change`. It mirrors the rules in prefs.ts; the keys are imported from
 * there so they cannot drift. It also points the theme-color metas (which must
 * come before it in <head>) at the active theme; without JavaScript their
 * media pair follows the system.
 */
export const themeScript = `(() => {
  const root = document.documentElement;
  const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const query = (q) => window.matchMedia(q);
  const themeColor = ${JSON.stringify(THEME_COLOR)};
  const apply = () => {
    const theme = read(${JSON.stringify(PREF_KEYS.theme)});
    root.dataset.theme = theme === 'graphite' || theme === 'paper'
      ? theme
      : query('(prefers-color-scheme: light)').matches ? 'paper' : 'graphite';
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.removeAttribute('media');
      meta.setAttribute('content', themeColor[root.dataset.theme]);
    });
    const motion = read(${JSON.stringify(PREF_KEYS.motion)});
    root.dataset.motion = motion === 'full' || motion === 'reduced'
      ? motion
      : query('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
    const connection = navigator.connection;
    root.dataset.saveData = (connection && connection.saveData === true)
      || query('(prefers-reduced-data: reduce)').matches ? 'on' : 'off';
    root.setAttribute('data-3d', 'off');
    root.classList.remove('no-js');
    root.classList.add('js');
  };
  apply();
  document.addEventListener('astro:after-swap', apply);
  document.addEventListener(${JSON.stringify(PREFS_EVENT)}, apply);
  query('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (!read(${JSON.stringify(PREF_KEYS.theme)})) apply();
  });
})();`;
