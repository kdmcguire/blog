/** @type {import("@types/prettier").Options} */
module.exports = {
	printWidth: 80,
	semi: true,
	singleQuote: false,
	useTabs: true,
	plugins: [
		"prettier-plugin-astro",
		"prettier-plugin-tailwindcss" /* Must come last */,
	],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};
