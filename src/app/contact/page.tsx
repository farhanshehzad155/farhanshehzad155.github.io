/**
 * Contact. PRD section 8.8.
 *
 * FR-CT1: direct channels first. The form is a convenience, not the primary
 * path, and the page is laid out to say so.
 *
 * FR-CT2/CT3/CT4 (the form itself) are P1 and are not wired up here, because
 * the provider decision is open (TRD section 18, T2). Shipping a form that
 * posts nowhere would be worse than shipping the direct channels alone, so the
 * page states plainly that email is the route and the form follows.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { CopyEmail } from '@/components/CopyEmail';
import { ExternalLink } from '@/components/ExternalLink';
import { contactResponseExpectation, siteConfig } from '@/content/site';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: PAGE_DESCRIPTIONS.contact,
  path: '/contact/',
  ogImage: '/og/contact.png',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-16">
      <h1>Contact</h1>

      <p className="mt-6 prose-measure text-[length:var(--text-md)]">
        Email is the fastest way to reach me. {contactResponseExpectation}
      </p>

      {/* FR-CT8: the address is plain selectable text. With JavaScript
          unavailable the copy button does nothing, and the address is still
          right there. */}
      <section aria-labelledby="direct-heading" className="mt-10">
        <h2 id="direct-heading" className="mono text-[var(--muted)]">
          Direct
        </h2>

        <p className="mt-4 flex flex-wrap items-center gap-3 text-[length:var(--text-md)]">
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <CopyEmail email={siteConfig.email} />
        </p>

        <ul className="list-none p-0 mt-4 m-0 flex flex-wrap gap-6">
          {siteConfig.socials.map((social) => (
            <li key={social.url}>
              <ExternalLink href={social.url}>{social.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="what-heading" className="mt-12 prose-measure">
        <h2 id="what-heading">What to send</h2>
        <p className="mt-4">
          If you are hiring, the <Link href="/resume/">résumé</Link> is on this site rather than
          behind a download. It prints cleanly if you need a file.
        </p>
        <p className="mt-4">
          If you are looking for contract help, tell me what the manual process currently costs
          you — roughly how many hours, and who is doing them — and I will tell you whether it is
          worth automating. Sometimes the answer is no.
        </p>
      </section>

      {/*
        FR-CT2, FR-CT3, FR-CT4, FR-CT5, FR-CT6 — the form.
        Blocked on TRD T2 (Web3Forms or Formspree). When the provider is chosen:
          - a real <form method="POST" action="..."> so it works without JS
          - honeypot field hidden with CSS, not type="hidden"
          - time-to-submit threshold via a rendered-at timestamp
          - aria-describedby error association, aria-live announcement
          - failure state exposes this email address as the fallback
      */}
    </div>
  );
}
