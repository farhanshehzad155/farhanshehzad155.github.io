/**
 * FR-G6. Every outbound link goes through here.
 *
 * A single choke point means `rel="noopener noreferrer"` and the
 * "opens in a new tab" hint cannot be forgotten on one link out of forty. The
 * ESLint rule `react/jsx-no-target-blank` catches anyone who bypasses it.
 */

import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'rel'> {
  href: string;
  children: ReactNode;
  /** Suppress the arrow glyph where the surrounding design carries the cue. */
  showIndicator?: boolean;
}

export function ExternalLink({
  href,
  children,
  showIndicator = true,
  className,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? `tap-target ${className}` : 'tap-target'}
      {...rest}
    >
      {children}
      {showIndicator ? (
        <span aria-hidden="true" className="ml-1">
          ↗
        </span>
      ) : null}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
