import namnder from "../components/Namnder";
import { useState } from "react";

export default function Fortroendevalda(){
    const [valdNämnd, setValdNämnd] = useState("CtyreLsen");
    const stateUpdater = (namnd) => {
        let ulNode = document.getElementById("nämnder_nav_ul");
        setValdNämnd(namnd);
        for (let li of ulNode.childNodes){
            li.className = (li.id === namnd)? "active" : "";
        }
        document.getElementById("förtroendevalda_content").scrollIntoView();
        
    }

    return (
        <div id="contentbody">
            <div className="förtroendevalda_wrapper">
                <nav className="nämnder_nav">
                    <ul id="nämnder_nav_ul">
                        <li id="CtyreLsen" className="active" onClick={() => stateUpdater("CtyreLsen")}>
                            CtyreLsen</li>

                        <h2>Nämnder</h2>
                        <li id="Studienämnden" onClick={() => stateUpdater("Studienämnden")}>
                            Studienämnden</li>
                        <li id="Näringslivsnämnden" onClick={() => stateUpdater("Näringslivsnämnden")}>
                            Näringslivsnämnden</li>
                        <li id="Mottagningsnämnden" onClick={() => stateUpdater("Mottagningsnämnden")}>
                            Mottagningsnämnden</li>
                        <li id="JML-nämnden" onClick={() => stateUpdater("JML-nämnden")}>
                            JML-nämnden</li>
                        <li id="Aktivitetsnämnden" onClick={() => stateUpdater("Aktivitetsnämnden")}>
                            Aktivitetsnämnden</li>
                        <li id="Lokalnämnden" onClick={() => stateUpdater("Lokalnämnden")}>
                            Lokalnämnden</li>
                        <li id="CLubWästeriet" onClick={() => stateUpdater("CLubWästeriet")}>
                            ClubWästeriet</li>
                        <li id="Valberedningen" onClick={() => stateUpdater("Valberedningen")}>
                            Valberedningen</li>
                        <br/>

                        <h2>Övriga förtroendevalda</h2>
                        <li id="Revisorer" onClick={() => stateUpdater("Revisorer")}>
                            Revisorer</li>
                        <li id="Fanborg" onClick={() => stateUpdater("Fanborg")}>
                            Fanborg</li>
                        <li id="Kårfullmäktigedelegation" onClick={() => stateUpdater("Kårfullmäktigedelegation")}>
                            Kårfullmäktigedelegation</li>
                        <li id="Enskilda" onClick={() => stateUpdater("Enskilda")}>
                            Enskilda poster</li>
                        <br/>
                        
                        <h2>Sektionsföreningar</h2>
                        <li id="CLek" onClick={() => stateUpdater("CLek")}>
                            CLek</li>
                        <li id="Dubbelspexet" onClick={() => stateUpdater("Dubbelspexet")}>
                            Dubbelspexet</li>
                        <li id="CLak" onClick={() => stateUpdater("CLak")}>
                            CLak</li>
                        
                    </ul>
                </nav>
                <div id="förtroendevalda_content">
                    {namnder[valdNämnd]}
                </div>
            </div>
        </div>
    )
};