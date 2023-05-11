import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import Card from "../components/Card";
import { getContentData } from "../utils/contents";

export default function Dokument({ contents }) {
  return (
    <div id="contentbody">
      <h1 id="page-title">Dokument</h1>
      <h2>Praxisdokment</h2>
      <p>
        Har som syfte att samla viktig information som inte passar in i något av sektionens
        styrdokument. Notera att dessa är levande dokument.
      </p>
      <div className="cards praxis-cards">
        <Card
          link={"/praxis/alkoholservering"}
          innerText={
            <div>
              <i className="fa-solid fa-martini-glass" /> Rutiner för <b>alkoholservering</b>
            </div>
          }
        />
        <Card
          link={"/praxis/lokalbokning"}
          innerText={
            <div>
              <i className="fa-solid fa-house" /> Praxis för <b>lokalbokning</b>
            </div>
          }
        />
        <Card
          link={"/praxis/personuppgifter"}
          innerText={
            <div>
              <i className="fa-solid fa-address-card" /> Hantering av <b>personuppgifter</b>
            </div>
          }
        />
        <Card
          link={"/praxis/utlagg"}
          innerText={
            <div>
              <i className="fa-solid fa-file-invoice-dollar" /> Praxis för <b>utlägg</b>
            </div>
          }
        />
        <Card
          link={"/praxis/skattjakt"}
          innerText={
            <div>
              <i className="fa-solid fa-gem" /> Praxis för <b>Skattjakt</b>
            </div>
          }
        />
      </div>

      <h2>Blanketter, mallar och lathundar</h2>
      <div className="cards">
        <Card
          link={"https://drive.google.com/file/d/1rOzE5IwIRqV0D89qd5f0i-CnTebz8Y3h/view"}
          innerText={
            <div>
              <i className="fa-regular fa-file-pdf" /> Utläggsblankett
            </div>
          }
        />
        <Card
          link={
            "https://docs.google.com/document/d/1BxySegqiWihlavewTlbLEPKaY3XAOuSA7fJPdoS-U-w/edit?usp=sharing"
          }
          innerText={
            <div>
              <i className="fa-regular fa-file-pdf" /> Mall för digitalt signerat kvitto
            </div>
          }
        />
        <Card
          link={
            "https://docs.google.com/document/d/1cqWZFaQ8CyRdVJ8qTxTLiFinnVLjPE0QKf3rvVIx6BA/edit?usp=sharing"
          }
          innerText={
            <div>
              <i className="fa-regular fa-file-pdf" /> Mall för handsignerat kvitto
            </div>
          }
        />
        <Card
          link={"https://drive.google.com/file/d/1aBCjU8wfLI5NwNNPjf-RabC1G4ZxM-wn/view"}
          innerText={
            <div>
              <i className="fa-regular fa-file-pdf" /> Milersättningsblankett
            </div>
          }
        />
        <Card
          link={"https://docs.google.com/document/d/1R9VzViVigsH3GzNqoHZJUYT3qf6Nw878BST8yCr3Dik"}
          innerText={
            <div>
              <i className="fa-regular fa-file-lines" /> Mall för entledigande
            </div>
          }
        />
        <Card
          link={"https://docs.google.com/document/d/17srFoYElH16ysq_xeu_jlue3W4cxYeJsYgRA2FRWLus"}
          innerText={
            <div>
              <i className="fa-regular fa-file-lines" /> Mall för motion
            </div>
          }
        />
        <Card
          link={"https://docs.google.com/document/d/1-LNWlpYvrYVFwJ9H9fZZO4-a9XAB8KLULQGBnuCX8pQ"}
          innerText={
            <div>
              <i className="fa-regular fa-file-lines" /> Mall för äskan
            </div>
          }
        />
        <Card
          link={"https://docs.google.com/document/d/1iKTCjjld17XxJUKBo9cWCmr1A_vmsATD"}
          innerText={
            <div>
              <i className="fa-regular fa-file-pdf" /> CL:s SM-ord
            </div>
          }
        />
        <Card
          link={
            "https://docs.google.com/document/d/1xvkaImZgTlshVRRpyNc31_lrnB1qrEwMHUgF8ei21fs/edit?usp=sharing"
          }
          innerText={
            <div>
              <i className="fa-regular fa-file-pdf" /> Rapportmall SM
            </div>
          }
        />
        <Card
          link={"https://docs.google.com/forms/d/159D-EqMxWraoC8ZdaXySFzg9B8hOQlhARkTLUu28830/edit"}
          innerText={
            <div>
              <i className="fa-solid fa-square-poll-horizontal" /> Formulärsmall
            </div>
          }
        />
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
