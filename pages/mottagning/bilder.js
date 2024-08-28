import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import CustomHead from "@/components/CustomHead";
import styles from "@/styles/mottagning/mottagning.module.css";

import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Bilder() {
	return (
		<>
			<CustomHead
				metaTitle={"Mottagningsbilder | Sektionen för Civilingenjör och Lärare"}
				description={"Här finns alla bilder tagna under mottagningen."}
				url={"https://www.cl-sektionen.se/mottagning/bilder"}
			/>
			<div id="contentbody">
				<article>
					<BackButton page="mottagning">Mottagningssidan</BackButton>
					<div>
						<br />
						<p>
							Här hittar du länkar till Google Photos album som innehåller alla
							mottagningsbilder. Tänk på att inte dela bilder på andra utan
							tillåtelse.
							<br />
							Kontakta <strong>knäppis</strong> om du inte vill synas på bild.
						</p>
						<h2>Första veckan v.33</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/qzo2gDvZz9cZM9j47"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2024-08-12
							</Card>
							<Card link={"https://photos.app.goo.gl/XBEUsrYwRZQMeE3D9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2024-08-13
							</Card>
							<Card link={"https://photos.app.goo.gl/hGBUZxYagZYCgVFG7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2024-08-14
							</Card>
							<Card link={"https://photos.app.goo.gl/dMWkZm8mQAEiXvr1A"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2024-08-15
							</Card>
							<Card link={"https://photos.app.goo.gl/d723YArJuzTRK35m7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2024-08-16
							</Card>
						</div>
						<h2>Andra veckan v.34</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/huFfTeRaKy5NEDwL8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2024-08-19
							</Card>
							<Card link={"https://photos.app.goo.gl/rYGYG6eE2A8Mc2dP7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2024-08-20
							</Card>
							<Card link={"https://photos.app.goo.gl/VmbPaZ9sjWWcJwY49"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2024-08-21
							</Card>
							<Card link={"https://photos.app.goo.gl/k4d4RxyN3jRNrgjz9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2024-08-22
							</Card>
							<Card link={"https://photos.app.goo.gl/Q4VT2NEfAHF4VahK8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2024-08-23
							</Card>
							<Card link={"https://photos.app.goo.gl/HWerGSYJ92mG2GkL7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Lördag, 2024-08-24
							</Card>
						</div>
						<h2>Tredje veckan v.35</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/C6r1ztDa14P5YEos5"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2024-08-28
							</Card>
							<Card link={"https://photos.app.goo.gl/iDpbNADtEu29JkWd8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2024-08-30
							</Card>
						</div>
						<h2>Knäppisupprag</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/yqpQAJvKyzmbd5E26"} newTab>
								<FontAwesomeIcon icon={faImage} /> Black Pearl
							</Card>
							<Card link={"https://photos.app.goo.gl/ZVD3qRGpvjkj7zY96"} newTab>
								<FontAwesomeIcon icon={faImage} /> Flygande Holländaren
							</Card>
							<Card link={"https://photos.app.goo.gl/u4dNRXHFWtGj3ZZXA"} newTab>
								<FontAwesomeIcon icon={faImage} /> Hoppetossa
							</Card>
							<Card link={"https://photos.app.goo.gl/xc1R36p39ccNPrqK8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Jolly Roger
							</Card>
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
