import styles from "@/styles/alumniblogg.module.css";
import Link from "next/link";
export default function Alumniblogg() {
	return (
		<div id="contentbody">
			<h1>Alumniblogg</h1>
			<p>
				På denna blogg hittar du inlägg från gamla CL studenter som tagit
				examen, alumner, och nu är ute i arbetslivet. De berättar om sin KTH
				tid, hur de fick sitt första jobb, vad de jobbar med och hur det är på
				deras arbetsplats, vad de gör på fritiden idag, och om livet i
				allmänhet.
			</p>
			<ul className={styles.alumniblogg}>
				<li>
					<Link href="/alumniblogg/mollie-wejdenstolpe">
						Mollie Wejdenstolpe CL13 Data
					</Link>
				</li>
				<li>
					<Link href="/alumniblogg/malin-engquist">
						Malin Engquist CL13 - bästa examensarbetet 2018 (intervju)
					</Link>
				</li>
				<li>
					<Link href="/alumniblogg/erik-evers">Erik Evers CL08 Kemi</Link>
				</li>
				<li>
					<Link href="/alumniblogg/henrik-moberg">
						Henrik Moberg Fysik CL08
					</Link>
				</li>
				<li>
					<Link href="/alumniblogg/isabelle-wahlund">
						Isabelle Wahlund CL08 Energi & Miljö
					</Link>
				</li>
				<li>
					<Link href="/alumniblogg/andreas-martensson">
						Andreas Mårtensson CL12
					</Link>
				</li>
				<li>
					<Link href="/alumniblogg/victor-dahlberg">
						Victor Dahlberg CL13 Fysik
					</Link>
				</li>
			</ul>
		</div>
	);
}
