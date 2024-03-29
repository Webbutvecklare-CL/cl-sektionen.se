import React from "react";
import Link from "next/link";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Samarbete({ contents }) {
  return (
    <div id="contentbody">
      <h1>Jobberbjudanden</h1>
      <MarkdownRender mdData={contents["jobberbjudanden"]} />
      <h1>Sponsorer</h1>
      <div>
        <p>
          Vill du synas här, hör av dig till{" "}
          <Link href={"mailto:naringslivsnamnden@cl-sektionen.se"}>
            naringslivsnamnden@cl-sektionen.se
          </Link>
        </p>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let contents = getContentData("samarbeten");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}
