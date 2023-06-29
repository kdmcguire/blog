import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  // ! Please remember to replace the following site property with your own domain
  site: "https://kieran-mcguire.uk/",
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true
    }
  },
  integrations: [mdx({}), tailwind({
    applyBaseStyles: false
  }), image({
    serviceEntryPoint: "@astrojs/image/sharp"
  }), sitemap(), prefetch()],
  compressHTML: true,
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"]
    }
  },
  output: "server",
  adapter: netlify()
});