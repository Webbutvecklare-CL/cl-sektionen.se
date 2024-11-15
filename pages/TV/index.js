import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getSunTime } from "@/pages/api/tvDayTimeAPI";

import { app } from "@/firebase/clientApp";
import {
	Timestamp,
	collection,
	getFirestore,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
const firestore = getFirestore(app);

import Reseinfo from "@/components/TV/Reseinfo";
import Slideshow from "@/components/TV/Slideshow";

import KTH_Natt from "@/media/TV/kth-natt.webp";
import KTH_Summer from "@/media/TV/kth-sommar.webp";
import KTH_Winter from "@/media/TV/kth-vinter.webp";

import styles from "@/styles/tv.module.css";

export default function TV() {
	const router = useRouter();

	const [listOfImages, setListOfImages] = useState([]);

	// Hämtar alla bild länkar.
	useEffect(() => {
		// Kolla så att datumen är inom 7 dagar
		const unsubscribe = onSnapshot(collection(firestore, "tv"), (snapshot) => {
			const updatedList = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				updatedList.push(data);
			});
			setListOfImages(updatedList);
			console.log(updatedList);
		});

		// Clean up the listener to prevent memory leaks
		return () => unsubscribe();
	}, []);

	// auto update if it is daylight
	const [isDay, setDay] = useState(true);

	useEffect(() => {
		const updateDayStatus = async () => {
			setDay(await getSunTime());
		};

		const intervalId = setInterval(updateDayStatus, 60_000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div id={styles.tvContent}>
			<Slideshow
				images={listOfImages}
				default_image={isDay ? KTH_Winter : KTH_Natt}
			/>
			<Reseinfo />
		</div>
	);
}
