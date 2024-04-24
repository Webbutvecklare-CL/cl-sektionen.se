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
							<Card link={"https://photos.app.goo.gl/MAKizBYoNMjZqKz66"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2023-08-14
							</Card>
							<Card link={"https://photos.app.goo.gl/bj2yPMQSFWy8JPcL8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2023-08-15
							</Card>
							<Card link={"https://photos.app.goo.gl/vubczCPjjf6eJ4os6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2023-08-16
							</Card>
							<Card link={"https://photos.app.goo.gl/NiJkQ46ZtAEDS8ko6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2023-08-17
							</Card>
							<Card link={"https://photos.app.goo.gl/QixKWNwMwpSr7tqZ8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-18
							</Card>
						</div>
						<h2>Andra veckan v.34</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/ZPGNF2rkdmVStXbU8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2023-08-21
							</Card>
							<Card link={"https://photos.app.goo.gl/8ucyVvuJqPXvbkjD6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2023-08-22
							</Card>
							<Card disabled>
								<FontAwesomeIcon icon={faImage} />
								Onsdag, 2023-08-23 (Kårensdag, inga bilder)
							</Card>
							<Card link={"https://photos.app.goo.gl/K8TBohmkxUb7yvYh8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2023-08-24
							</Card>
							<Card link={"https://photos.app.goo.gl/eAwsDEbh356H1WcS9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-25
							</Card>
							<Card link={"https://photos.app.goo.gl/ecJMjVQksG4eFS8q7"} newTab>
								<FontAwesomeIcon icon={faImage} /> Lördag, 2023-08-26
							</Card>
						</div>
						<h2>Tredje veckan</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/AZiTVo8FwcVk14c79"} newTab>
								<FontAwesomeIcon icon={faImage} /> NPR, 2023-08-25
							</Card>
							<Card link={"https://photos.app.goo.gl/R2BoHMQhE9beLs8e9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Adeptgasquen, 2023-08-25
							</Card>
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
