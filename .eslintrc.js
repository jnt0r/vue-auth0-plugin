module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        '@vue/standard',
        // '@vue/airbnb',
        '@vue/typescript/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'max-len': [ 'error', { code: 120, tabWidth: 4 } ],
        indent: [ 'error', 4 ],
        // semi: [ 'error', 'always' ],
        semi: 'off',
        '@typescript-eslint/semi': [ 'error' ],
        quotes: [ 'error', 'single' ],
        'quote-props': [ 'error', 'as-needed' ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'no-trailing-spaces': [ 'error' ],
        'arrow-parens': [ 'error', 'always' ],
        'no-mixed-spaces-and-tabs': 'error',
        'no-extra-semi': 'error',
        'eol-last': [ 'error', 'always' ],
        'no-multiple-empty-lines': [ 2, { max: 2, maxEOF: 0 } ],
    },
};
