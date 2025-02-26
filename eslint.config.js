module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['eslint.config.js', 'dist/', 'node_modules/'],
    rules: {
        "eqeqeq": ["error", "always"],
        "no-console": ["warn", { "allow": ["warn", "error"] }],
        "no-debugger": "error",
        "no-duplicate-imports": "error",
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "no-var": "error",
        "consistent-return": "error",
        "no-magic-numbers": ["warn", { "ignore": [0, 1] }],
        "import/no-unused-modules": ["error", { "unusedExports": true }],
        "prettier/prettier": "error",
        "no-empty-function": ["warn", { "allow": ["arrowFunctions", "functions"] }]
    },
};
