import calStyles from "../../styles/kalender.module.css";

export default function CalendarLoader() {
	return (
		<div className={calStyles.loader}>
			<div>
				<p>Laddar kalendrar...</p>
			</div>
			<div
				className={`${calStyles.miniKalender} ${calStyles.kalenderTab} ${calStyles.gråttan} ${calStyles.månad}`}
			>
				<h1 className={calStyles.kalTitel}>Kalender</h1>
				<div>
					<p>Laddar kalendrar...</p>
				</div>
			</div>
		</div>
	);
}
