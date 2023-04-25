import { useEffect, useState } from "react";
import Image from "next/image";

export default function ValSlider({ folderName, numberOfImages }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = Array.from(
    { length: numberOfImages },
    (_, index) => `/media/valen/${folderName}/${index + 1}.jpg`
  );

  useEffect(()=>{
    console.log(images)
  })
  
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div>
      <h2>Bild {currentIndex + 1}</h2>
      <div>
        <button onClick={handlePrevClick}>Förra</button>
        <button onClick={handleNextClick}>Nästa</button>
      </div>
      <div>
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          width={960}
          height={540}
        />
      </div>
    </div>
  );
}
