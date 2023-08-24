import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/site-config";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export const get = async () => {
	const posts = await getCollection("post");

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			pubDate: post.data.publishDate,
			content: sanitizeHtml(parser.render(post.body)),
      ...post.data,
			link: `posts/${post.slug}`,
		})),
	});
};
