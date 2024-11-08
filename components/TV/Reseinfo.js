import Image from "next/image";

import styles from "@/styles/tv.module.css";

export default function Reseinfo() {
	const fakeInfo = [
		{
			name: "Tunnelbana",
			icon: "tunnelbana",
			data: [
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
			],
		},
		{
			name: "Roslagsbana",
			icon: "roslagsbana",
			data: [
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
				{ line: 13, destination: "KTH", time: "07:00" },
			],
		},
		{
			name: "Buss",
			icon: "buss",
			data: [
				{ line: 47, destination: "Norrtälje", time: "07:00" },
				{ line: 47, destination: "Norrtälje", time: "07:00" },
				{ line: 888, destination: "Karolinska sjukhuset", time: "44 min" },
				{ line: 888, destination: "Karolinska sjukhuset", time: "44 min" },
				{ line: 888, destination: "KTH", time: "12 min" },
			],
		},
	];

	return (
		<div className={styles.travelColumn}>
			<h1>Reseinfo</h1>
			{fakeInfo.map((item) => (
				<TravelGroup key={item.name} {...item} />
			))}
		</div>
	);
}

function TravelGroup({ name, icon, data }) {
	return (
		<div className={styles.travelGroup}>
			<div className={styles.titleGroup}>
				<Image src={`/media/tv/${icon}.svg`} width={32} height={32} />
				<h2>{name}</h2>
			</div>
			<table className={styles.travelTable}>
				<tr className={styles.travelTableHeader}>
					<th className={styles.travelTableLine}>Linje</th>
					<th className={styles.travelTableDestination}>Mot</th>
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
