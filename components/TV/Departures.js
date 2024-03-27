import styles from "../../styles/tv.module.css";

export default function Departures({ data }) {
	return (
		<div className={styles.departures}>
			{data.map((departure, i) => {
				return (
					<div className={styles.departure} key={i}>
						<div className={styles.line}>{departure.LineNumber}</div>
						<div className={styles.destination}>{departure.Destination}</div>
						<div className={styles.displayTime}>{departure.DisplayTime}</div>
					</div>
				);
			})}
		</div>
	);
}
