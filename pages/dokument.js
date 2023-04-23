import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Dokument({ contents }) {
  return (
    <div id="contentbody">
      <div id="blanketter">
        <h2>Blanketter och mallar</h2>
        <a href="https://drive.google.com/file/d/1rOzE5IwIRqV0D89qd5f0i-CnTebz8Y3h/view">
          <i className="fa-regular fa-file-pdf" /> Utläggsblankett
        </a>
        <a href="https://drive.google.com/file/d/1aBCjU8wfLI5NwNNPjf-RabC1G4ZxM-wn/view">
          <i className="fa-regular fa-file-pdf" /> Milersättningsblankett
        </a>
        <a href="https://docs.google.com/document/d/1R9VzViVigsH3GzNqoHZJUYT3qf6Nw878BST8yCr3Dik">
          <i className="fa-regular fa-file-pdf" /> Mall för entledigande
        </a>
        <a href="https://docs.google.com/document/d/17srFoYElH16ysq_xeu_jlue3W4cxYeJsYgRA2FRWLus">
          <i className="fa-regular fa-file-pdf" /> Mall för motion
        </a>
        <a href="https://docs.google.com/document/d/1-LNWlpYvrYVFwJ9H9fZZO4-a9XAB8KLULQGBnuCX8pQ">
          <i className="fa-regular fa-file-pdf" /> Mall för äskan
        </a>
        <a href="https://docs.google.com/document/d/1iKTCjjld17XxJUKBo9cWCmr1A_vmsATD">
          <i className="fa-regular fa-file-pdf" /> CL:s SM-ord
        </a>
      </div>
      <h2>Styrdokument</h2>
      <iframe
        src="https://drive.google.com/embeddedfolderview?id=1Nwg-S7C0YZ0FAeoQtQoQs2NpAcB9Jacb#grid"
        style={{
          width: "100%",
          height: "600px",
          border: "0",
          backgroundColor: "#F2F3F4",
        }}></iframe>
      <br />
      <h2>
        Protokoll och handlingar från <a href="#rättigheter">SM och StyM</a>
      </h2>
      <iframe
        src="https://drive.google.com/embeddedfolderview?id=1TNcYNzvTLvmr-IKdY9TG6rW_0h-QFVGX#grid"
        style={{
          width: "100%",
          height: "600px",
          border: "0",
          backgroundColor: "#F2F3F4",
        }}></iframe>
      <section id="rättigheter">
        <MarkdownRender mdData={contents["rattigheter"]} />
      </section>
    </div>
  );
}

export async function getStaticProps() {
  let contents = getContentData("dokument");
  return {
    props: {
      contents,
    },
  };
}
