import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/**
 * Static export to GitHub Pages. See TRD section 3.3.
 *
 * There is no `basePath`: this deploys to a GitHub *user site*
 * (farhanshehzad155.github.io), which serves from the domain root. See ADR-007.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // ADR-008. Pages resolves `/work/` to `work/index.html`, but will not rewrite
  // an extensionless path to a sibling `.html`. Without this, every route 404s
  // on a hard refresh.
  trailingSlash: true,

  // `next/image` optimisation needs a server. Images are pre-optimised at build
  // time instead (TRD section 10.2).
  images: { unoptimized: true },

  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // A lint or type failure must fail the build, not warn and ship.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: { className: 'heading-anchor' },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
