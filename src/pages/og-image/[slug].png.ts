import type { APIContext, GetStaticPaths } from "astro";
import { getEntryBySlug } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site-config";
import { getAllPosts, getFormattedDate } from "@/utils";

import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";

const ogOptions: SatoriOptions = {
  width: 1200,
  height: 630,
  // debug: true,
  fonts: [
    {
      name: "Roboto Mono",
      data: Buffer.from(RobotoMono),
      weight: 400,
      style: "normal",
    },
    {
      name: "Roboto Mono",
      data: Buffer.from(RobotoMonoBold),
      weight: 700,
      style: "normal",
    },
  ],
};

const markup = (title: string, pubDate: string) =>
  html`<div
    tw="flex w-full h-full bg-cover bg-no-repeat bg-center"
    style="background-image: url(https://kieran-mcguire.uk/default-social-card.jpg)"
  >
        <div tw="flex flex-col w-full h-full bg-cover text-white bg-slate-800/75">
          <h1 tw="text-6xl ml-8 mt-24 font-bold leading-snug">${title}</h1>
          <p tw="text-2xl ml-8 mb-6">${pubDate}</p>
          <p tw="text-2xl ml-8">by ${siteConfig.author}</p>
        </div>
    </div>
  </div>`;

export async function GET({ params: { slug } }: APIContext) {
  const post = await getEntryBySlug("post", slug!);
  const title = post?.data.title ?? siteConfig.title;
  const postDate = getFormattedDate(
    post?.data.updatedDate ?? post?.data.publishDate ?? Date.now(),
    {
      weekday: "long",
      month: "long",
    },
  );
  const svg = await satori(markup(title, postDate), ogOptions);
  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  return posts.filter(({ data }) => !data.ogImage).map(({ slug }) => ({ params: { slug } }));
};
