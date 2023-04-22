import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Samarbete({ contents }) {
  return (
    <div id="contentbody">
      <h1>Om oss</h1>
      <MarkdownRender mdData={contents["programmet"]} />
      <MarkdownRender mdData={contents["sektionen"]} />
      <MarkdownRender mdData={contents["medlem"]} />
      <MarkdownRender mdData={contents["inriktningar"]} />
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
