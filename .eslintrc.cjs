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
    // "next/no-img-element": "error",
    'react/function-component-definition': [
      'error',
      {
        'namedComponents': 'function-declaration'
      }
    ],
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
