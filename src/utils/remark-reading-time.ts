import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function (tree: unknown, { data }: any) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}
