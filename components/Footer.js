import React from "react";
import Image from "next/image";
import Link from "next/link";
import CL_logo_stor from "../public/media/grafik/sidhuvud_inv.webp";

export default function Navbar() {
  return (
    <footer>
      <div id="footerinfo">
        <Image
          src={CL_logo_stor}
          alt="CL logo, stor"
          sizes="(max-width: 800px) 90vw, 432px"
          className="footer_logo"
        />
        <div className="footer-row">
          <div id="footerinfotext" className="footer-col">
            <div>
              <h3>Organisationsnummer</h3>
              <p>802420-8491</p>
            </div>
            <div>
              <h3>Bankgiro</h3>
              <p>Huvudsektionen: 251-5310</p>
              <p>ClubWästeriet: 5160-8172</p>
              <p>Mottagningen: 5160-8206</p>
            </div>
            <div>
              <h3>Faktureringsadress</h3>
              <p>Sektionen för Civilingenjör och Lärare</p>
              <p>Drottning Kristinas väg 15</p>
              <p>100 44 Stockholm</p>
            </div>
            <div>
              <h3>Leveransadress</h3>
              <p>Osquars backe 8</p>
              <p>114 28 Stockholm</p>
            </div>
          </div>
          <div id="quick-links" className="footer-col">
            <h3>Hitta snabbt</h3>
            <Link href={"/om-oss"}>Om oss</Link>
            <Link href={"/kontakt"}>Kontakt</Link>
            <Link href={"/for-foretag"}>För företag</Link>
            <Link href={"/aktuellt"}>Aktuellt</Link>
            <Link href={"/hjalp-vid-illabehandling"}>Illabehandling</Link>
            <Link href={"/dokument"}>Dokument</Link>
            <Link href={"https://cl-sektionen.zyrosite.com"}>Gamla webbplatsen</Link>
          </div>
          <div id="sociallinks" className="footer-col">
            <a href="https://www.instagram.com/clsektionen/">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="https://www.facebook.com/groups/2388999847/">
              <i className="fa-brands fa-facebook" />
            </a>
            <a href="https://github.com/Webbutvecklare-CL/cl-sektionen.se/">
              <i className="fa-brands fa-github" />
            </a>
            <a href="https://login.one.com/mail">
              <i className="fa-solid fa-envelope" />
            </a>
            <Link href="/personalrummet">
              <i className="fa-solid fa-mug-hot" />
            </Link>
          </div>
        </div>
      </div>
      <iframe
        id="karta"
        src="https://maps.google.com/maps?q=osquars%20backe%208&t=&z=15&ie=UTF8&iwloc=&output=embed"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
      />
    </footer>
  );
}
