import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/site-config";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export const get = async () => {
	const posts = await getCollection("post");

	return rss({
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		customData: '<language>en-UK</language><atom:link href="https://kieran-mcguire.uk/rss.xml" rel="self" type="application/rss+xml" />',
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.publishDate,
			categories: post.data.tags,
			description: post.data.description,
			content: sanitizeHtml(
				parser.render(post.body),
				{
					exclusiveFilter: function (frame) {
						return (frame.tag === 'p' && frame.text === 'import { Image } from "@astrojs/image/components";') || (frame.tag === 'p' && !frame.text.trim())
					},
				}
			),
			link: `posts/${post.slug}`,
			author: `kieran-mcguire@outlook.com (${siteConfig.author})`,
		})),
	});
};
