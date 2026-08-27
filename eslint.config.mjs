import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:jsx-a11y/recommended'),
  {
    rules: {
      // PRD section 17: no `any` in application code.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // FR-G6 is enforced by the ExternalLink component; this catches anyone
      // who bypasses it.
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'src/generated/**', 'next-env.d.ts'],
  },
];

export default config;
