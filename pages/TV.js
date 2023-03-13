import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import ReseInfo from "../components/TV/ReseInfo";
import Slideshow from "../components/TV/Slideshow";

import KTH_Winter from "../public/media/TV/kth-Winter.png";
import KTH_Summer from "../public/media/TV/kth-sommar.png";
import KTH_Night from "../public/media/TV/kth-night.jpg";

import { getAllImages, getIsNight } from "../utils/tv";

export default function TV() {
  const router = useRouter();

  const [listOfImages, setListOfImages] = useState([]);
  const [isNight, setIsNight] = useState(getIsNight());

  // Hämtar alla bild länkar.
  useEffect(() => {
    // Hämtar bilderna när sidan laddas in
    getAllImages().then((list) => {
      setListOfImages(list);
    });

    // Hämtar länkar till alla bilder och uppdaterar natt/dag varje minut
    const id = setInterval(async () => {
      getAllImages().then((list) => {
        setListOfImages(list);
      });

      //Kollar om det är kväll eller dag
      setIsNight(getIsNight());
    }, 1000 * 60);
    return () => clearInterval(id); // Tar bort interval när sidan lämnas
  }, []);

  return (
    <div id="tv-content">
      <Slideshow
        images={listOfImages}
        default_image={isNight ? KTH_Night : KTH_Winter}
        speed={1000 * 10}
      />
      <ReseInfo api_key={router.query.key} />
    </div>
  );
}
