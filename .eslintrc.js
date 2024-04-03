module.exports = {
    env: {
        browser: true,
        es2020: true
    },
    extends: [
        "standard-with-typescript",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "next",
        "next/core-web-vitals",
        "prettier"
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                ".eslintrc.{js,cjs}"
            ],
            parserOptions: {
                sourceType: "script"
            }
        }
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
    },
    plugins: [
        "react",
        "prettier",
    ],
    rules: {
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/promise-function-async": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "off",

        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/function-component-definition": "off",
        "prefer-const": "off",
        "no-extra-boolean-cast": "off",
        "@next/next/no-img-element": "error",
        "react-hooks/rules-of-hooks": "off",
        "@next/next/inline-script-id": "off",
        'react/function-component-definition': "off",
        // [
        // 'error',
        // {
        //   'namedComponents': 'function-declaration'
        // }
        // ],
        "no-restricted-imports": ["error", {
            "paths": ["@mui/material", "!@mui/material/*"], 
            "patterns": ["@mui/material/[a-zA-Z]+"] 
        }]
    },
    ignorePatterns: [
        "build",
        ".eslintrc.json",
        ".prettierrc.js",
        "src/components",
        "src/hooks",
        "src/core",
        "src/common",
        "src/assets",
        "src/pages/builder",
    ],
    settings: {
        react: {
            pragma: "React",
            fragment: "Fragment",
            version: "detect",
        },
        linkComponents: [
          // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
          {name: "Link", linkAttribute: ["to", "href"]}, // allows specifying multiple properties if necessary
        ]
    }
}
