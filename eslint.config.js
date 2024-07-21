import ks from "eslint-config-ks";

export default ks(
  {
    prettier: true,
    json: true,
    typescript: true,
    project: ["tsconfig.json"],
  },
  [
    {
      ignores: ["src/utils/dbSchemaParser.ts"],
      files: ["src/**/*.ts"],
      rules: {
        "prettier/prettier": "warn",
        "security/detect-object-injection": "off",
        "import/no-named-as-default-member": "off",
        "max-depth": ["error", 6],
        "unicorn/prefer-ternary": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            ignoreRestSiblings: true,
          },
        ],
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "unicorn/no-await-expression-member": "warn",
        "unicorn/no-null": "off",
        "@typescript-eslint/naming-convention": [
          "warn",
          {
            format: ["PascalCase"],
            trailingUnderscore: "allow",
            selector: "typeLike",
          },
        ],
      },
    },
  ],
);
