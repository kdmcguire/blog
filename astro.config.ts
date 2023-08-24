import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
	site: "https://kieran-mcguire.uk/",
	markdown: {
		shikiConfig: {
			theme: "dracula",
			wrap: true,
		},
	},
	integrations: [
		mdx({}),
		tailwind({
			applyBaseStyles: false,
		}),
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
		sitemap(),
		prefetch(),
	],
	compressHTML: true,
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
	redirects: {
		"/about": "/",
		"/adding-security-headers-through-netlify": "/posts/adding-security-headers-through-netlify",
		"battlefield-2042-review": "/posts/battlefield-2042-review",
		"cookies-browsers-and-misplaced-efforts": "/posts/cookies-browsers-and-misplaced-efforts",
		"/cyberpunk-2077-review/": "/posts/cyberpunk-2077-review/"
	},
});
