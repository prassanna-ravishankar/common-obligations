import { defineConfig } from "astro/config";
import { hairline } from "./hairline/vite-plugin.mjs";

export default defineConfig({
  site: "https://commonobligations.org",
  output: "static",
  trailingSlash: "always",
  build: { inlineStylesheets: "never", format: "directory" },
  vite: { build: { assetsInlineLimit: 0 }, plugins: [hairline()] },
});
