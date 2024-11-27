import { Carousel } from "@mantine/carousel";
import Image from "next/image";
import styles from "@/styles/image-carousel.module.css";
import Sidhuvud_inv from "@/media/grafik/Namn_Vit.webp";

export default function ImageCarousel() {
	const imageArray = [
		"andrea_pa_scen.webp",
		"gasqueteori.webp",
		"mot1.webp",
		"mot2.webp",
		"mot2024.webp",
		"mot3.webp",
		"mot4.webp",
	];

	return (
		<div className={styles.indexBg}>
			<Carousel
				withIndicators
				height={300}
				loop
				align="center"
				classNames={{
					root: styles.carouselRoot,
					slide: styles.carouselSlide,
					indicators: styles.carouselIndicators,
				}}
			>
				{imageArray.map((image) => (
					<Carousel.Slide key={image}>
						<div className={styles.carouselSlideInner}>
							<Image
								src={`/media/bildspel_new/${image}`}
								fill
								style={{ objectFit: "cover" }}
								alt="CL-sektionen"
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
