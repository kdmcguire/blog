/** @type {import("@types/prettier").Options} */
module.exports = {
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
