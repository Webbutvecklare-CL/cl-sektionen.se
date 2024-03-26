import { useEffect, useState } from "react";
import Image from "next/image";
import { FastAverageColor } from "fast-average-color";

import styles from "../../styles/tv.module.css";

export default function Slideshow({ images, default_image, speed = 8000 }) {
  const fac = new FastAverageColor();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [imageUrls, setImageUrls] = useState([]); // Alla bilder som ska visas

  // Uppdaterar bakgrundsfärgen när currentIndex ändras
  // biome-ignore lint/correctness/useExhaustiveDependencies: migrate fix from eslint
  useEffect(() => {
    const container = document.querySelector(`.${styles.slideshow}`); // Elementet där bakgrundsfärgen sätts

    // Kollar om det finns någon bild annars tar den bort bakgrunden
    if ((!images && !default_image) || !container.querySelector("img")) {
      container.style.backgroundColor = "";
      return;
    }

    // Kollar efter bilden i slideshowen och hämtar dess dominanta färg
    try {
      fac
        .getColorAsync(container.querySelector("img"), { algorithm: "dominant" })
        .then((color) => {
          container.style.backgroundColor = color.rgba;
          // Kanske kan användas på reseinfo för att minska kontrasten eller öka idk
          // container.style.color = color.isDark ? "#fff" : "#000";
        })
        .catch((e) => {
          console.log(e.message);
          container.style.backgroundColor = "";
        });
    } catch (error) {
      console.error(error);
      container.style.backgroundColor = "";
    }
  }, [default_image]);

  //Byter till nästa bild
  useEffect(() => {
    // Startar en timer när komponenten laddas in
    const id = setInterval(() => {
      if (imageUrls.length > 0) {
        if (currentIndex >= imageUrls.length - 1) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }
    }, speed);
    return () => clearInterval(id); // Tar bort interval när komponenten laddas ut.
  }, [currentIndex, imageUrls, speed]);

  // Kollar om bilderna ska visas eller ej
  useEffect(() => {
    const timeCheck = () => {
      const startOfToday = new Date();
      startOfToday.setUTCHours(0, 0, 0);

      let newImageUrls = [];
      for (let image of images) {
        let startDate = image.startDate.toDate();
        let endDate = image.endDate.toDate();

        if (startDate <= startOfToday && endDate >= startOfToday) {
          newImageUrls.push(image.url);
        } else {
          if (startDate > startOfToday) {
            console.log("Bilden ska inte visas än:", startDate, startOfToday);
          } else if (endDate < startOfToday) {
            console.log("Bilden ska inte visas längre:", endDate, startOfToday);
          } else {
            console.log("Bilden ska inte visas:", image);
          }
        }
      }
      setImageUrls(newImageUrls);
    };

    // Kollar varje timme om bilderna ska visas eller ej
    timeCheck();
    const timeCheckInterval = setInterval(timeCheck, 1000 * 60 * 60);

    // Tar bort interval när komponenten laddas ut.
    return () => clearInterval(timeCheckInterval);
  }, [images]);

  // Visa en default bild om det inte finns några bilder eller om det blivit ett problem
  if (!images || typeof images == "string" || imageUrls.length < 1) {
    return (
      <div className={styles.slideshow}>
        {default_image && <Image src={default_image} alt="Standard bakgrund!" />}
      </div>
    );
  }

  return (
    <div className={styles.slideshow}>
      <img crossOrigin="anonymous" src={`${imageUrls[currentIndex]}`} alt="Bild" />
    </div>
  );
}
