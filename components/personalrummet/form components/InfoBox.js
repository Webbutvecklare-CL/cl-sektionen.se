import { regular, circleQuestion, xs } from "../../../styles/fontawesome.module.css";

export default function InfoBox({ text }) {
  return (
    <div className="infobox-container">
      <i className={`${regular} ${circleQuestion} ${xs}`} />
      <span className="infobox">{text}</span>
    </div>
  );
}
