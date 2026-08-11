/// <reference types="vitest/config" />
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

export default defineConfig({
	optimizeDeps: {
		include: ["vue/server-renderer"],
	},
	test: {
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }],
			headless: true,
		},
	},
});
