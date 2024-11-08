import styles from "@/styles/tv.module.css";

import TravelGroup from "./TravelGroup";

export async function getServerSideProps() {
	const res = await fetch(
		"https://transport.integration.sl.se/v1/sites/9204/departures",
	);
	console.log("res", res);
	const dataSL = await res.json();

	return { props: { dataSL } };
}

export default function Reseinfo({ dataSL }) {
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
			<p>{dataSL}</p>
		</div>
	);
}
