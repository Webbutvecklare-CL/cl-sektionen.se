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
							<Card link={"https://photos.app.goo.gl/YmnuwTBvmA12XBFG9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2023-08-12
							</Card>
							<Card link={"https://photos.app.goo.gl/AsAJ6kmDqHxxY3Zo9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2023-08-13
							</Card>
							<Card link={"https://photos.app.goo.gl/XFEZYjq9e3ZNx7tc8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2023-08-14
							</Card>
							<Card link={"https://photos.app.goo.gl/T7bzVYk1tegqdwtq5"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2023-08-15
							</Card>
							<Card link={"https://photos.app.goo.gl/EC2eMgJmTTugz5yS8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-16
							</Card>
						</div>
						<h2>Andra veckan v.34</h2>
						<div className={styles.cardList}>
							<Card link={"https://photos.app.goo.gl/Df9nTtZW6TSZhLFg9"} newTab>
								<FontAwesomeIcon icon={faImage} /> Måndag, 2023-08-19
							</Card>
							<Card link={"https://photos.app.goo.gl/DXVD14e21A1FZrnC6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Tisdag, 2023-08-20
							</Card>
							<Card link={"https://photos.app.goo.gl/98azoc4nSNr3ZTa9A"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2023-08-21
							</Card>
							<Card link={"https://photos.app.goo.gl/MhKnp4qEEttKteX46"} newTab>
								<FontAwesomeIcon icon={faImage} /> Torsdag, 2023-08-22
							</Card>
							<Card link={"https://photos.app.goo.gl/6k691BhPecFEPwfA6"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-23
							</Card>
						</div>
						<h2>Tredje veckan v.35</h2>
						<div className={styles.cardList}>
							{
								//dold tills vidare
								false && (
									<Card
										link={"https://photos.app.goo.gl/9Ngyd2VLw78JBiPdA"}
										newTab
									>
										<FontAwesomeIcon icon={faImage} /> Tisdag, 2023-08-27
									</Card>
								)
							}
							<Card link={"https://photos.app.goo.gl/HA8uRyqsfC9kYWFg8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Onsdag, 2023-08-28
							</Card>
							<Card link={"https://photos.app.goo.gl/3ni7aGwZaMuC8eip8"} newTab>
								<FontAwesomeIcon icon={faImage} /> Fredag, 2023-08-30
							</Card>
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
