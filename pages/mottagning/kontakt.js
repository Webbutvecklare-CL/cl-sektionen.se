import BackButton from "../../components/BackButton";
import MarkdownRender from "../../components/MarkdownRender";
import CustomHead from "../../components/CustomHead";
import { getContentData } from "../../utils/contents";

import Image from "next/image";
import qrCode from "../../public/media/img/qr-kod-illabehandling.png";

import styles from "../../styles/mottagning/kontakt.module.css";

export default function Kontakt({ contents }) {
  return (
    <>
      <CustomHead
        metaTitle={`Kontakt mottagningen | Sektionen för Civilingenjör och Lärare`}
        description={"Här hittar du viktiga kontaktuppgifter för dig som deltar i mottagningen."}
        url={"https://www.cl-sektionen.se/mottagning/bilder"}
      />
      <div id="contentbody">
        <article>
          <BackButton page="mottagning">Mottagningssidan</BackButton>
          <div className={styles.contact}>
            <MarkdownRender mdData={contents["presidiet"]} />
          </div>
          <div>
            <MarkdownRender mdData={contents["trygghetsradet"]} />
            <Image
              src={qrCode}
              width={100}
              height={100}
              alt="QR-kod till www.cl-sektionen.se/hjalp-vid-illabehandling"
            />
          </div>
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
