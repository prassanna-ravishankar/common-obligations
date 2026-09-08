import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://commonobligations.org",
  output: "static",
  build: { inlineStylesheets: "never" },
  vite: { build: { assetsInlineLimit: 0 } },
});
