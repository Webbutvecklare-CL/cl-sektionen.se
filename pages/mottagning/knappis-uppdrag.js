import BackButton from "@/components/BackButton";
import CustomHead from "@/components/CustomHead";

import styles from "@/styles/mottagning/knappis.module.css";

export default function KnappisUppdrag() {
	return (
		<>
			<CustomHead
				metaTitle={
					"Knäppis-uppdrag mottagningen | Sektionen för Civilingenjör och Lärare"
				}
				description={"Knäppis-uppdrag för Stadsjakten på mottagningen."}
				url={"https://www.cl-sektionen.se/mottagning/knappis-uppdrag"}
			/>
			<div id="contentbody" className="wideContent">
				<article>
					<div className="article-head">
						<BackButton page="mottagning">Mottagningssidan</BackButton>
					</div>
					<p>
						Här finns uppdraget för Knäppis fototävling som pågår idag. Varje
						grupp får varsin engångskamera med 27 bilder. Den använder ni för
						att samla poäng, från att stadsjakten börjar till att kvällen är
						slut. En Knäppis eller Bästis kommer ta kameran efter Bästismiddagen
						ikväll.
					</p>
					<p>
						Tabellen nedan visar de 15 uppdragen, och hur mycket poäng man kan
						få. De behöver inte göras i ordning. Var kreativa, gör ert bästa men
						framförallt ha roligt tillsammans! Det finns lite felmarginal med
						antalet bilder, så ta några stycken på annat också!
					</p>
					<table className={styles.knappisTable}>
						<thead>
							<tr>
								<th>#</th>
								<th>Uppdrag</th>
								<th>Poäng</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1</td>
								<td>En mottagare från varje inriktning i samma bild</td>
								<td>4 p</td>
							</tr>
							<tr>
								<td>2</td>
								<td>
									Något med pirat-tema som inte är kopplat till mottagningen
								</td>
								<td>7 p</td>
							</tr>
							<tr>
								<td>3</td>
								<td>En gruppbild på hela Adeptgruppen</td>
								<td>3 p</td>
							</tr>
							<tr>
								<td>4</td>
								<td>Någon som är där hen inte borde vara</td>
								<td>4 p</td>
							</tr>
							<tr>
								<td>5</td>
								<td>En Bästis som lagar mat</td>
								<td>4 p</td>
							</tr>
							<tr>
								<td>6</td>
								<td>Fånga två gruppansvariga mottagare i samma bild</td>
								<td>10 p</td>
							</tr>
							<tr>
								<td>7</td>
								<td>En humla</td>
								<td>5 p</td>
							</tr>
							<tr>
								<td>8</td>
								<td>Någon på språng</td>
								<td>3 p</td>
							</tr>
							<tr>
								<td>9</td>
								<td>En annan Adeptgrupp</td>
								<td>4 p</td>
							</tr>
							<tr>
								<td>10</td>
								<td>En återskapning av en känd scen</td>
								<td>3-5 p</td>
							</tr>
							<tr>
								<td>11</td>
								<td>Något gulligt</td>
								<td>2-4 p</td>
							</tr>
							<tr>
								<td>12</td>
								<td>En riktigt “go stund” med “gänget”</td>
								<td>3 p</td>
							</tr>
							<tr>
								<td>13</td>
								<td>Knäpp en knäppis (utan att bli upptäckt)</td>
								<td>5 p</td>
							</tr>
							<tr>
								<td>14</td>
								<td>Något som känns olagligt men inte är det</td>
								<td>6 p</td>
							</tr>
							<tr>
								<td>15</td>
								<td>Den mest överraskande bilden</td>
								<td>1-10 p</td>
							</tr>
						</tbody>
					</table>
				</article>
			</div>
		</>
	);
}
