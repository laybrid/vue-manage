module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'array-callback-return': 'error',
    'no-await-in-loop': 'error',
    'no-duplicate-imports': 'error',
    'no-inner-declarations': 'error',
    'no-promise-executor-return': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    // 'no-useless-assignment': 'warn' eslint version 9xxx,
    'new-cap': 'error',
    'prefer-const': 'error',
    'vue/multi-word-component-names': 'off'
  }
}
