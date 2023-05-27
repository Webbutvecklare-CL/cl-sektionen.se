export default function InfoBox({ text }) {
  return (
    <div className="infobox-container">
      <i className="fa-regular fa-circle-question fa-xs"> </i>
      <span className="infobox">{text}</span>
    </div>
  );
}
