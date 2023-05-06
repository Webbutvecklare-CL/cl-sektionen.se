import React from "react";
import { useRouter } from "next/router";
import MarkdownRender from "../../components/MarkdownRender";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export default function Praxis({ content }) {
  const router = useRouter();
  return (
    <div id="contentbody">
      <article className="rese">
        <div className="article-head">
          <button onClick={() => router.back()}>
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Tillbaka
          </button>
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
  const content = readFileSync(`public/content/praxis/${params.praxis}.md`, "utf8");

  return {
    props: { praxis: params.praxis, content: JSON.parse(JSON.stringify(content)) }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  // Hämtar alla filnamn från mappen med blogginläggen
  const PATH = join(process.cwd(), "public/content/praxis");
  const paths = readdirSync(PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((id) => ({ params: { praxis: id } }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}
