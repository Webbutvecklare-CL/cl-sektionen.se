import BackButton from "../../components/BackButton";

export default function Bilder() {
  return (
    <div id="contentbody">
      <BackButton page="mottagning">Mottagningssidan</BackButton>
      <div>
        <br/>
        <p>Här hittar du länkar till alla mottagningsbilder. Tänk på att inte dela bilder på andra utan tillåtelse.</p>
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
