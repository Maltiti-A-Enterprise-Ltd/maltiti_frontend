import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import nextPlugin from '@next/eslint-plugin-next';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Additional ignores
    'node_modules/**',
    'dist/**',
    '.cache/**',
    'public/**',
    '**/*.config.js',
    '**/*.config.mjs',
    '**/*.config.ts',
    '.eslintrc.js',
    '.prettierrc.js',
    'postcss.config.mjs',
    'jest.config.ts',
    'tailwind.config.js',
    'app/api/**',
  ]),
  // Additional rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/incompatible-library': 'off',
      'arrow-body-style': 'error',
      curly: 'error',
      'no-else-return': 'error',
      'no-useless-return': 'error',
      'no-useless-catch': 'error',
      'no-unreachable': 'error',
      'no-duplicate-imports': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['error'],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*Slice.ts', '**/*Thunk.ts', '**/store.ts'],
    rules: {
      'import/no-cycle': 'off',
    },
  },
  {
    files: ['components/ui/**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
]);

export default eslintConfig;
