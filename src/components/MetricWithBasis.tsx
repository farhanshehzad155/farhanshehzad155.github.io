/**
 * PRD section 6.4. The component that makes the evidence policy visible.
 *
 * Every Tier B/C number renders with its basis attached, in a `<details>`
 * disclosure so the note is readable with JavaScript disabled (NFR-9) and
 * reachable by keyboard.
 *
 * It also throws when handed a `measured` or `counted` metric without a basis.
 * Under static export a throw in a server component fails the build, so the
 * render path enforces the same rule as the validator and neither can be
 * circumvented by editing around the other (TRD section 6.7).
 */

import type { Metric } from '@/content/schema';
import { ExternalLink } from './ExternalLink';

interface MetricWithBasisProps {
  metric: Metric;
  /** Stable id fragment for the footnote marker, usually the case study slug. */
  idPrefix: string;
  index: number;
}

const TIER_LABEL: Record<Metric['tier'], string> = {
  verifiable: 'Verifiable',
  measured: 'Measured, first-party',
  counted: 'Counted, first-party',
  capability: 'Capability',
};

export function MetricWithBasis({ metric, idPrefix, index }: MetricWithBasisProps) {
  const needsBasis = metric.tier === 'measured' || metric.tier === 'counted';

  if (needsBasis && !metric.basis?.trim()) {
    throw new Error(
      `MetricWithBasis: "${metric.label}" is tier '${metric.tier}' with no basis. ` +
        'PRD section 6.4 requires every measured or counted claim to state what was sampled, ' +
        'the before and after values, the period, and that it is a first-party measurement. ' +
        "Supply a basis, or drop the number and use tier 'capability'.",
    );
  }

  if (metric.tier === 'verifiable' && !metric.evidenceUrl) {
    throw new Error(
      `MetricWithBasis: "${metric.label}" is tier 'verifiable' with no evidenceUrl. ` +
        'Tier A means a visitor can confirm the claim themselves, which requires the link.',
    );
  }

  const noteId = `${idPrefix}-basis-${index}`;
  const hasValue = metric.value.trim().length > 0;

  return (
    <div className="py-4 border-b border-[var(--border)] last:border-b-0">
      <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {hasValue ? (
          <strong className="text-[length:var(--text-xl)] leading-none font-semibold">
            {metric.value}
          </strong>
        ) : null}
        <span>{metric.label}</span>
      </p>

      {/* FR-AC5: the tier is stated in text, never signalled by colour alone. */}
      <p className="mono m-0 mt-2 text-[var(--muted)]">
        {TIER_LABEL[metric.tier]}
        {metric.evidenceUrl ? (
          <>
            {' · '}
            <ExternalLink href={metric.evidenceUrl}>Evidence</ExternalLink>
          </>
        ) : null}
      </p>

      {metric.basis ? (
        <details className="metric-basis" id={noteId}>
          <summary>How this was measured</summary>
          <p className="m-0 mt-2">{metric.basis}</p>
        </details>
      ) : null}
    </div>
  );
}
