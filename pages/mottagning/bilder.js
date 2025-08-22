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
							<Card link={"https://photos.app.goo.gl/5EG2SgMtmAD2YcDL6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2025-08-11
							</Card>
							<Card link={"https://photos.app.goo.gl/aud4YqtGPy5WDiZe7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2025-08-12
							</Card>
							<Card link={"https://photos.app.goo.gl/2jpk1tt91xQyHE5r7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2025-08-13
							</Card>
							<Card link={"https://photos.app.goo.gl/39QxjFTFv7PSGmkx7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2025-08-14
							</Card>
							<Card link={"https://photos.app.goo.gl/p9WCbcE656HDoZpg9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2025-08-15
							</Card>
							<Card link={"https://photos.app.goo.gl/zdBswjkTEJufLoRJ6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Söndag, 2025-08-17
							</Card>
						</div>
						<h2>Andra veckan v.34</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/WnYK87JhwqLqT1ky8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2025-08-18
							</Card>
							<Card link={"https://photos.app.goo.gl/PjgYBYeYbLkZAQUC7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2025-08-19
							</Card>
							<Card link={"https://photos.app.goo.gl/2qVjYcBAUE4vFb127"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2025-08-20
							</Card>
							<Card link={"https://photos.app.goo.gl/CNeNfn7KEgx8TR4q7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2025-08-21
							</Card>
							<Card link={"https://photos.app.goo.gl/qbdUxgQTaSiZsFCe7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2025-08-22
							</Card>
							<Card link={"https://photos.app.goo.gl/yJJkNVkipNPG3LiS7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Lördag, 2025-08-23
							</Card>
						</div>
						<h2>Tredje veckan v.35</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/5p5eW4FhcoD8SBru7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Nollepubrundan, 2025-08-27
							</Card>
							<Card link={"https://photos.app.goo.gl/au5wSX9v6nUvrLtP6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Mottagningshäng, 2025-08-28
							</Card>
							<Card link={"https://photos.app.goo.gl/vHsdC4iQqzocH2Jz5"} newTab>
								<FontAwesomeIcon icon={faImage} /> Adeptgasquen, 2025-08-29
							</Card>
						</div>
						<h2>Knäppisuppdrag</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/mrZaEAvGe1mbJusg7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Alfons Åberg
							</Card>
							<Card link={"https://photos.app.goo.gl/zTmnx6TNFrAbr3BH8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Bumbitåget
							</Card>
							<Card link={"https://photos.app.goo.gl/AUVbC6ceZNWnt2xcA"} newTab>
								<FontAwesomeIcon icon={faImage} /> Mumin
							</Card>
							<Card link={"https://photos.app.goo.gl/dfMj3yuYcAnn91ut5"} newTab>
								<FontAwesomeIcon icon={faImage} /> Nalle Puh
							</Card>
						</div>
						<h2>Tackgasquen</h2>
						<div className={styles.cardList}>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tackgasquen
							</Card>
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
