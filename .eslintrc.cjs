module.exports = {
  root: true,
  "extends": [
    'eslint:recommended',
    "plugin:@typescript-eslint/recommended",
    "next",
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": [
    "prettier",
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/function-component-definition": "off",
    "prefer-const": "off",
    "no-extra-boolean-cast": "off",
    "@next/next/no-img-element": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
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
  "env": { "browser": true, "es2020": true },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 'latest',
    "sourceType": 'module',
    "project": ['./tsconfig.json'],
    "tsconfigRootDir": __dirname,
  },
  "ignorePatterns": [
    "build",
    ".eslintrc.json",
    ".prettierrc.js",
    "src/components",
    "src/hooks",
    "src/core",
    "src/common",
    "src/assets",
  ]
}
