/**
 * FR-G4. Sets the theme before first paint, so there is no flash of the wrong
 * one.
 *
 * Inlined rather than imported: an external module would be fetched after the
 * first paint, which is exactly the flash the requirement forbids. Being inline
 * means it needs a CSP hash rather than `unsafe-inline` — see TRD section 13.2
 * and the note in `layout.tsx`.
 *
 * Kept deliberately tiny and dependency-free. It runs on every page load before
 * anything renders, so it is the one piece of JavaScript that is on the
 * critical path.
 */

const script = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

/** Exported so the CSP hashing step and the tests read the same string. */
export const THEME_SCRIPT_SOURCE = script;
