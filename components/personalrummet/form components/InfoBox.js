import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

export default function InfoBox({ text }) {
  return (
    <div className="infobox-container">
      <FontAwesomeIcon icon={faCircleQuestion} size="sm" />
      <span className="infobox">{text}</span>
    </div>
  );
}
