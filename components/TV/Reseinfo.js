import styles from "@/styles/tv.module.css";

import TravelGroup from "./TravelGroup";
import { fetchSLData } from "./traveldataManager";

function makeTravelInfo() {
	const metroDataList = [];
	const busDataList = [];
	const roslagsDataList = [];

	const trips = fetchSLData();

	if (trips) {
		let metroList = [];
		let roslagsList = [];
		let busList = [];

		trips.forEach((trip) => {
			if (trip.line.transport_mode === "METRO") {
				metroList.push(trip);
			} else if (trip.line.transport_mode === "TRAM") {
				roslagsList.push(trip);
			} else if (trip.line.transport_mode === "BUS") {
				busList.push(trip);
			}
		});

		metroList = metroList.slice(0, 5);
		roslagsList = roslagsList.slice(0, 5);
		busList = busList.slice(0, 5);

		metroList.forEach((trip) => {
			metroDataList.push({
				line: trip.line.designation,
				destination: trip.destination,
				time: trip.display,
			});
		});

		roslagsList.forEach((trip) => {
			roslagsDataList.push({
				line: trip.line.designation,
				destination: trip.destination,
				time: trip.display,
			});
		});

		busList.forEach((trip) => {
			busDataList.push({
				line: trip.line.designation,
				destination: trip.destination,
				time: trip.display,
			});
		});

		console.log(metroDataList);
	}

	const travelInfo = [
		{
			name: "Tunnelbana",
			icon: "tunnelbana",
			data: metroDataList,
		},
		{
			name: "Roslagsbana",
			icon: "roslagsbana",
			data: roslagsDataList,
		},
		{
			name: "Buss",
			icon: "buss",
			data: busDataList,
		},
	];

	return travelInfo;
}

export default function Reseinfo() {
	const travelInfo = makeTravelInfo();

	return (
		<div className={styles.travelColumn}>
			<h1>Reseinfo</h1>
			{travelInfo.map((item) => (
				<TravelGroup key={item.name} {...item} />
			))}
		</div>
	);
}
