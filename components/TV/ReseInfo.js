import React, { useEffect, useState } from "react";

import Departures from "@/components/TV/Departures";
import { getGr8anOpen } from "@/utils/tv";

import styles from "@/styles/tv.module.css";

import { PT_Sans } from "next/font/google";
const pt_sans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export default function ReseInfo({ api_key }) {
	const [buses, setBuses] = useState([]);
	const [metros, setMetros] = useState([]);
	const [trams, setTrams] = useState([]);

	const [lastUpdate, setLastUpdate] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	useEffect(() => {
		if (api_key === undefined) {
			setError("Ingen api-nyckel hittades!");
			setLoading(true);
			return;
		}
		// Sätter ett interval när komponenten laddas in
		const id = setInterval(() => {
			// Uppdatera bara om Gråttan är öppen
			if (getGr8anOpen) {
				fetch(`/api/reseinfo?key=${api_key}`)
					.then((res) => {
						// Om responsen från api:et är ok försöker vi ta ut all data
						if (res.ok) {
							res
								.json()
								.then((data) => {
									// Om det är något fel med SL:s api skickas ett error
									if (data.error) {
										setError(data.error);
										setLoading(true);
										return;
									}
									// Tar ut de 6 närmast kommande avgångarna
									const maxLength = 6;
									setBuses(data.Buses.sort().slice(0, maxLength));
									setMetros(data.Metros.sort().slice(0, maxLength));
									setTrams(data.Trams.sort().slice(0, maxLength));

									// Kolla vilken tid informationen gäller för
									setLastUpdate(data.LatestUpdate.split("T")[1]);
									setLoading(false);
									setError("");
								})
								.catch((err) => {
									console.error(err);
									setError("Kunde inte ladda reseinfo! :(");
									setLoading(true);
								});
						} else {
							console.log(res);
							setError("Kunde inte ladda reseinfo! :(");
							setLoading(true);
						}
					})
					.catch((err) => {
						console.log("Dunder error");
						console.error(err);
						setError("Kunde inte ladda reseinfo! :(");
						setLoading(true);
					});
			}
		}, 1000 * 12); // Uppdaterar var tolfte sekund
		return () => clearInterval(id); // ta bort interval när komponenten laddas ut
	}, [api_key]);

	return (
		<div className={`${pt_sans.className} ${styles.reseinfo}`}>
			<div id={"buses"}>
				<h2>Bussar</h2>
				<Departures data={buses} />
			</div>
			<div id={"metros"}>
				<h2>Tunnelbana</h2>
				<Departures data={metros} />
			</div>
			<div id={"trams"}>
				<h2>Roslagsbanan</h2>
				<Departures data={trams} />
			</div>
			<div className={styles.messages}>
				<p>Uppdaterat: {lastUpdate}</p>
				<div className={styles.scrollContainer}>
					{(error || loading) && <p>{error} Försöker hämta reseinfo igen...</p>}
				</div>
			</div>
		</div>
	);
}
