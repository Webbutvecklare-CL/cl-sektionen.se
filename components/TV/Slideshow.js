import { useEffect, useState } from "react";
import Image from "next/image";
import { FastAverageColor } from "fast-average-color";

export default function Slideshow({ images, default_image, speed = 8000 }) {
  const fac = new FastAverageColor();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Uppdaterar bakgrundsfärgen när currentIndex ändras
  useEffect(() => {
    const container = document.querySelector(".slideshow"); // Elementet där bakgrundsfärgen sätts

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
          // Kanske kan användas på reseinfo
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [default_image, currentIndex]);

  //Byter till nästa bild
  useEffect(() => {
    // Startar en timer när komponenten laddas in
    const id = setInterval(() => {
      if (images) {
        if (currentIndex >= images.length - 1) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }
    }, speed);
    return () => clearInterval(id); // Tar bort interval när komponenten laddas ut.
  }, [currentIndex, images, speed]);

  // Visa en default bild om det inte finns några bilder eller om det blivit ett problem
  if (!images || typeof images == "string" || images.length < 1) {
    return (
      <div className="slideshow">
        {default_image && <Image src={default_image} alt="Standard bakgrund!" />}
      </div>
    );
  }

  return (
    <div className="slideshow">
      {images.length > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img crossOrigin="anonymous" src={`${images[currentIndex]}`} alt="Bild" />
      )}
    </div>
  );
}
