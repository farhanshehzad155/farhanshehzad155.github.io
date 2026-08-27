/**
 * Privacy note. FR-P1, FR-AN2.
 *
 * Short and specific. The claim that no consent banner is needed only holds if
 * the page can say exactly why, so it does.
 */

import type { Metadata } from 'next';

import { siteConfig } from '@/content/site';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy',
  description: PAGE_DESCRIPTIONS.privacy,
  path: '/privacy/',
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-16 prose-measure">
      <h1>Privacy</h1>

      <h2 className="mt-10">Analytics</h2>
      <p className="mt-3">
        This site currently runs no analytics at all. If that changes it will be a cookieless,
        privacy-first provider that collects no personal data and sets no cookies, and this page
        will name it before it is switched on.
      </p>

      <h2 className="mt-10">Cookies</h2>
      <p className="mt-3">
        None are set. Your theme preference is stored in your own browser using localStorage,
        which never leaves your device and is not sent to any server. That is why there is no
        consent banner on this site: there is nothing to consent to.
      </p>

      <h2 className="mt-10">The contact form</h2>
      <p className="mt-3">
        There is no form yet. Email me directly at{' '}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and the message reaches my
        inbox with nothing in between. When a form is added, this section will name the provider
        and say what they receive and how long messages are kept.
      </p>

      <h2 className="mt-10">Hosting</h2>
      <p className="mt-3">
        The site is static files served by GitHub Pages. GitHub processes request logs, including
        IP addresses, under its own privacy statement as part of serving the page. I do not have
        access to those logs.
      </p>

      <h2 className="mt-10">Third parties</h2>
      <p className="mt-3">
        None. No embedded fonts from a font CDN, no maps, no videos, no chat widget, no
        third-party scripts. Fonts are downloaded when the site is built and served from this
        domain, so loading a page contacts no one else.
      </p>
    </div>
  );
}
