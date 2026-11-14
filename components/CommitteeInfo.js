import MarkdownRender from "@/components/MarkdownRender";
import styles from "@/styles/fortroendevalda.module.css";
import { Carousel } from "@mantine/carousel";
import Image from "next/image";
import { useState } from "react";

export default function CommitteeInfo({
	committee,
	description,
	groupData,
	images = [],
}) {
	// Fallback för bakåtkompatibilitet om ingen bild skickats med
	const defaultImages =
		images && images.length > 0
			? images
			: [
					{
						url: `/media/fortroendevalda/${committee}.webp`,
						alt: "Gruppbild",
						caption: "",
						personInfo: null,
					},
				];

	const [failedImages, setFailedImages] = useState({});

	const handleImageError = (url) => {
		setFailedImages((prev) => ({ ...prev, [url]: true }));
	};

	// Filtrera bort trasiga bilder
	const validImages = defaultImages.filter((img) => !failedImages[img.url]);

	// Bildtext-bricka för att tydligt märka ut vem eller vad som visas
	const ImageCaption = ({ image, index, total }) => {
		if (!image) return null;
		const { personInfo, caption } = image;

		const hasContent = Boolean(personInfo || caption);
		if (!hasContent && total <= 1) return null;

		return (
			<div className={styles.imageCaption}>
				<div className={styles.captionContent}>
					{personInfo ? (
						<>
							<span className={styles.captionName}>
								<strong>{personInfo.name}</strong>
								{personInfo.year && (
									<span className={styles.captionYear}>
										{" "}
										({personInfo.year})
									</span>
								)}
							</span>
							<span className={styles.captionDivider}> — </span>
							<span className={styles.captionRole}>{personInfo.role}</span>
						</>
					) : (
						<span className={styles.captionText}>{caption}</span>
					)}
				</div>
				{total > 1 && (
					<span className={styles.captionCounter}>
						{index + 1} / {total}
					</span>
				)}
			</div>
		);
	};

	return (
		<div>
			<MarkdownRender mdData={description} />
			{groupData.period != null && (
				<>
					<span className={styles.mandatePeriod}>
						Mandatperiod {groupData.period}
					</span>
					<br />
				</>
			)}
			<div className={styles.imageWrapper}>
				<section>
					<div className={styles.poster}>
						{groupData.people.map((person, idx) => {
							return (
								<p key={idx}>
									{person.name}{" "}
									<span className={styles.cl_year}>({person.year})</span>,{" "}
									<strong>{person.role}</strong>
									<br />
									<a href={`mailto:${person.mail}`}>{person.mail}</a>
								</p>
							);
						})}
					</div>
				</section>
				{validImages.length > 0 && (
					<div className={styles.imageContainer}>
						{validImages.length === 1 ? (
							<div className={styles.singleImageWrapper}>
								<Image
									src={validImages[0].url}
									width={500}
									height={500}
									alt={validImages[0].alt || "Gruppbild"}
									onError={() => handleImageError(validImages[0].url)}
									style={{
										width: "100%",
										height: "auto",
										borderRadius: "4px",
									}}
								/>
								<ImageCaption
									image={validImages[0]}
									index={0}
									total={1}
								/>
							</div>
						) : (
							<div className={styles.carouselContainer}>
								<Carousel
									withIndicators
									withControls
									loop
									align="center"
									classNames={{
										root: styles.carouselRoot,
										slide: styles.carouselSlide,
										indicators: styles.carouselIndicators,
										control: styles.carouselControl,
										controls: styles.carouselControls,
									}}
								>
									{validImages.map((img, idx) => (
										<Carousel.Slide key={img.url || idx}>
											<div className={styles.slideInner}>
												<div className={styles.imageFrame}>
													<Image
														src={img.url}
														width={500}
														height={500}
														alt={img.alt || "Bild på förtroendevald"}
														onError={() => handleImageError(img.url)}
														style={{
															width: "100%",
															height: "auto",
															maxHeight: "450px",
															objectFit: "contain",
															borderRadius: "4px",
														}}
													/>
												</div>
												<ImageCaption
													image={img}
													index={idx}
													total={validImages.length}
												/>
											</div>
										</Carousel.Slide>
									))}
								</Carousel>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
