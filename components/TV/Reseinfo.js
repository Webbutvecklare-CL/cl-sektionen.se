import styles from "@/styles/tv.module.css";
import { useEffect, useState } from "react";

import TravelGroup from "./TravelGroup";

import { getSunTime } from "@/pages/api/tvDayTimeAPI";
import { getSLdata } from "@/pages/api/tvSLdataAPI";

async function makeTravelInfo() {
	const metroDataList = [];
	const busDataList = [];
	const roslagsDataList = [];

	const trips = await getSLdata();

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

		// Number of trips to show per mode
		metroList = metroList.slice(0, 6);
		roslagsList = roslagsList.slice(0, 6);
		busList = busList.slice(0, 8);

		// Convert from lists to displayable objects
		function listToDataList(list, dataList) {
			list.forEach((trip) => {
				dataList.push({
					line: trip.line.designation,
					destination: trip.destination,
					time: trip.display,
				});
			});
		}

		listToDataList(metroList, metroDataList);
		listToDataList(roslagsList, roslagsDataList);
		listToDataList(busList, busDataList);
	}

	return [
		{
			name: "Tunnelbanan",
			icon: "tunnelbana",
			data: metroDataList,
		},
		{
			name: "Roslagsbanan",
			icon: "roslagsbana",
			data: roslagsDataList,
		},
		{
			name: "Bussar",
			icon: "buss",
			data: busDataList,
		},
	];
}

export default function Reseinfo() {
	// auto update travel info
	const [travelInfo, setTravelInfo] = useState([]);

	useEffect(() => {
		async function fetchAndSetTravelInfo() {
			const data = await makeTravelInfo();
			setTravelInfo(data);
		}

		fetchAndSetTravelInfo();
		const intervalId = setInterval(fetchAndSetTravelInfo, 30_000);
		return () => clearInterval(intervalId);
	}, []);

	// auto update if it is daylight
	const [isDay, setDay] = useState(true);

	useEffect(() => {
		const updateDayStatus = async () => {
			setDay(await getSunTime());
		};

		const intervalId = setInterval(updateDayStatus, 1_000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div
			className={`${styles.travelColumn} ${isDay ? styles.dayTravelColumn : ""}`}
		>
			<h1>Reseinfo</h1>
			{travelInfo.map((item) => (
				<TravelGroup key={item.name} isDay={isDay} {...item} />
			))}
		</div>
	);
}
