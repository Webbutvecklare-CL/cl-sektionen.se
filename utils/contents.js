import { readdirSync, readFileSync } from "fs";

export function getContentData(path) {
  let contents = {};
  readdirSync(`public/content/${path}`)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map(
      (file_name) =>
        (contents[file_name] = readFileSync(`public/content/${path}/${file_name}.md`, "utf8"))
    );

  // Combine the data with the id
  return {
    ...contents,
  };
}
