import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    pool: "forks",
    testTimeout: 300000,
    hookTimeout: 300000,
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/experimental/**", "node_modules/**", "lib/**", "dist/**"]
  }
});
