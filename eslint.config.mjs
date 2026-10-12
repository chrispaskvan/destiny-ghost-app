import globals from 'globals';
import js from '@eslint/js';
import security from 'eslint-plugin-security';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      security: security,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Registers the astro plugin and astro-eslint-parser for .astro files.
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        Astro: 'readonly',
        console: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
      },
    },
  },
];
