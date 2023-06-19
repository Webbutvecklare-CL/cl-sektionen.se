import BackButton from "../components/BackButton";
import Image from "next/image";
import bg from "../public/media/grafik/CLsharp.webp";

export default function Custom404() {
  return (
    <div id="contentbody" className="body404page">
      <Image src={bg} alt="background logo" className="bg404"></Image>
      <div className="error-msg">
        <span className="error-code">404</span>
        <div className="devider">|</div>
        <span className="error-description">Sidan kunde inte hittas</span>
      </div>
      <div className="error-back-link">
        <BackButton>Startsidan</BackButton>
      </div>
    </div>
  );
}
