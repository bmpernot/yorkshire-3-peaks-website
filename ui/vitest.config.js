import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/test/setup.js"],
    globals: true,
    include: ["tests/__tests__/*.test.jsx"],
  },
});
