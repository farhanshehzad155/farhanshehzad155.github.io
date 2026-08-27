/**
 * The signature element. PRD section 10.5, TRD section 6.5.
 *
 * A departure-board of verifiable facts under the hero (FR-H2). Every row is
 * fully present in the HTML; the staggered reveal is a CSS animation driven by
 * a per-row custom property, so with JavaScript disabled the strip is simply
 * there (NFR-9), and under `prefers-reduced-motion` every row appears at once
 * (FR-G5).
 *
 * A server component. It ships no JavaScript at all.
 */

import { ExternalLink } from './ExternalLink';

export interface ManifestRow {
  key: string;
  value: string;
  /** When present the value renders as an outbound link (Tier A evidence). */
  href?: string;
}

interface ManifestStripProps {
  rows: ManifestRow[];
  /** Accessible name for the list, since the rows are terse by design. */
  label?: string;
}

export function ManifestStrip({ rows, label = 'Verifiable facts' }: ManifestStripProps) {
  return (
    <dl aria-label={label} className="border-t border-[var(--border)]">
      {rows.map((row, index) => (
        <div
          key={row.key}
          className="manifest-row manifest-row--animated"
          style={{ '--row-index': index } as React.CSSProperties}
        >
          <dt className="manifest-row__key">{row.key}</dt>

          {/* Decorative. A screen reader would otherwise read the leader as a
              run of full stops between the label and its value. */}
          <span className="manifest-row__leader" aria-hidden="true" />

          <dd className="manifest-row__value m-0">
            {row.href ? (
              <ExternalLink href={row.href}>{row.value}</ExternalLink>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
