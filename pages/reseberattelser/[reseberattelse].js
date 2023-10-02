import React from "react";
import MarkdownRender from "../../components/MarkdownRender";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import BackButton from "../../components/BackButton";

import styles from "../../styles/reseberattelser.module.css";

export default function Reseberattelse({ content }) {
  return (
    <div id="contentbody">
      <article className={styles.rese}>
        <div className="article-head">
          <BackButton page={"reseberattelser"}>Reseberättelser</BackButton>
        </div>
        <MarkdownRender mdData={content} />
      </article>
    </div>
  );
}

export async function getStaticProps(context) {
  // Skickar med filnamnet som en prop vilket gör att next kan serverside rendera alla reseberättelser
  const { params } = context;

  // Hämtar all text
  const content = readFileSync(
    `content/reseberattelser/${params.reseberattelse}.md`,
    "utf8"
  );

  return {
    props: { reseberattelse: params.reseberattelse, content: JSON.parse(JSON.stringify(content)) }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  // Hämtar alla filnamn från mappen med blogginläggen
  const PATH = join(process.cwd(), "content/reseberattelser");
  const paths = readdirSync(PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((blogid) => ({ params: { reseberattelse: blogid } }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}
