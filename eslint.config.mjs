/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    {
        // Ігноруємо збірки, next і TS/TSX
        ignores: [
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            "node_modules/**",
            "**/*.ts",
            "**/*.tsx",
        ],
    },
    {
        // Лінтимо тільки звичайні JS/JSX, якщо вони є
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            // Можеш додати правила, якщо хочеш
        },
    },
];
