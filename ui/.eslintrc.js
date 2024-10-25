module.exports = {
  root: true,
  globals: {
    CatfishEditorCommunication: 'readonly',  // Declare it as a global variable
  },
  env: {
    node: true,
  },
  "ignorePatterns": ["**/node_modules/*", "**/dist/*"],
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
