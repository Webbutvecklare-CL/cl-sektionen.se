import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import australienEmoji from "@/media/flagemojis/australien.svg";
import botswanaEmoji from "@/media/flagemojis/botswana.svg";
import irlandEmoji from "@/media/flagemojis/irland.svg";
import italienEmoji from "@/media/flagemojis/italien.svg";
import kanadaEmoji from "@/media/flagemojis/kanada.svg";
import singaporeEmoji from "@/media/flagemojis/singapore.svg";
import taiwanEmoji from "@/media/flagemojis/taiwan.svg";
import tjeckienEmoji from "@/media/flagemojis/tjeckien.svg";
import turkietEmoji from "@/media/flagemojis/turkiet.svg";
import tysklandEmoji from "@/media/flagemojis/tyskland.svg";
import usaEmoji from "@/media/flagemojis/usa.svg";

import styles from "@/styles/reseberattelser.module.css";

const continents = [
	{ name: "Nordamerika", emoji: "🌎" },
	{ name: "Sydamerika", emoji: "🌎" },
	{ name: "Europa", emoji: "🌍" },
	{ name: "Afrika", emoji: "🌍" },
	{ name: "Asien", emoji: "🌏" },
	{ name: "Oceanien", emoji: "🌏" },
];

export default function Reseberattelser() {
	const [activeContinent, setActiveContinent] = useState();

	const handleContinentClick = (continent) => {
		if (activeContinent === continent) {
			setActiveContinent(undefined);
		} else {
			setActiveContinent(continent);
		}
		document
			.getElementById(styles.scrollNode)
			.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div>
			<h1 id="page-title">Information om utbytesstudier</h1>
			<p>
				Välkommen till sidan för utbytesstudier på CL! Här hittar du svar på vanliga frågor 
				om utbyte, reseberättelser från tidigare studenter och annan användbar information. 
				Har du några frågor är det bara att höra av dig till <a href="mailto:utbyte@cl-sektionen.se">utbyte@cl-sektionen.se</a>.
			</p>
			<p><a href="https://docs.google.com/document/d/1pGG23oS2RZcEwONIr8c--2mfyrHoydZ5nzcAxXEbNTI/edit?usp=sharing" target="_blank">FAQ Utlandsstudier</a></p>
			<p><a href="https://docs.google.com/spreadsheets/d/1uoxt_fZzsGwb4XnSBMJKRhQ8r6qdIAyoYliIYP0UXEc/edit?usp=sharing" target="_blank">Utbytesuniversitet för CL + Räkna ut meritvärde</a></p>
			<p><a href="https://docs.google.com/spreadsheets/d/1J2l57flYD0CeHAUCy4PJol-0qxTv-pvgnYmUTqOdS8k/edit?usp=sharing" target="_blank">Tidigare tillgodoräknade kursen</a></p>
		</div>
		<div id="contentbody">
			<h2>Reseberättelser</h2>
			<p>
				Klicka en världsdel för att filtrera reseberättelser eller scrolla ned
				för att se alla!
			</p>
			<div className={styles.mapSelector}>
				{continents.map((continent) => (
					<button
						type="button"
						key={continent.name}
						className={`${styles.continentButton} ${
							activeContinent === continent.name ? styles.active : ""
						}`}
						onClick={() => handleContinentClick(continent.name)}
					>
						<span className={styles.continentEmoji}>{continent.emoji}</span>
						{continent.name}
					</button>
				))}
			</div>
			<div id={styles.scrollNode} />
			{!activeContinent || activeContinent === "Nordamerika" ? (
				<div>
					<h3>Nordamerika</h3>
					<div className={styles.grid}>
						<Link
							href="/reseberattelser/anton-sundberg-usa"
							className={styles.card}
						>
							<span className={styles.cardName}>Anton Sundberg</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>USA</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={usaEmoji}
										alt={"USA-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/caroline-stejmar-kanada"
							className={styles.card}
						>
							<span className={styles.cardName}>Caroline Stejmar</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Kanada</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={kanadaEmoji}
										alt={"Kanada-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/astrid-häggström-usa"
							className={styles.card}
						>
							<span className={styles.cardName}>Astrid Häggström</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>USA</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={usaEmoji}
										alt={"USA-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/ida-marie-freden-usa"
							className={styles.card}
						>
							<span className={styles.cardName}>Ida-Marie Fréden</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>USA</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={usaEmoji}
										alt={"USA-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/sabina-permats-usa"
							className={styles.card}
						>
							<span className={styles.cardName}>Sabina Permats</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>USA</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={usaEmoji}
										alt={"USA-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
					</div>
				</div>
			) : null}
			{!activeContinent || activeContinent === "Europa" ? (
				<div>
					<h3>Europa</h3>
					<div className={styles.grid}>
						<Link
							href="/reseberattelser/camilla-björn-irland"
							className={styles.card}
						>
							<span className={styles.cardName}>Camilla Björn</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Irland</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={irlandEmoji}
										alt={"Irland-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/camilla-björn-tyskland"
							className={styles.card}
						>
							<span className={styles.cardName}>Camilla Björn</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Tyskland</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={tysklandEmoji}
										alt={"Tyskland-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/ida-fantenberg-niklasson-irland"
							className={styles.card}
						>
							<span className={styles.cardName}>Ida Fantenberg Niklasson</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Irland</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={irlandEmoji}
										alt={"Irland-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/julia-engström-italien"
							className={styles.card}
						>
							<span className={styles.cardName}>Julia Engström</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Italien</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={italienEmoji}
										alt={"Italien-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/ewa-hörnlund-tjeckien"
							className={styles.card}
						>
							<span className={styles.cardName}>Ewa Hörnlund</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Tjeckien</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={tjeckienEmoji}
										alt={"Tjeckien-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/philip-gullberg-tjeckien"
							className={styles.card}
						>
							<span className={styles.cardName}>Philip Gullberg</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Tjeckien</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={tjeckienEmoji}
										alt={"Tjeckien-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/philip-gullberg-tjeckien"
							className={styles.card}
						>
							<span className={styles.cardName}>Philip Gullberg</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Tjeckien</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={tjeckienEmoji}
										alt={"Tjeckien-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/sander-söderberg-tjeckien"
							className={styles.card}
						>
							<span className={styles.cardName}>Sander Söderberg</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Tjeckien</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={tjeckienEmoji}
										alt={"Tjeckien-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
					</div>
				</div>
			) : null}
			{!activeContinent || activeContinent === "Asien" ? (
				<div>
					<h3>Asien</h3>
					<div className={styles.grid}>
						<Link
							href="/reseberattelser/william-friefeldt-taiwan"
							className={styles.card}
						>
							<span className={styles.cardName}>William Friefeldt</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Taiwan</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={taiwanEmoji}
										alt={"Taiwan-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/furkan-kocak-turkiet"
							className={styles.card}
						>
							<span className={styles.cardName}>Furkan Kocak</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Turkiet</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={turkietEmoji}
										alt={"Turkiet-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/albin-westlin-singapore"
							className={styles.card}
						>
							<span className={styles.cardName}>Albin Westlin</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Singapore</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={singaporeEmoji}
										alt={"Singapore-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
					</div>
				</div>
			) : null}
			{!activeContinent || activeContinent === "Oceanien" ? (
				<div>
					<h3>Oceanien</h3>
					<div className={styles.grid}>
						<Link
							href="/reseberattelser/anna-stolpe-australien"
							className={styles.card}
						>
							<span className={styles.cardName}>Anna Stolpe</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Australien</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={australienEmoji}
										alt={"Australien-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/emelie-selinder-australien"
							className={styles.card}
						>
							<span className={styles.cardName}>Emelie Selinder</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Australien</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={australienEmoji}
										alt={"Australien-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
					</div>
				</div>
			) : null}
			{!activeContinent || activeContinent === "Afrika" ? (
				<div>
					<h3>Afrika</h3>
					<div className={styles.grid}>
						<Link
							href="/reseberattelser/veronica-vilbern-botswana"
							className={styles.card}
						>
							<span className={styles.cardName}>Veronica Vilbern</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Botswana</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={botswanaEmoji}
										alt={"Botswana-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
						<Link
							href="/reseberattelser/edith-jacobson-botswana"
							className={styles.card}
						>
							<span className={styles.cardName}>Edith Jacobson</span>
							<div className={styles.cardLocationContainer}>
								<span className={styles.cardLocation}>Botswana</span>
								<div className={styles.cardEmojiContainer}>
									<Image
										className={styles.cardEmoji}
										src={botswanaEmoji}
										alt={"Botswana-emoji"}
										height={16}
									/>
								</div>
							</div>
						</Link>
					</div>
				</div>
			) : null}
			{!activeContinent || activeContinent === "Sydamerika" ? (
				<div>
					<h3>Sydamerika</h3>
					<div className={styles.grid}>Inga reseberättelser här än</div>
				</div>
			) : null}
		</div>
	);
}
