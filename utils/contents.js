import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export function getContentData(page) {
	const contents = {};

	for (const fileName of readdirSync(`content/${page}`)) {
		// process.cwd() är för att skit ska fungera
		const fullPath = path.join(process.cwd(), `content/${page}/${fileName}`);

		// Läser in textdata och lägger till i contents
		contents[fileName.split(".")[0]] = readFileSync(fullPath, "utf8");
	}

	// Combine the data with the id
	return {
		...contents,
	};
}
