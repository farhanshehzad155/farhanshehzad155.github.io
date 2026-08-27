/**
 * Required by @next/mdx under the App Router. Next resolves MDX's provider
 * import to this file, which keeps the whole MDX pipeline inside server
 * components — the `@mdx-js/react` context provider is not usable from an RSC,
 * and this is the supported way around that.
 *
 * It is also the one place to style MDX output, since the approach bodies emit
 * bare HTML elements with no class names of their own.
 */

import type { MDXComponents } from 'mdx/types';

import { ExternalLink } from '@/components/ExternalLink';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Case study bodies start at h3: the page owns h1 and the section headings
    // own h2, so an h2 here would break the outline (FR-SEO9, FR-AC3).
    h1: ({ children }) => <h3 className="mt-8">{children}</h3>,
    h2: ({ children }) => <h3 className="mt-8">{children}</h3>,
    h3: ({ children }) => <h3 className="mt-8">{children}</h3>,
    p: ({ children }) => <p className="mt-4">{children}</p>,
    ul: ({ children }) => <ul className="mt-4">{children}</ul>,
    a: ({ href, children }) => {
      const target = typeof href === 'string' ? href : '';
      return target.startsWith('http') ? (
        <ExternalLink href={target}>{children}</ExternalLink>
      ) : (
        <a href={target}>{children}</a>
      );
    },
    ...components,
  };
}
