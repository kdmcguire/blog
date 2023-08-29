import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/site-config";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt({
	html: true,
	xhtmlOut: true
});

export const get = async () => {
	const posts = await getCollection("post");

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		customData: '<language>en-uk</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.publishDate,
			categories: post.data.tags,
			description: post.data.description,
			content: `<![CDATA[ ${sanitizeHtml(
				parser.render(post.body),
				{
					exclusiveFilter: function (frame) {
						return (frame.tag === 'p' && frame.text === 'import { Image } from "@astrojs/image/components";') || (frame.tag === 'p' && !frame.text.trim())
					},
				}
			)} ]]>`,
			link: `posts/${post.slug}`,
			author: siteConfig.author,
		})),
	});
};
