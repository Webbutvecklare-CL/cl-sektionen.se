import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Kontakt({ contents }) {
  return (
    <div id="contentbody">
      <h1>Kontakt</h1>
      <div className="contact">
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
    }, // will be passed to the page component as props
  };
}
