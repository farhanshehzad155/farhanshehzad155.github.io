/**
 * FR-G8. Reflects a single boolean in site config.
 *
 * Renders nothing when `available` is false. That is deliberate: an
 * "unavailable" chip is noise, and a stale "open to work" chip is worse than no
 * chip at all, so the honest default is silence.
 */

import { siteConfig } from '@/content/site';

export function AvailabilityChip() {
  if (!siteConfig.available) return null;

  return (
    <p className="badge badge--live m-0">
      <span className="visually-hidden">Availability: </span>
      {siteConfig.availabilityNote}
    </p>
  );
}
