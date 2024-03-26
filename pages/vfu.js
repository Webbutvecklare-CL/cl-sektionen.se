import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function VFU({ contents }) {
  return (
    <div id="contentbody">
      <h1 id="page-title">VFU</h1>
      <MarkdownRender mdData={contents["vfu"]} />
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("vfu");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}
