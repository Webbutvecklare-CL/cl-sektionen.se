import Link from "next/link";

import CustomHead from "@/components/CustomHead";

import styles from "@/styles/valen.module.css";

import { valensAventyrData } from "@/constants/valensAventyrData";

export default function ValensAventyr() {
	return (
		<>
			<CustomHead
				metaTitle={"Valens äventyr | Sektionen för Civilingenjör och Lärare"}
				description={"Här hittar du de äventyr som valen gjort."}
				url={"https://www.cl-sektionen.se/valen"}
			/>
			<div id="contentbody">
				<h1 id="page-title">Valens äventyr</h1>
				<p>Här kan du hitta de äventyr som SM-valen varit med om.</p>
				<p>
					Sidan skapades hösten 2024, så många berättelser saknas! Om du har
					några äventyr med valen förut, eller om du precis gjort det, så skicka
					in på{" "}
					<Link
						href="https://forms.gle/V8QaTnjUxZFmRuZZ8"
						target="_blank"
						rel="noopener noreferrer"
					>
						länken här
					</Link>
					! Många äldre äventyr kan du hitta på Instagram med{" "}
					<Link
						className={styles.hashtag}
						href={
							"https://www.instagram.com/explore/search/keyword/?q=%23valens%C3%A4ventyr"
						}
						target="_blank"
						rel="noopener noreferrer"
					>
						#valensaventyr
					</Link>
					.
				</p>
				{renderGroups()}
			</div>
		</>
	);
}

function renderGroups() {
	const sortedYears = Object.keys(valensAventyrData).sort((a, b) => b - a);

	return (
		<div className={styles.gridContainer}>
			{sortedYears.map((year) => (
				<div key={year} className={styles.yearContainer}>
					<h2 className={styles.yearTitle}>{year}</h2>
					<div className={styles.cardGrid}>
						{valensAventyrData[year].map((item) => (
							<Link
								key={year + item.sm}
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.cardLink}
							>
								<div className={styles.cardTitleContainer}>
									<span className={styles.cardTitle}>SM#{item.sm}</span>
									{item.person && (
										<span className={styles.cardName}>{item.person}</span>
									)}
									{!item.link && (
										<span className={styles.cardNoLink}>(Saknas)</span>
									)}
								</div>
							</Link>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
