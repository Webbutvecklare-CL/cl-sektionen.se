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
								<FontAwesomeIcon icon={faImage} /> Måndag, 2023-08-14
							</Card>
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
