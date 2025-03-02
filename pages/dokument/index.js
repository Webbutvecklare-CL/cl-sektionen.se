import Card from "@/components/Card";
import CustomHead from "@/components/CustomHead";
import MarkdownRender from "@/components/MarkdownRender";
import { getContentData } from "@/utils/contents";
import Link from "next/link";
import React from "react";

import styles from "@/styles/dokument.module.css";

import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import {
	faFileLines,
	faFilePdf,
	faFolder,
} from "@fortawesome/free-regular-svg-icons";
import {
	faAddressCard,
	faFileInvoiceDollar,
	faHouse,
	faMartiniGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Dokument({ contents }) {
	return (
		<>
			<CustomHead
				metaTitle={"Dokument | Sektionen för Civilingenjör och Lärare"}
				description={
					"Här hittar du styrdokument, praxisdokument, blanketter och mallar."
				}
				url={"https://www.cl-sektionen.se/dokument"}
			/>
			<div id="contentbody">
				<h1 id="page-title">Dokument</h1>
				<p>
					Nedan finner du ett stort urval av sektionens dokument. De flesta
					borde finnas nedan, men alla går att hitta på{" "}
					<Link href="https://drive.google.com/drive/folders/0ADBr-hLQqEIMUk9PVA">
						Sektionens drive
					</Link>
					. Hojta till Webbutvecklare eller Webbunderhållare om något saknas.
				</p>
				<h2>Blanketter, mallar och lathundar</h2>
				<div className={styles.cards}>
					<Card link="https://drive.google.com/drive/folders/1AiHJ65areh-OA9Uyf5yZFQV_x2i2RS6Y?usp=drive_link">
						<FontAwesomeIcon icon={faFolder} />
						Alla mallar
					</Card>
					<Card link="https://drive.google.com/file/d/1I3bKFoR5PRMrIl-_SFrGBcC5_JMVPWPM/view?usp=drive_link">
						<FontAwesomeIcon icon={faFilePdf} /> Utläggsblankett
					</Card>
					<Card link="https://docs.google.com/document/d/1BxySegqiWihlavewTlbLEPKaY3XAOuSA7fJPdoS-U-w/edit?usp=sharing">
						<FontAwesomeIcon icon={faFileLines} /> Mall för digitalt signerat
						kvitto
					</Card>
					<Card link="https://docs.google.com/document/d/1cqWZFaQ8CyRdVJ8qTxTLiFinnVLjPE0QKf3rvVIx6BA/edit?usp=sharing">
						<FontAwesomeIcon icon={faFileLines} /> Mall för handsignerat kvitto
					</Card>
					<Card link="https://drive.google.com/file/d/1aBCjU8wfLI5NwNNPjf-RabC1G4ZxM-wn/view">
						<FontAwesomeIcon icon={faFilePdf} /> Milersättningsblankett
					</Card>
					<Card link="https://docs.google.com/document/d/1R9VzViVigsH3GzNqoHZJUYT3qf6Nw878BST8yCr3Dik">
						<FontAwesomeIcon icon={faFileLines} /> Mall för entledigande
					</Card>
					<Card link="https://docs.google.com/document/d/17srFoYElH16ysq_xeu_jlue3W4cxYeJsYgRA2FRWLus">
						<FontAwesomeIcon icon={faFileLines} /> Mall för motion
					</Card>
					<Card link="https://docs.google.com/document/d/1-LNWlpYvrYVFwJ9H9fZZO4-a9XAB8KLULQGBnuCX8pQ">
						<FontAwesomeIcon icon={faFileLines} /> Mall för äskan
					</Card>
					<Card link="https://docs.google.com/document/d/1iKTCjjld17XxJUKBo9cWCmr1A_vmsATD">
						<FontAwesomeIcon icon={faFileLines} /> CL:s SM-ord
					</Card>
					<Card link="https://docs.google.com/document/d/1xvkaImZgTlshVRRpyNc31_lrnB1qrEwMHUgF8ei21fs/edit?usp=sharing">
						<FontAwesomeIcon icon={faFileLines} /> Rapportmall SM
					</Card>
					<Card link="https://docs.google.com/forms/d/e/1FAIpQLSfm0gD5AJ5s2YNpaO9rXq31FDSHdLjnbPeG4V7bdtmh3l1dPQ/viewform?usp=sharing">
						<FontAwesomeIcon icon={faWpforms} /> Formulärsmall
					</Card>
				</div>

				<h2>Protokoll och handlingar från SM och StyM</h2>
				<div className={styles.cards}>
					<Card link="https://drive.google.com/drive/folders/197L5LUdD8NgNALDWXY0odhP-Owoi5jKP">
						<FontAwesomeIcon icon={faFolder} /> SM 2025
					</Card>
					<Card link="https://drive.google.com/drive/folders/1iiXb0_HOgV60qL1FU72QBUJF1hXoaix0">
						<FontAwesomeIcon icon={faFolder} /> StyM 2025
					</Card>
					<Card link="https://drive.google.com/drive/folders/1ORNw9mBO9rBp1whbjSzHPMoKN4LmLnbt">
						<FontAwesomeIcon icon={faFolder} /> SM Arkiv
					</Card>
					<Card link="https://drive.google.com/drive/folders/1s_kHfXsbXC-Zi8nIOlXhdze0E_sjm_uD">
						<FontAwesomeIcon icon={faFolder} /> StyM Arkiv
					</Card>
				</div>

				<h2>Praxisdokument</h2>
				<p>
					Har som syfte att samla viktig information som inte passar in i något
					av sektionens styrdokument. Notera att dessa är levande dokument.
				</p>
				<div className={`${styles.cards} ${styles.praxisCards}`}>
					<Card link="/dokument/alkoholservering">
						<FontAwesomeIcon icon={faMartiniGlass} /> Rutiner för{" "}
						<b>alkoholservering</b>
					</Card>
					<Card link="/dokument/lokalbokning">
						<FontAwesomeIcon icon={faHouse} /> Praxis för <b>lokalbokning</b>
					</Card>
					<Card link="/dokument/personuppgifter">
						<FontAwesomeIcon icon={faAddressCard} /> Hantering av{" "}
						<b>personuppgifter</b>
					</Card>
					<Card link="/dokument/utlagg">
						<FontAwesomeIcon icon={faFileInvoiceDollar} /> Praxis för{" "}
						<b>utlägg</b>
					</Card>
				</div>

				<h2>Styrdokument</h2>
				<div className={styles.cards}>
					<Card link="https://drive.google.com/drive/folders/1Nwg-S7C0YZ0FAeoQtQoQs2NpAcB9Jacb?usp=drive_link">
						<FontAwesomeIcon icon={faFolder} />
						Alla styrdokument
					</Card>
					<Card link="https://drive.google.com/drive/folders/1uI6-LtpxZ0w3kZuo8Hf3GHcx6SwazfC7">
						<FontAwesomeIcon icon={faFolder} /> Policys
					</Card>
					<Card link="https://drive.google.com/drive/folders/1bMfLOZxG6-yIjI38L5csqixe_FXY5Ma1">
						<FontAwesomeIcon icon={faFolder} /> Praxis
					</Card>
					<Card link="https://drive.google.com/file/d/1VquRwgakGEWAZezuBrMNvqyBIDkJtA6x/view?usp=drive_web">
						<FontAwesomeIcon icon={faFilePdf} /> Ekonomiskt regelverk
					</Card>
					<Card link="https://drive.google.com/file/d/1Dey5wOO4O-jb2SvQMl43JsQ6dHzCR4vP/view?usp=drive_web">
						<FontAwesomeIcon icon={faFilePdf} /> Uppförandekod
					</Card>
					<Card link="https://drive.google.com/file/d/1kRL_V5opBUguLuqFSdjamFqcKNKXL7op/view?usp=drive_web">
						<FontAwesomeIcon icon={faFilePdf} /> Gråttboken
					</Card>
					<Card link="https://drive.google.com/file/d/1iPObXIk4zckF1b70JIOezrjkK5R3MCu_/view?usp=drive_web">
						<FontAwesomeIcon icon={faFilePdf} /> Reglemente
					</Card>
					<Card link="https://drive.google.com/file/d/1KEP4uWzteiCP8Ce-jLW0XeVINW6iOf2V/view?usp=drive_web">
						<FontAwesomeIcon icon={faFilePdf} /> Stadgar
					</Card>
					<Card link="https://drive.google.com/file/d/1SWygyIWxNqOwwIvqmfHx8s-cKH7voL5p/view?usp=drive_web">
						<FontAwesomeIcon icon={faFilePdf} /> Budget 2025
					</Card>
					<Card link="https://drive.google.com/file/d/1KuZmVOeegFd-iAuLf1WRzpUNS0f4Z1jI/view?usp=drive_web">
						<FontAwesomeIcon icon={faFilePdf} /> Ekonomisk femårsplan 2025-2029
					</Card>
				</div>

				<h2>Verksamhets-berättelser och planer</h2>
				<div className={styles.cards}>
					<Card link="https://drive.google.com/file/d/1fEAof3da4qs0NKCh0aVpVKPmZCiDXJd-/view?usp=drive_link"> <!-- Hittar inte verksamhetsberättelse 2024 -->
						<FontAwesomeIcon icon={faFilePdf} /> Verksamhetsberättelse 2023
					</Card>
					<Card link="https://drive.google.com/file/d/1GkK2Jk98GWDVdNXiJaVW6PbFhCLTBtqU/view?usp=drive_web"> <!-- Länkar till verksamhetsplanen i 1. Styrdokument -->
						<FontAwesomeIcon icon={faFilePdf} /> Verksamhetsplan 2025
					</Card>
					<Card link="https://drive.google.com/drive/folders/1NJxJnjQIhetEji1W8RFBw4iaHgoy6kJy?usp=drive_link">
						<FontAwesomeIcon icon={faFolder} /> Verksamhetsberättelser
					</Card>
					<Card link="https://drive.google.com/drive/folders/1ur6z60_ph3TmlQCv2fxI2blCaqqhvZdV?usp=drive_link">
						<FontAwesomeIcon icon={faFolder} /> Verksamhetsplaner
					</Card>
				</div>
				<section id={`${styles.rights} rättigheter`}>
					<MarkdownRender mdData={contents.rattigheter} />
				</section>
			</div>
		</>
	);
}

export async function getStaticProps() {
	const contents = getContentData("dokument");
	return {
		props: {
			contents,
		},
	};
}
