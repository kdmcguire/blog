import rss from "@astrojs/rss";
import { siteConfig } from "@/site-config";
import { getAllPosts } from "@/utils";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

export const GET = async () => {
	const posts = await getAllPosts();

	return rss({
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		customData:
			'<language>en-UK</language><atom:link href="https://kieranmcguire.uk/rss.xml" rel="self" type="application/rss+xml" />',
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.publishDate,
			categories: post.data.tags,
			description: post.data.description,
			content: sanitizeHtml(parser.render(post.body)),
			link: `posts/${post.slug}`,
			author: `upj1za7dm@relay.firefox.com (${siteConfig.author})`,
		})),
	});
};
