import styles from "@/styles/tv.module.css";
import { useEffect, useState } from "react";

import TravelGroup from "./TravelGroup";

import { getData } from "@/pages/api/tvAPI";

async function makeTravelInfo() {
	const metroDataList = [];
	const busDataList = [];
	const roslagsDataList = [];

	const trips = await getData();

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
	}

	return [
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
}

export default function Reseinfo() {
	const [travelInfo, setTravelInfo] = useState([]);

	useEffect(() => {
		async function fetchTravelInfo() {
			const data = await makeTravelInfo();
			setTravelInfo(data);
		}

		fetchTravelInfo();

		const interval = setInterval(fetchTravelInfo, 30000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.travelColumn}>
			<h1>Reseinfo</h1>
			{travelInfo.map((item) => (
				<TravelGroup key={item.name} {...item} />
			))}
		</div>
	);
}
