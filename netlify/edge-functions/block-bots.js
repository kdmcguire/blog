// inspired by https://www.jeremiak.com/blog/block-bots-netlify-edge-functions/
// which was inspired by https://ethanmarcotte.com/wrote/blockin-bots/
const botUas = [
	"AdsBot-Google",
	"Amazonbot",
	"anthropic-ai",
	"Applebot",
	"AwarioRssBot",
	"AwarioSmartBot",
	"Bytespider",
	"CCBot",
	"ChatGPT",
	"ChatGPT-User",
	"Claude-Web",
	"ClaudeBot",
	"cohere-ai",
	"DataForSeoBot",
	"Diffbot",
	"FacebookBot",
	"FacebookBot",
	"Google-Extended",
	"GPTBot",
	"ImagesiftBot",
	"magpie-crawler",
	"omgili",
	"Omgilibot",
	"peer39_crawler",
	"PerplexityBot",
	"YouBot",
];

export default async (request, context) => {
	const ua = request.headers.get("user-agent");

	let isBot = false;

	botUas.forEach((u) => {
		if (ua.toLowerCase().includes(u.toLowerCase())) {
			isBot = true;
		}
	});

	const response = isBot ? new Response(null, { status: 401 }) : await context.next();
	return response;
};
