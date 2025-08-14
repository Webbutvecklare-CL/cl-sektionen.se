import BackButton from "@/components/BackButton";
import CustomHead from "@/components/CustomHead";

import styles from "@/styles/mottagning/knappis.module.css";

export default function KnappisUppdrag() {
	return (
		<>
			<CustomHead
				metaTitle={
					"Knäppis poängjakt 2025 | Sektionen för Civilingenjör och Lärare"
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
						Målet är att fånga de 15 olika motiven listade nedan, och utöver dessa fylla resterande kamerarullen med
						minnesvärda bilder från dagen. Någon från Knäppis eller Bästis kommer vid kvällens slut/när de lämnar
						Bästismiddagen ta med sig kameran för framkallning och poängsättning. Ha det så kul och lycka till!
					</p>
					<table className={styles.knappisTable}>
						<thead>
							<tr>
								<th>#</th>
								<th>Motiv</th>
								<th>Poäng</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1</td>
								<td>En mottagare från varje inriktning i samma bild</td>
								<td>1-4 p</td>
							</tr>
							<tr>
								<td>2</td>
								<td>
									En bild på något barnsligt roligt
								</td>
								<td>7 p</td>
							</tr>
							<tr>
								<td>3</td>
								<td>En bild på hela Adeptgruppen</td>
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
								<td>1-3 p</td>
							</tr>
							<tr>
								<td>6</td>
								<td>Gruppansvariga mottagare i samma bild</td>
								<td>1-12 p</td>
							</tr>
							<tr>
								<td>7</td>
								<td>Roligast djur</td>
								<td>5 p</td>
							</tr>
							<tr>
								<td>8</td>
								<td>Någon på språng</td>
								<td>1-5 p</td>
							</tr>
							<tr>
								<td>9</td>
								<td>Annan Adeptgrupp</td>
								<td>1-4 p</td>
							</tr>
							<tr>
								<td>10</td>
								<td>Återskapning av scen ur barnserie/fil</td>
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
								<td>1-5 p</td>
							</tr>
							<tr>
								<td>13</td>
								<td>Knäpp en knäppis (utan att bli upptäckt)</td>
								<td>5 p</td>
							</tr>
							<tr>
								<td>14</td>
								<td>Något som känns olagligt men inte är det</td>
								<td>1-5 p</td>
							</tr>
							<tr>
								<td>15</td>
								<td>Den mest överraskande bilden</td>
								<td>1-10 p</td>
							</tr>
						</tbody>
					</table>
					<p>
						Tips:
						<ul>
							<li>
								Det ska finnas information på kameran gällande exempelvis fokusavstånd (hur långt bort saker
								som ska se skarpa ut får vara), använd den informationen hur ni vill.
							</li>
							<li>
								Det är svårt att få bilder som ser annat än svarta och suddiga ut när det väl skymmer, så försök
								tömma rullen innan solen går ner och det blir för mörkt.
							</li>
						</ul>
					</p>
				</article>
			</div>
		</>
	);
}
