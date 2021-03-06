module.exports = {
  root: true,
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    }
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ["lib/**"],
  rules: {
    '@typescript-eslint/lines-between-class-members': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/type-annotation-spacing': ['error'],
    'linebreak-style': 'off',
    'max-len': 'off'
  }
};