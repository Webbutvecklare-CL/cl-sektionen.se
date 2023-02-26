import React from "react";
import MarkdownRender from "../../components/MarkdownRender";
import { join } from "path";
import { readdirSync } from "fs";

function Reseberattelse({ content }) {
  return (
    <div id="contentbody">
      <h1>Reseberättelse</h1>
      <article className="rese">
        <MarkdownRender mdData={content} />
      </article>
    </div>
  );
}
export default Reseberattelse;

export async function getStaticProps(context) {
  // Skickar med filnamnet som en prop vilket gör att next kan serverside rendera alla reseberättelser
  const { params } = context;

  // Hämtar all text
  let url = `${process.env.DOMAIN}/content/reseberattelser/${params.reseberattelse}.md`;
  const res = await fetch(url);
  const content = await res.text();

  return {
    props: { reseberattelse: params.reseberattelse, content }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  // Hämtar alla filnamn från mappen med blogginläggen
  const PATH = join(process.cwd(), "public/content/reseberattelser");
  const paths = readdirSync(PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((blogid) => ({ params: { reseberattelse: blogid } }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}
