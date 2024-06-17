import MarkdownRender from "@/components/MarkdownRender";
import styles from "@/styles/fortroendevalda.module.css";
import Image from "next/image";
import { useState } from "react";

export default function CommitteeInfo({ committee, description, groupData }) {
	const groupImgPath = `/media/fortroendevalda/${committee}.webp`;

	const HideableImage = (props) => {
		const [hideImage, setHideImage] = useState(false);

		return (
			!hideImage && (
				<Image
					{...props}
					onError={() => {
						setHideImage(true);
					}}
				/>
			)
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
				<div className={styles.imageContainer}>
					<HideableImage
						src={groupImgPath}
						width={500}
						height={500}
						alt="Gruppbild"
						style={{
							width: "100%",
							height: "auto",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
