import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function ForForetag({ contents }) {
  return (
    <div id="contentbody">
      <h1>För företag</h1>
      <MarkdownRender mdData={contents["for-foretag"]} />
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("for-foretag");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}
