/**
 * Rule C2 and rule CV-5: no end client of an agency engagement is named
 * anywhere on the site, and the build fails if one appears.
 *
 * ---------------------------------------------------------------------------
 * Read this before adding an entry.
 *
 * This repository is PUBLIC. Putting a client name in this file to stop it
 * appearing on the site would publish it in the repository instead, which is
 * the same disclosure through a different door.
 *
 * So: add a name here only if it is already public knowledge and the concern is
 * accidental use in copy. For genuinely confidential client names, the correct
 * mechanism is a local, gitignored file read by the validator at author time.
 * That is not wired up yet, and the note exists so nobody reaches for the
 * convenient wrong option.
 * ---------------------------------------------------------------------------
 *
 * Names PERMITTED on the site by rule C1, and therefore never listed here:
 * Expinder, LeadForge, Proglo World, Karmic Seed, Sadabyte,
 * University of Gujrat, University of the Punjab (PUCIT).
 */

export const denylist: string[] = [
  // Intentionally empty. See the note above.
];

/**
 * Phrases that signal an end client is about to be named, or that a claim is
 * drifting away from the evidence policy. These produce warnings, not errors.
 */
export const cautionPhrases: string[] = [
  'spearheaded',
  'orchestrated',
  'revolutionised',
  'revolutionized',
  'cutting-edge',
  'seamless',
  'leveraged',
  'best-in-class',
  'game-changing',
];
