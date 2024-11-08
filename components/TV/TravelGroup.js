import Image from "next/image";

import styles from "@/styles/tv.module.css";

export default function TravelGroup({ name, icon, data }) {
	return (
		<div className={styles.travelGroup}>
			<div className={styles.titleGroup}>
				<Image src={`/media/tv/${icon}.svg`} width={32} height={32} />
				<h2>{name}</h2>
			</div>
			<table className={styles.travelTable}>
				<tr className={styles.travelTableHeader}>
					<th className={styles.travelTableLine}>Linje</th>
					<th className={styles.travelTableDestination}>Destination</th>
					<th className={styles.travelTableTime}>Tid</th>
				</tr>
				{data.map((item, index) => (
					<tr key={index}>
						<td>{item.line}</td>
						<td>{item.destination}</td>
						<td>{item.time}</td>
					</tr>
				))}
			</table>
		</div>
	);
}
