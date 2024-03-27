import Image from "next/image";

import parse from "html-react-parser";

import styles from "@/styles/aktuellt.module.css";
import BackButton from "./BackButton";

export default function PostComponent({ postData, backPath }) {
	const getDate = (date) => {
		return new Date(date.seconds * 1000).toLocaleDateString("sv");
	};

	return (
		<article className={styles.post}>
			{backPath && (
				<div className="article-head">
					<BackButton page={backPath}>Aktuellt</BackButton>
				</div>
			)}
			<div className={styles.head}>
				<div className={styles.imageContainer}>
					{postData.image && (
						<Image
							src={postData.image}
							width={400}
							height={400}
							alt="Post bild"
						/>
					)}
				</div>
				<div className={styles.info}>
					<h1 className={styles.title}>{postData.title}</h1>
					<h2>{postData.subtitle}</h2>
					{postData.type === "event" && (
						<p>
							Datum: {getDate(postData.startDateTime)}
							{getDate(postData.startDateTime) !==
								getDate(postData.endDateTime) && (
								<span> till {getDate(postData.endDateTime)}</span>
							)}
							{new Date(postData.endDateTime.seconds * 1000) < Date.now() && (
								<span className={styles.passedDate}> (passerat)</span>
							)}
						</p>
					)}

					<p className={styles.meta}>
						Publicerad {getDate(postData.publishDate)} av {postData.author}
					</p>
				</div>
			</div>

			<hr />
			<div>{parse(postData.body)}</div>
		</article>
	);
}
