import Image from "next/image";
import styles from "../styles/fortroendevalda.module.css";
import MarkdownRender from "./MarkdownRender";

export default function CommitteeInfo({ committee, description, groupData }) {
	const groupImgPath = `/media/fortroendevalda/${committee}.webp`;

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
					<Image
						src={groupImgPath}
						width={500}
						height={500}
						alt="Gruppbild"
						style={{
							width: "100%",
							height: "auto",
						}}
						// Detta stoppar bilden från att visas tom om den inte finns,
						//och undviker att konsollen spammas för mycket
						onLoad={(e) => (e.currentTarget.style.display = "block")}
						onError={(e) => (e.currentTarget.style.display = "none")}
					/>
				</div>
			</div>
		</div>
	);
}
