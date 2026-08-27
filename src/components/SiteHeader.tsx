/**
 * PRD section 7.2. Wordmark left, navigation right.
 *
 * No hamburger above 640px, and none below it either: four links wrap onto a
 * second line on a narrow screen, which is simpler than a disclosure menu and
 * has no JavaScript, no focus trap, and nothing to get wrong for a screen
 * reader.
 */

import Link from 'next/link';

import { siteConfig } from '@/content/site';
import { NAV_LINKS } from '@/lib/constants';
import { ThemeToggle } from './ThemeToggle';

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="heading-anchor font-semibold text-[length:var(--text-md)]">
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-4 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="tap-target">
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
