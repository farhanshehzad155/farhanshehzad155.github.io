'use client';

/**
 * FR-G9, FR-AC7. The second and last client component.
 *
 * The address itself is rendered as plain selectable text by the caller, so
 * with JavaScript unavailable a visitor can still read and copy it by hand
 * (FR-CT8). This button is a convenience layered on top, never the only path.
 */

import { useEffect, useRef, useState } from 'react';

interface CopyEmailProps {
  email: string;
  /** Analytics event name, fired only if an analytics provider is configured. */
  eventName?: string;
}

export function CopyEmail({ email }: CopyEmailProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
    } catch {
      // Clipboard access can be denied, or unavailable outside a secure
      // context. Say so rather than claiming a copy that did not happen.
      setStatus('failed');
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus('idle'), 3000);
  }

  return (
    <>
      <button type="button" onClick={copy} className="badge tap-target cursor-pointer">
        Copy email
      </button>

      {/* FR-AC7: the confirmation is announced, not merely shown. */}
      <span role="status" aria-live="polite" className="ml-2 text-sm">
        {status === 'copied' ? 'Email copied to clipboard.' : null}
        {status === 'failed' ? `Could not copy. The address is ${email}.` : null}
      </span>
    </>
  );
}
