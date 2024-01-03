import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { collection, getFirestore, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { app } from "../firebase/clientApp";
const firestore = getFirestore(app);

import ReseInfo from "../components/TV/ReseInfo";
import Slideshow from "../components/TV/Slideshow";

import KTH_Summer from "../public/media/TV/kth-sommar.png";
import KTH_Night from "../public/media/TV/kth-night.jpg";

import { getIsNight } from "../utils/tv";

import styles from "../styles/tv.module.css";

export default function TV() {
  const router = useRouter();

  const [listOfImages, setListOfImages] = useState([]);
  const [isNight, setIsNight] = useState(getIsNight());

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

  useEffect(() => {
    // Uppdaterar natt/dag varje timme
    const id = setInterval(
      async () => {
        //Kollar om det är kväll eller dag
        setIsNight(getIsNight());
      },
      1000 * 60 * 60
    );
    return () => clearInterval(id); // Tar bort interval när sidan lämnas
  }, []);

  return (
    <div id={styles.tvContent}>
      <Slideshow
        images={listOfImages}
        default_image={isNight ? KTH_Night : KTH_Summer}
        speed={1000 * 10}
      />
      <ReseInfo api_key={router.query.key} />
    </div>
  );
}
