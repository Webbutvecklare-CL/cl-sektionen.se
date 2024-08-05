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
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2023-08-12
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2023-08-13
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2023-08-14
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2023-08-15
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-16
							</Card>
						</div>
						<h2>Andra veckan v.34</h2>
						<div className={styles.cardList}>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2023-08-19
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2023-08-20
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2023-08-21
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2023-08-22
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-23
							</Card>
						</div>
						<h2>Tredje veckan v.35</h2>
						<div className={styles.cardList}>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2023-08-28
							</Card>
							<Card link={"./bilder"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-30
							</Card>
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
