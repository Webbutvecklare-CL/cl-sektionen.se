import React from "react";
import MarkdownRender from "../../components/MarkdownRender";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import BackButton from "../../components/BackButton";

import styles from "../../styles/sangbok.module.css";

export default function Sang({ content }) {
  return (
    <div id="contentbody">
      <article className={styles.song}>
        <BackButton page={"sangbok"}>Sångboken</BackButton>
        <MarkdownRender mdData={content} />
      </article>
    </div>
  );
}

export async function getStaticProps(context) {
  // Skickar med filnamnet som en prop vilket gör att next kan serverside rendera alla reseberättelser
  const { params } = context;

  // Hämtar all text
  const content = readFileSync(`public/content/sangbok/${params.sang}.md`, "utf8");

  return {
    props: { sang: params.sang, content: JSON.parse(JSON.stringify(content)) }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  // Hämtar alla filnamn från mappen med blogginläggen
  const PATH = join(process.cwd(), "public/content/sangbok");
  const paths = readdirSync(PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((sangid) => ({ params: { sang: sangid } }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}
