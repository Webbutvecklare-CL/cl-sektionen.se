import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Illabehandling({ contents }) {
  return (
    <div id="contentbody">
      <MarkdownRender mdData={contents["hjalp-vid-illabehandling"]} />
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("hjalp-vid-illabehandling");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}
