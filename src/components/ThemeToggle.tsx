'use client';

/**
 * FR-G4, FR-AC11. One of only two client components on the site.
 *
 * `aria-pressed` carries the state, and the label is text rather than an icon
 * alone. No CSS transition on the change: a full-page repaint mid-transition
 * flashes (PRD section 10.7).
 */

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  // Starts undefined because the real value lives in the DOM attribute that
  // ThemeScript already set. Reading it during render would mismatch the
  // server-rendered HTML, so it is read in an effect instead.
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private browsing or a blocked storage API. The toggle still works for
      // this page view, it just will not persist, which is an acceptable
      // degradation.
    }
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className="badge tap-target cursor-pointer"
      // Before hydration the button has no state to report. Disabling it would
      // change the tab order between server and client HTML, so it stays
      // focusable and simply does nothing until the effect runs.
      aria-label={theme === undefined ? 'Toggle dark mode' : undefined}
    >
      <span aria-hidden="true">{isDark ? '◐' : '◑'}</span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
