import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

import styles from "../styles/kontakt.module.css";

export default function Kontakt({ contents }) {
  return (
    <div id="contentbody">
      <h1>Kontakt</h1>
      <div className={styles.contact}>
        <MarkdownRender mdData={contents["allman"]} />
        <MarkdownRender mdData={contents["naringsliv"]} />
        <MarkdownRender mdData={contents["skyddsombud"]} />
        <MarkdownRender mdData={contents["ovrigt"]} />
      </div>
    </div>
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
