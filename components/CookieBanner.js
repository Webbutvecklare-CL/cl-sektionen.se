import Link from "next/link";

import styles from "../styles/cookie-banner.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CookieBanner({ setCookieState }) {
	return (
		<div className={styles.banner}>
			<div className={styles.content}>
				<p className={styles.text}>
					Vi använder kakor och liknande teknik för att ge dig en förbättrad
					upplevelse, sammanställa statistik och för att viss nödvändig
					funktionalitet ska fungera på webbplatsen. Vi lämnar aldrig ut
					information till tredjepart.{" "}
					<Link href="/kakor">Läs mer om hur vi använder kakor</Link>
				</p>
				<div className={styles.menu}>
					<button
						type="button"
						className={`${styles.button} small`}
						onClick={() => {
							setCookieState(true);
						}}
					>
						Godkänn alla
					</button>
					<button
						type="button"
						className={`${styles.button} small`}
						onClick={() => {
							setCookieState(false);
						}}
					>
						Godkänn nödvändiga
					</button>
				</div>
			</div>
			<button
				type="button"
				className={styles.close}
				onClick={() => {
					setCookieState(false);
				}}
			>
				<FontAwesomeIcon icon={faXmark} />
			</button>
		</div>
	);
}
