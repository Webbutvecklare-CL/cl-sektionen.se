import { readdirSync, readFileSync } from "fs";
import path from "path";

export function getContentData(page) {
  let contents = {};

  readdirSync(`public/content/${page}`).forEach((fileName) => {
    // Behåller endast filnamnet
    fileName = fileName.replace(/\.mdx?$/, "");
    // process.cwd() är för att skit ska fungera
    const fullPath = path.join(process.cwd(), `public/content/${page}/${fileName}.md`);

    // Läser in textdata och lägger till i contents
    contents[fileName] = readFileSync(fullPath, "utf8");
  });

  // Combine the data with the id
  return {
    ...contents,
  };
}
