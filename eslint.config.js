'use strict';

const js = require('@eslint/js');
const globals = require('globals');
const playwright = require('eslint-plugin-playwright');
const prettierConfig = require('eslint-config-prettier');

const playwrightRecommended = playwright.configs['flat/recommended'];

module.exports = [
  { ignores: ['node_modules/', 'test-results/', 'screenshots/'] },

  // All JS files — Node.js CommonJS
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      strict: ['error', 'global'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Playwright test files — add plugin, globals, and recommended rules
  {
    files: ['tests/**/*.js'],
    plugins: playwrightRecommended.plugins,
    languageOptions: {
      globals: {
        ...globals.node,
        ...playwrightRecommended.languageOptions.globals,
      },
    },
    rules: {
      ...playwrightRecommended.rules,
      // CLAUDE.md mandates waitForLoadState('networkidle') as the explicit wait strategy
      'playwright/no-networkidle': 'off',
    },
  },

  // Disable formatting rules that conflict with Prettier — must be last
  prettierConfig,
];
