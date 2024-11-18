import styles from "@/styles/tv.module.css";

import Image from "next/image";

const iconMap = {
	tunnelbana: "/media/tv/tunnelbana.svg",
	roslagsbana: "/media/tv/roslagsbana.svg",
	buss: "/media/tv/buss.svg",
};

export default function TravelGroup({ isDay, name, icon, data }) {
	const srcImage = iconMap[icon] || null;

	return (
		<div className={styles.travelGroup}>
			<div className={styles.titleGroup}>
				<Image src={srcImage} width={32} height={32} alt={`ikon för ${icon}`} />
				<h2>{name}</h2>
			</div>
			<table className={styles.travelTable}>
				<tbody>
					<tr className={styles.travelTableHeader}>
						<th className={styles.travelTableLine}>Linje</th>
						<th className={styles.travelTableDestination}>Destination</th>
						<th className={styles.travelTableTime}>Tid</th>
					</tr>
					{data.map((item, index) => (
						<tr
							key={index}
							className={`${index % 2 === 1 ? styles.oddRow : ""} ${
								isDay && index % 2 === 1 ? styles.oddRowDay : ""
							}`}
						>
							<td>{item.line}</td>
							<td>{item.destination}</td>
							<td>{item.time}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
