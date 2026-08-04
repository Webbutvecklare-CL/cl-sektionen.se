import { useRef } from "react";

import Sidhuvud_inv from "@/media/grafik/Namn_Vit.webp";
import styles from "@/styles/image-carousel.module.css";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function ImageCarousel() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  //om hemsidan fungerar som den ska bör detta tas bort
  //det säger vilka bilder som är med i kaursellen på startsidan
  //men att hårdkoda det är dumt och under ska copilot har gjort det dynamiskt
  //så om de funkar och ser bra ut så ta bort de här

  // const imageArray = [
  // 	"andrea_pa_scen.webp",
  // 	"gasqueteori.webp",
  // 	"mot2024.webp",
  // 	"mot1.webp",
  // 	"mot2.webp",
  // 	"cl15jub.webp",
  // 	"mot3.webp",
  // 	"mot4.webp",
  // ];

  const imageDir = join(process.cwd(), "public/media/bildspel");
  const imageArray = readdirSync(imageDir)
    .filter((file) => /\.(webp|jpg|jpeg|png|gif|avif)$/i.test(file))
    .sort();

  return (
    <div className={styles.indexBg}>
      <Carousel
        withIndicators
        withControls={false}
        height={300}
        loop
        align="center"
        classNames={{
          root: styles.carouselRoot,
          slide: styles.carouselSlide,
          indicators: styles.carouselIndicators,
        }}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        {imageArray.map((image) => (
          <Carousel.Slide key={image}>
            <div className={styles.carouselSlideInner}>
              <Image
                src={`/media/bildspel/${image}`}
                fill
                className={styles.carouselBackgroundImage}
                style={{ objectFit: "cover" }}
                alt={`${image} background image`}
                priority={true}
                blur
              />
              <Image
                src={`/media/bildspel/${image}`}
                fill
                className={styles.carouselMainImage}
                style={{ objectFit: "contain" }}
                alt={image}
                priority={true}
              />
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
      <div className={styles.imageContainer}>
        <Image
          src={Sidhuvud_inv}
          placeholder="blur"
          sizes="(max-width: 500px) 400px, 1000px"
          alt='"Sektionen för Civilingenjör & Lärare" skrivet med en fin font'
          className={styles.sektionsloggaVitt}
        />
      </div>
    </div>
  );
}
