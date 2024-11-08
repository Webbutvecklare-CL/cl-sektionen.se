import { useState, useEffect } from "react";

function fetchSLData() {
	const [slData, setSLData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				"https://transport.integration.sl.se/v1/sites/9204/departures",
			);
			const data = await response.json();
			setSLData(data);
		};
		fetchData();
	}, []);

	const metroList = [];
	const roslagsList = [];
	const busList = [];

	return [metroList, roslagsList, busList];
}

export { fetchSLData };
