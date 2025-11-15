import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@src": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    testTimeout: 0,
    environment: "jsdom",
    setupFiles: ["./__tests__/config/setup.js"],
    globals: true,
    include: ["__tests__/**/*.test.jsx"],
    exclude: ["node_modules", ".next", "cypress", "public", "package*"],
    deps: {
      optimizer: {
        web: { include: ["@mui/material", "@mui/system", "@mui/icons-material", "@emotion/react", "@emotion/styled"] },
      },
    },
  },
});
