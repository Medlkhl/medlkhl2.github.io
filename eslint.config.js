import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'reports/',
      'playwright-report/',
      'test-results/',
      '.lighthouseci/',
      'docs/screenshots/',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  astro.configs['jsx-a11y-recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      // role="list" on styled lists is deliberate: Safari/VoiceOver drops list semantics with list-style: none.
      'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
      // A scrolling region (role="region" plus a label) must take focus so keyboards can scroll it.
      'astro/jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['tabpanel', 'region'] },
      ],
    },
  },
  {
    // Inline `is:inline` scripts are plain browser JS.
    files: ['**/*.astro/*.js', '*.astro/*.js'],
    rules: { '@typescript-eslint/consistent-type-imports': 'off' },
  },
);
