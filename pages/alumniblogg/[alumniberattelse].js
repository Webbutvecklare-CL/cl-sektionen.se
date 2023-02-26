import React from "react";
import MarkdownRender from "../../components/MarkdownRender";
import { readdirSync } from "fs";
import { join } from "path";

export default function Alumniberattelse({ content }) {
  return (
    <div id="contentbody">
      <h1>Alumniblogg</h1>
      <article>
        <MarkdownRender mdData={content} />
      </article>
    </div>
  );
}

export async function getStaticProps(context) {
  // Skickar med filnamnet som en prop vilket gör att next kan serverside rendera alla blogginlägg
  const { params } = context;

  // Hämtar all text
  let url = `${process.env.DOMAIN}/content/alumniblogg/${params.alumniberattelse}.md`;
  const res = await fetch(url);
  const content = await res.text();

  return {
    props: { alumniberattelse: params.alumniberattelse, content }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  // Hämtar alla filnamn från mappen med blogginläggen
  const PATH = join(process.cwd(), "public/content/alumniblogg");
  const paths = readdirSync(PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((blogid) => ({ params: { alumniberattelse: blogid } }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}
