import type { APIContext, GetStaticPaths } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import satori, { SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site-config";
import { getFormattedDate } from "@/utils";

const AssetDir = resolve("src", "assets");
const RobotoMonoPath = join(AssetDir, "roboto-mono-regular.ttf");
const RobotoMonoBoldPath = join(AssetDir, "roboto-mono-700.ttf");

const RobotoMonoReg = readFileSync(RobotoMonoPath);
const RobotoMonoBold = readFileSync(RobotoMonoBoldPath);

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	fonts: [
		{
			name: "Roboto Mono",
			data: RobotoMonoReg,
			weight: 400,
			style: "normal",
		},
		{
			name: "Roboto Mono",
			data: RobotoMonoBold,
			weight: 700,
			style: "normal",
		},
	],
};

const markup = (title: string, pubDate: string) => html`<div
	tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]"
>
	<div tw="flex flex-col flex-1 w-full p-10 justify-center">
		<p tw="text-2xl mb-6">${pubDate}</p>
		<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
	</div>
	<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
		<div tw="flex items-center">
			<p tw="ml-3 font-semibold">${siteConfig.title}</p>
		</div>
		<p>by ${siteConfig.author}</p>
	</div>
</div>`;

export async function get({ params: { slug } }: APIContext) {
	const post = await getEntryBySlug("post", slug!);
	const title = post?.data.title ?? siteConfig.title;
	const postDate = getFormattedDate(post?.data.publishDate ?? Date.now(), {
		weekday: "long",
		month: "long",
	});
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return {
		body: png,
		encoding: "binary",
	};
}

export const getStaticPaths = (async () => {
	const posts = await getCollection("post");
	return posts.filter(({ data }) => !data.ogImage).map(({ slug }) => ({ params: { slug } }));
}) satisfies GetStaticPaths;
