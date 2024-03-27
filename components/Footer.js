import React from "react";
import Image from "next/image";
import Link from "next/link";
import CL_logo_stor from "../public/media/grafik/sidhuvud_inv.webp";

import styles from "../styles/footer.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faInstagram,
	faFacebook,
	faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faMugHot, faEnvelope } from "@fortawesome/free-solid-svg-icons";

import dynamic from "next/dynamic";
const MapsFrame = dynamic(() => import("./MapsFrame"), { ssr: false });

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
						<Link href={"https://cl-sektionen.zyrosite.com"}>
							Gamla webbplatsen
						</Link>
						<Link href={"/personalrummet/ntc"}>NotisTestCenter (Beta)</Link>
					</div>
					<div id={styles.socialLinks} className={styles.footerCol}>
						<a
							href="https://www.instagram.com/clsektionen/"
							aria-label="CL-sektionens instagram"
						>
							<FontAwesomeIcon icon={faInstagram} />
						</a>
						<a
							href="https://www.facebook.com/groups/2388999847/"
							aria-label="CL-sektionens Facebooksida"
						>
							<FontAwesomeIcon icon={faFacebook} />
						</a>
						<a
							href="https://github.com/Webbutvecklare-CL/cl-sektionen.se/"
							aria-label="CL-sektionens GitHub"
						>
							<FontAwesomeIcon icon={faGithub} />
						</a>
						<a
							href="https://login.one.com/mail"
							aria-label="Mailsida för förtroendevalda"
						>
							<FontAwesomeIcon icon={faEnvelope} />
						</a>
						<Link
							href="/personalrummet"
							aria-label="Personalrummet för förtroendevalda"
						>
							<FontAwesomeIcon icon={faMugHot} />
						</Link>
					</div>
				</div>
			</div>
			<div className={styles.frameHolder}>
				<MapsFrame />
			</div>
		</footer>
	);
}
