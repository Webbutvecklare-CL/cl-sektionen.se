import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Studiebevakning({ contents }) {
  return (
    <div id="contentbody">
      <h1 id="page-title">Studiebevakning</h1>
      <p>
        På den här sidan kan du läsa om hur du kan påverka din utbildning och studentliv samt vad
        det finns för hjälp att få.
      </p>
      <MarkdownRender mdData={contents["influence"]} />
      <MarkdownRender mdData={contents["kursnamnd"]} />
      <MarkdownRender mdData={contents["akademisktintro"]} />
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("studiebevakning");
  return {
    props: {
      contents,
    },
  };
}
