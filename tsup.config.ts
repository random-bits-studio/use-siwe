import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/next/index.ts", "src/express/index.tsx"],
  splitting: false,
  sourcemap: true,
  dts: true,
  minify: true,
  format: ["esm", "cjs"],
});
