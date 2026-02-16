import js from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		ignores: ["dist/**", "node_modules/**", "generated/**", "**/generated", "prisma.config.ts"],
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// Starter rules (safe defaults)
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
]
