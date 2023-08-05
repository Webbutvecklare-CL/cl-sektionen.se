import MarkdownRender from "../components/MarkdownRender";
import CustomHead from "../components/CustomHead";
import { getContentData } from "../utils/contents";

import styles from "../styles/kontakt.module.css";

export default function Kontakt({ contents }) {
  return (
    <>
      <CustomHead
        metaTitle={`Kontakt | Sektionen för Civilingenjör och Lärare`}
        description={"Har du frågor eller funderingar? Kontakta oss gärna på..."}
        url={"https://www.cl-sektionen.se/kontakt"}
      />
      <div id="contentbody">
        <h1>Kontakt</h1>
        <div className={styles.contact}>
          <MarkdownRender mdData={contents["allman"]} />
          <MarkdownRender mdData={contents["naringsliv"]} />
          <MarkdownRender mdData={contents["skyddsombud"]} />
          <MarkdownRender mdData={contents["ovrigt"]} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let contents = getContentData("kontakt");
  return {
    props: {
      contents,
    },
  };
}
