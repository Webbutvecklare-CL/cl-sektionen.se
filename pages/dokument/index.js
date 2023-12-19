import React from "react";
import CustomHead from "../../components/CustomHead";
import MarkdownRender from "../../components/MarkdownRender";
import Card from "../../components/Card";
import { getContentData } from "../../utils/contents";

import styles from "../../styles/dokument.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileLines } from "@fortawesome/free-regular-svg-icons";
import {
  faMartiniGlass,
  faHouse,
  faAddressCard,
  faFileInvoiceDollar,
  faSquarePollHorizontal,
} from "@fortawesome/free-solid-svg-icons";

export default function Dokument({ contents }) {
  return (
    <>
      <CustomHead
        metaTitle={`Dokument | Sektionen för Civilingenjör och Lärare`}
        description={"Här hittar du styrdokument, praxisdokument, blanketter och mallar."}
        url={"https://www.cl-sektionen.se/dokument"}
      />
      <div id="contentbody">
        <h1 id="page-title">Dokument</h1>
        <h2>Praxisdokment</h2>
        <p>
          Har som syfte att samla viktig information som inte passar in i något av sektionens
          styrdokument. Notera att dessa är levande dokument.
        </p>
        <div className={`${styles.cards} ${styles.praxisCards}`}>
          <Card link={"/dokument/alkoholservering"}>
            <FontAwesomeIcon icon={faMartiniGlass} /> Rutiner för <b>alkoholservering</b>
          </Card>
          <Card link={"/dokument/lokalbokning"}>
            <FontAwesomeIcon icon={faHouse} /> Praxis för <b>lokalbokning</b>
          </Card>
          <Card link={"/dokument/personuppgifter"}>
            <FontAwesomeIcon icon={faAddressCard} /> Hantering av <b>personuppgifter</b>
          </Card>
          <Card link={"/dokument/utlagg"}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} /> Praxis för <b>utlägg</b>
          </Card>
        </div>

        <h2>Blanketter, mallar och lathundar</h2>
        <div className={styles.cards}>
          <Card link={"https://drive.google.com/file/d/1I3bKFoR5PRMrIl-_SFrGBcC5_JMVPWPM/view?usp=drive_link"}>
            <FontAwesomeIcon icon={faFilePdf} /> Utläggsblankett
          </Card>
          <Card
            link={
              "https://docs.google.com/document/d/1BxySegqiWihlavewTlbLEPKaY3XAOuSA7fJPdoS-U-w/edit?usp=sharing"
            }>
            <FontAwesomeIcon icon={faFilePdf} /> Mall för digitalt signerat kvitto
          </Card>
          <Card
            link={
              "https://docs.google.com/document/d/1cqWZFaQ8CyRdVJ8qTxTLiFinnVLjPE0QKf3rvVIx6BA/edit?usp=sharing"
            }>
            <FontAwesomeIcon icon={faFilePdf} /> Mall för handsignerat kvitto
          </Card>
          <Card link={"https://drive.google.com/file/d/1aBCjU8wfLI5NwNNPjf-RabC1G4ZxM-wn/view"}>
            <FontAwesomeIcon icon={faFilePdf} /> Milersättningsblankett
          </Card>
          <Card
            link={
              "https://docs.google.com/document/d/1R9VzViVigsH3GzNqoHZJUYT3qf6Nw878BST8yCr3Dik"
            }>
            <FontAwesomeIcon icon={faFileLines} /> Mall för entledigande
          </Card>
          <Card
            link={
              "https://docs.google.com/document/d/17srFoYElH16ysq_xeu_jlue3W4cxYeJsYgRA2FRWLus"
            }>
            <FontAwesomeIcon icon={faFileLines} /> Mall för motion
          </Card>
          <Card
            link={
              "https://docs.google.com/document/d/1-LNWlpYvrYVFwJ9H9fZZO4-a9XAB8KLULQGBnuCX8pQ"
            }>
            <FontAwesomeIcon icon={faFileLines} /> Mall för äskan
          </Card>
          <Card link={"https://docs.google.com/document/d/1iKTCjjld17XxJUKBo9cWCmr1A_vmsATD"}>
            <FontAwesomeIcon icon={faFilePdf} /> CL:s SM-ord
          </Card>
          <Card
            link={
              "https://docs.google.com/document/d/1xvkaImZgTlshVRRpyNc31_lrnB1qrEwMHUgF8ei21fs/edit?usp=sharing"
            }>
            <FontAwesomeIcon icon={faFilePdf} /> Rapportmall SM
          </Card>
          <Card
            link={
              "https://docs.google.com/forms/d/159D-EqMxWraoC8ZdaXySFzg9B8hOQlhARkTLUu28830/edit"
            }>
            <FontAwesomeIcon icon={faSquarePollHorizontal} /> Formulärsmall
          </Card>
        </div>
        <h2>Styrdokument</h2>
        <iframe
          title="Styrdokument"
          src="https://drive.google.com/embeddedfolderview?id=1Nwg-S7C0YZ0FAeoQtQoQs2NpAcB9Jacb#grid"
          style={{
            width: "100%",
            height: "600px",
            border: "0",
            backgroundColor: "#F2F3F4",
          }}
        />
        <br />
        <h2>
          Protokoll och handlingar från <a href="#rättigheter">SM och StyM</a>
        </h2>
        <iframe
          title="Protokoll och handlingar från SM och StyM"
          src="https://drive.google.com/embeddedfolderview?id=1TNcYNzvTLvmr-IKdY9TG6rW_0h-QFVGX#grid"
          style={{
            width: "100%",
            height: "600px",
            border: "0",
            backgroundColor: "#F2F3F4",
          }}
        />
        <section id={`${styles.rights} rättigheter`}>
          <MarkdownRender mdData={contents["rattigheter"]} />
        </section>
      </div>
    </>
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
