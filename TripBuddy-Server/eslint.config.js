import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettierConfig,
    ...tseslint.configs.strict,
    {
        files: ['**/*.ts']
    },
    { ignores: ['**/*.js'] },
    {
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            '@typescript-eslint': tsEslintPlugin,
        },
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'off'
        },
    },
    prettierPlugin
];