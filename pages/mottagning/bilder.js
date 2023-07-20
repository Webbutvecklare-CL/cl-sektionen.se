import BackButton from "../../components/BackButton";

export default function Bilder() {
  return (
    <div id="contentbody">
      <BackButton page="mottagning">Mottagningssidan</BackButton>
      <div>
        <p>Här hittar du en/flera länkar till alla bilder</p>
        <h2>Första veckan</h2>
        <ul>
          <li>Måndag</li>
          <li>Tisdag</li>
          <li>Onsdag</li>
          <li>Torsdag</li>
          <li>Fredag</li>
        </ul>
        <h2>Andra veckan</h2>
        <ul>
          <li>Måndag</li>
          <li>Tisdag</li>
          <li>Onsdag</li>
          <li>Torsdag</li>
          <li>Fredag</li>
        </ul>
      </div>
    </div>
  );
}
