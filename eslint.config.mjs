import antfu from '@antfu/eslint-config'

export default antfu(
  {
    /* Modify antfu's config here */
    ignores: [
      'node_modules',
      'packages/**/node_modules',
      'packages/extension/.wxt',
      'packages/extension/.output',
    ],
  },
  // Flat configs:
  {
    rules: {
      'no-console': 'off',
      'vars-on-top': 'off',
    },
    files: [
      'scripts/**/*.mjs',
      'packages/web/**/*.ts',
      'packages/web/**/*.tsx',
    ],
  },
)
