import namnder from "../components/Namnder";
import { useState } from "react";

export default function Fortroendevalda() {
  const [valdNämnd, setValdNämnd] = useState("CtyreLsen");
  const stateUpdater = (namnd) => {
    let ulNode = document.getElementById("nämnder_nav_ul");
    setValdNämnd(namnd);
    for (let li of ulNode.childNodes) {
      li.className = li.id === namnd ? "active" : "";
    }
    document.getElementById("förtroendevalda_content").scrollIntoView();
  };

  return (
    <div id="contentbody">
      <div className="förtroendevalda_wrapper">
        <nav className="nämnder_nav">
          <ul id="nämnder_nav_ul">
            <li id="CtyreLsen" className="active" onClick={() => stateUpdater("CtyreLsen")}>
              <i className="fa-solid fa-gavel" /> CtyreLsen
            </li>

            <h2>Nämnder</h2>
            <li id="Studienämnden" onClick={() => stateUpdater("Studienämnden")}>
              <i className="fa-solid fa-book" /> &nbsp;Studienämnden
            </li>
            <li id="Näringslivsnämnden" onClick={() => stateUpdater("Näringslivsnämnden")}>
              <i className="fa-solid fa-sack-dollar" /> Näringslivsnämnden
            </li>
            <li id="Mottagningsnämnden" onClick={() => stateUpdater("Mottagningsnämnden")}>
              <i className="fa-solid fa-heart" /> Mottagningsnämnden
            </li>
            <li id="JML-nämnden" onClick={() => stateUpdater("JML-nämnden")}>
              <i className="fa-solid fa-apple-whole" /> &nbsp;JML-nämnden
            </li>
            <li id="Aktivitetsnämnden" onClick={() => stateUpdater("Aktivitetsnämnden")}>
              <i className="fa-solid fa-person-running" /> &nbsp;Aktivitetsnämnden
            </li>
            <li id="Lokalnämnden" onClick={() => stateUpdater("Lokalnämnden")}>
              <i className="fa-solid fa-house" /> Lokalnämnden
            </li>
            <li id="CLubWästeriet" onClick={() => stateUpdater("CLubWästeriet")}>
              <i className="fa-solid fa-wine-glass" /> &nbsp;&nbsp;ClubWästeriet
            </li>
            <li id="Valberedningen" onClick={() => stateUpdater("Valberedningen")}>
              <i className="fa-solid fa-fish-fins" /> Valberedningen
            </li>
            <br />

            <h2>Övriga förtroendevalda</h2>
            <li id="Revisorer" onClick={() => stateUpdater("Revisorer")}>
              <i className="fa-solid fa-scale-balanced" /> Revisorer
            </li>
            <li id="Fanborg" onClick={() => stateUpdater("Fanborg")}>
              <i className="fa-solid fa-flag" /> &nbsp;Fanborg
            </li>
            <li
              id="Kårfullmäktigedelegation"
              onClick={() => stateUpdater("Kårfullmäktigedelegation")}
            >
              <i className="fa-solid fa-section" /> &nbsp;&nbsp;&nbsp;Kårfullmäktigedelegation
            </li>
            <li id="Enskilda" onClick={() => stateUpdater("Enskilda")}>
              <i className="fa-solid fa-otter" /> Enskilda poster
            </li>
            <br />

            <h2>Sektionsföreningar</h2>
            <li id="CLek" onClick={() => stateUpdater("CLek")}>
              <i className="fa-solid fa-dice" /> CLek
            </li>
            <li id="Dubbelspexet" onClick={() => stateUpdater("Dubbelspexet")}>
              <i className="fa-solid fa-masks-theater" /> Dubbelspexet
            </li>
            <li id="CLak" onClick={() => stateUpdater("CLak")}>
              <i className="fa-solid fa-arrow-trend-up" /> CLak
            </li>
          </ul>
        </nav>
        <div id="förtroendevalda_content">{namnder[valdNämnd]}</div>
      </div>
    </div>
  );
}
