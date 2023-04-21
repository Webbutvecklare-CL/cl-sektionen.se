import React from "react";
import Link from "next/link";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Samarbete({ contents }) {
  return (
    <div id="contentbody">
      <h1>Om oss</h1>
      <MarkdownRender mdData={contents["programmet"]} />
      <MarkdownRender mdData={contents["sektionen"]} />
      <MarkdownRender mdData={contents["medlem"]} />
    </div>
  );
}

export async function getStaticProps() {
  let contents = getContentData("om-oss");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}
