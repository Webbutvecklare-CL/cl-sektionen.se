import { readdirSync, readFileSync } from "fs";
import path from "path";

export function getContentData(page) {
  const contents = {};

  readdirSync(`content/${page}`).forEach((fileName) => {
    // process.cwd() är för att skit ska fungera
    const fullPath = path.join(process.cwd(), `content/${page}/${fileName}`);

    // Läser in textdata och lägger till i contents
    contents[fileName.split(".")[0]] = readFileSync(fullPath, "utf8");
  });

  // Combine the data with the id
  return {
    ...contents,
  };
}
