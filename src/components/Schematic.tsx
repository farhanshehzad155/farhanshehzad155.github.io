/**
 * PRD section 10.6. One hand-authored SVG per automation case study.
 *
 * The SVG is inlined rather than referenced through `<img>` because it needs
 * the page's CSS variables to theme correctly in both light and dark.
 *
 * FR-AC4: a schematic without a text-equivalent summary is not accessible, so
 * `summary` is a required prop rather than an optional one. The component
 * cannot be used incorrectly.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface SchematicProps {
  /** Path under /public, e.g. '/schematics/cv-anonymization.svg'. */
  src: string;
  /** Short accessible name, becomes the SVG <title>. */
  title: string;
  /** Text equivalent, rendered visibly beneath the diagram. Required. */
  summary: string;
}

export function Schematic({ src, title, summary }: SchematicProps) {
  const markup = readSvg(src);

  if (!markup) {
    // A missing schematic must not break the page or silently render a gap.
    // The summary alone still conveys the architecture, which is the point of
    // requiring it.
    return (
      <figure className="my-8">
        <figcaption className="text-sm text-[var(--muted)]">{summary}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="my-8">
      <div
        role="img"
        aria-label={title}
        className="surface p-4 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <figcaption className="mt-3 text-sm text-[var(--muted)] prose-measure">
        {summary}
      </figcaption>
    </figure>
  );
}

/**
 * Read at render time, which under static export means build time. There is no
 * runtime filesystem access in the deployed site.
 */
function readSvg(src: string): string | null {
  try {
    return readFileSync(join(process.cwd(), 'public', src.replace(/^\//, '')), 'utf8');
  } catch {
    return null;
  }
}
