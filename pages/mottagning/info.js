import MarkdownRender from "../../components/MarkdownRender";
import CustomHead from "../../components/CustomHead";
import BackButton from "../../components/BackButton";
import { getContentData } from "../../utils/contents";

export default function Info({ contents }) {
  return (
    <>
      <CustomHead
        metaTitle={`Mottagningsinfo | Sektionen för Civilingenjör och Lärare`}
        description={
          "Här finns viktig information och tips till dig som ska börja på programmet Civilingenjör och lärare."
        }
        url={"https://www.cl-sektionen.se/mottagning/info"}
      />
      <div id="contentbody" className="wideContent">
        <article>
          <BackButton page="mottagning">Mottagningssidan</BackButton>
          <MarkdownRender mdData={contents["infodumpen"]} />
        </article>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let contents = getContentData("mottagning");
  return {
    props: {
      contents,
    },
  };
}
