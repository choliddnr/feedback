import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // TypeScript rules
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  }
);
