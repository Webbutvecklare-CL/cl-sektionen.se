import React from "react";
import Image from "next/image";
import Link from "next/link";
import CL_logo_stor from "../public/media/grafik/sidhuvud_inv.png";

export default function Navbar() {
  return (
    <footer>
      <div id="footerinfo">
        <Image src={CL_logo_stor} alt="CL logo, stor" className="footer_logo" />
        <div id="footerinfotext">
          <h3>Organisationsnummer</h3>802420-8491
          <br />
          <h3>Bankgiro</h3>
          Huvudsektionen: 251-5310
          <br />
          ClubWästeriet: 5160-8172
          <br />
          Mottagningen: 5160-8206
          <h3>Faktureringsadress</h3>
          Sektionen för Civilingenjör och Lärare
          <br />
          Drottning Kristinas väg 15
          <br />
          100 44 Stockholm
          <h3>Leveransadress</h3>
          Osquars backe 8
          <br />
          114 28 Stockholm
        </div>
        <div id="sociallinks">
          <a style={{ color: "inherit" }} href="https://www.instagram.com/clsektionen/">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a style={{ color: "inherit" }} href="https://www.facebook.com/groups/2388999847/">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a
            style={{ color: "inherit" }}
            href="https://github.com/Webbutvecklare-CL/cl-sektionen.se/">
            <i className="fa-brands fa-github"></i>
          </a>
          <Link href="/personalrummet" style={{ color: "inherit" }}>
            <i className="fa-solid fa-mug-hot"></i>
          </Link>
        </div>
      </div>
      <iframe
        id="karta"
        src="https://maps.google.com/maps?q=osquars%20backe%208&t=&z=15&ie=UTF8&iwloc=&output=embed"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"></iframe>
    </footer>
  );
}
