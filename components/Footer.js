import React from "react";
import Image from "next/image";
import Link from "next/link";
import CL_logo_stor from "../public/media/grafik/sidhuvud_inv.webp";

import styles from "../styles/footer.module.css";

export default function Navbar() {
  return (
    <footer id={styles.footer}>
      <div id={styles.footerInfo}>
        <h1>
          <Image
            src={CL_logo_stor}
            alt="CL logo, stor"
            sizes="(max-width: 800px) 90vw, 432px"
            className={styles.footerLogo}
          />
        </h1>
        <div className={styles.footerRow}>
          <div id={styles.footerInfoText} className={styles.footerCol}>
            <div>
              <h2>Organisationsnummer</h2>
              <p>802420-8491</p>
            </div>
            <div>
              <h2>Bankgiro</h2>
              <p>Huvudsektionen: 251-5310</p>
              <p>ClubWästeriet: 5160-8172</p>
              <p>Mottagningen: 5160-8206</p>
            </div>
            <div>
              <h2>Faktureringsadress</h2>
              <p>Sektionen för Civilingenjör och Lärare</p>
              <p>Drottning Kristinas väg 15</p>
              <p>100 44 Stockholm</p>
            </div>
            <div>
              <h2>Leveransadress</h2>
              <p>Osquars backe 8</p>
              <p>114 28 Stockholm</p>
            </div>
          </div>
          <div id={styles.quickLinks} className={styles.footerCol}>
            <h2>Hitta snabbt</h2>
            <Link href={"/om-oss"}>Om oss</Link>
            <Link href={"/kontakt"}>Kontakt</Link>
            <Link href={"/for-foretag"}>För företag</Link>
            <Link href={"/aktuellt"}>Aktuellt</Link>
            <Link href={"/hjalp-vid-illabehandling"}>Illabehandling</Link>
            <Link href={"/dokument"}>Dokument</Link>
            <Link href={"/kakor"}>Kakpolicy</Link>
            <Link href={"https://cl-sektionen.zyrosite.com"}>Gamla webbplatsen</Link>
            <Link href={"/firebasetest"}>Notis test (Beta)</Link>
          </div>
          <div id={styles.socialLinks} className={styles.footerCol}>
            <a href="https://www.instagram.com/clsektionen/" aria-label="CL-sektionens instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a
              href="https://www.facebook.com/groups/2388999847/"
              aria-label="CL-sektionens Facebooksida">
              <i className="fa-brands fa-facebook" />
            </a>
            <a
              href="https://github.com/Webbutvecklare-CL/cl-sektionen.se/"
              aria-label="CL-sektionens GitHub">
              <i className="fa-brands fa-github" />
            </a>
            <a href="https://login.one.com/mail" aria-label="Mailsida för förtroendevalda">
              <i className="fa-solid fa-envelope" />
            </a>
            <Link href="/personalrummet" aria-label="Personalrummet för förtroendevalda">
              <i className="fa-solid fa-mug-hot" />
            </Link>
          </div>
        </div>
      </div>
      <iframe
        title="Karta över Osquars backe 8"
        id={styles.karta}
        src="https://maps.google.com/maps?q=osquars%20backe%208&t=&z=15&ie=UTF8&iwloc=&output=embed"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        loading="lazy"
      />
    </footer>
  );
}
