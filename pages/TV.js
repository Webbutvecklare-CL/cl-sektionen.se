import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

import Slideshow from "@/components/TV/Slideshow";

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

	

	return (
		<div id={styles.tvContent}>
			<Slideshow
				images={listOfImages}
				default_image={ KTH_Winter}
				speed={1000 * 10}
			/>
		</div>
	);
}
