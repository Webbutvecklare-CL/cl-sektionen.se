import React from "react";
import { useRouter } from "next/router";
import MarkdownRender from "../../components/MarkdownRender";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import BackButton from "../../components/BackButton";

export default function Praxis({ content }) {
  const router = useRouter();
  return (
    <div id="contentbody" className="wideContent">
      <article className="rese">
        <div className="article-head">
          <BackButton page={"dokument"}>Dokument</BackButton>
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
  const content = readFileSync(`content/dokument/${params.dokument}.md`, "utf8");

  return {
    props: { dokument: params.dokument, content: JSON.parse(JSON.stringify(content)) }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  // Hämtar alla filnamn från mappen med blogginläggen
  const PATH = join(process.cwd(), "content/dokument");
  const paths = readdirSync(PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((id) => ({ params: { dokument: id } }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}
