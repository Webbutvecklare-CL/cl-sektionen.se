import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Engagera({ contents }) {
  return (
    <div id="contentbody">
      <h1 id="page-title">Engagera dig</h1>
      {/* <MarkdownRender mdData={contents["engagera-dig"]} /> Ska skrivas en om information om hur du blir nämndaktiv typ */}
      <MarkdownRender mdData={contents["evenemangsplanering"]} />
      <MarkdownRender mdData={contents["checklista-inkludering"]} />
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("engagera-dig");
  return {
    props: {
      contents,
    },
  };
}
