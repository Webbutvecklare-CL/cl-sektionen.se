import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Valbarakurser({ contents }) {
  return (
    <div id="contentbody">
      <h1>Valbara kurser</h1>
      <MarkdownRender mdData={contents["valbara-kurser"]} />
    </div>
  );
}

export async function getStaticProps() {
  let contents = getContentData("valbara-kurser");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}