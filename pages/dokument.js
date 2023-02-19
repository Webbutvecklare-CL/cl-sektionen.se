import React from "react";

function Dokument(){
    return(
        <div id="contentbody">
            <h1>
                Dokument
            </h1>
            <p>Genom denna sida kommer du åt sektionens officiella dokument.</p>
            <div id="blanketter">
                <h2>Blanketter och mallar</h2>
                <a href="https://drive.google.com/file/d/1rOzE5IwIRqV0D89qd5f0i-CnTebz8Y3h/view"><i className="fa-regular fa-file-pdf"/> Utläggsblankett</a>
                <a href="https://drive.google.com/file/d/1aBCjU8wfLI5NwNNPjf-RabC1G4ZxM-wn/view"><i className="fa-regular fa-file-pdf"/> Milersättningsblankett</a>
                <a href="https://docs.google.com/document/d/1R9VzViVigsH3GzNqoHZJUYT3qf6Nw878BST8yCr3Dik/edit"><i className="fa-regular fa-file-pdf"/> Mall för entledigande</a> 
                <a href="https://docs.google.com/document/d/17srFoYElH16ysq_xeu_jlue3W4cxYeJsYgRA2FRWLus/edit"><i className="fa-regular fa-file-pdf"/> Mall för motion</a> 
                <a href="https://docs.google.com/document/d/1-LNWlpYvrYVFwJ9H9fZZO4-a9XAB8KLULQGBnuCX8pQ/edit"><i className="fa-regular fa-file-pdf"/> Mall för äskan</a> 
            </div>
            <h2>Styrdokument</h2>
            <iframe src="https://drive.google.com/embeddedfolderview?id=1Nwg-S7C0YZ0FAeoQtQoQs2NpAcB9Jacb#grid" style={{width: "100%", height: "600px", border: "0", backgroundColor: "#F2F3F4"}}></iframe><br/>
            <h2>Protokoll och handlingar från <a href="#rättigheter">SM och StyM</a></h2>
            <iframe src="https://drive.google.com/embeddedfolderview?id=1TNcYNzvTLvmr-IKdY9TG6rW_0h-QFVGX#grid" style={{width: "100%", height: "600px", border: "0", backgroundColor: "#F2F3F4"}}></iframe>
            <section id="rättigheter">
                <h1>Rättigheter på <span>SM</span> och <span>StyM</span></h1>
                <h2>Sektionsmöte (SM)</h2>
                <p>
                    Sektionsmötet är sektionens högsta beslutande organ (THS Reglemente § 9.1.4).
                    För beslutsmässighet på SM krävs minst tio närvarande sektionsmedlemmar. (THS Reglemente § 9.2.4)
                </p>
                    <ul>
                        <li><strong>Ordinarie medlem</strong> har närvarorätt, yttranderätt, yrkanderätt och rösträtt. (THS Reglemente § 9.2.1 + CL Stadgar § 1.4.1).
                            Inga andra kan tilldelas rösträtt.
                            Ordinarie medlem (=sektionsmedlem) är den THS-medlem som är programstuderande på sektionens program. (CL Stadgar § 1.4.1)
                        </li><br/>
                        <li>
                            <strong>Juniormedlem</strong>, och <strong>hedersmedlem</strong> har närvarorätt och yttranderätt. (CL Stadgar § 1.4.2 och 1.4.3)
                            Juniormedlem är studerande på sektionens program till och med sista dagen månaden efter uppropet. (CL Stadgar § 1.4.2) Juniormedlem kan givetvis bli ordinarie medlem genom att betala kåravgift.
                        </li><br/>
                        <li>
                            <strong>Talmannen</strong> har närvarorätt, yttranderätt och yrkanderätt. (CL Stadgar § 1.4.4)
                        </li><br/>
                        <li>
                            <strong>Övriga personer</strong> kan adjungeras genom beslut på mötet och få närvarorätt, yttranderätt och vid behov yrkanderätt.
                        </li>
                    </ul>
                <br/>
                <h2>Styrelsemöte (StyM)</h2>
                <p>
                    Styrelsen är beslutsmässig då minst hälften av ledamöterna är närvarande, förutom vid personval då minst tre fjärdedelar av styrelsen måste vara närvarande. (CL Stadgar § 3.3)
                </p>
                <ul>
                    <li><strong>Styrelsemedlem</strong> har närvarorätt, yttranderätt, yrkanderätt och rösträtt.
                        Inga andra kan tilldelas rösträtt.
                    </li><br/>
                    <li>
                        <strong>Ordinarie medlem</strong> har närvarorätt och yttranderätt. (CL Stadgar § 3.3)
                    </li><br/>
                    <li>
                        <strong>Övriga personer</strong> kan adjungeras genom beslut på mötet och få närvarorätt, yttranderätt och vid behov yrkanderätt.
                    </li><br/>
                    <li>
                        <strong>Mötet får inte</strong> fatta besluta i ärenden som inte upptagits på föredragningslistan.
                    </li>
                </ul>
            </section>
        </div>
    )
}
export default Dokument