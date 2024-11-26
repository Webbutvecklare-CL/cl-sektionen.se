import { convertDate } from "@/utils/convertDate";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";

import { logEvent } from "firebase/analytics";

import bg from "@/media/img/Post_Placeholder.webp";

import styles from "@/styles/feed-preview.module.css";

// om goBack är true används historiken för att navigera tillbaka från inläggen
export default function FeedPreview({ posts, goBack = false, isGridLayout }) {
	const getDate = (date) => {
		return new Date(date.seconds * 1000).toLocaleDateString("sv");
	};

	return (
		<>
			{posts.map((post) => {
				const date = new Date(post.publishDate.seconds * 1000);
				return (
					<div
						className={isGridLayout ? styles.gridItem : styles.postWrapper}
						key={post.id}
					>
						<Link
							href={`/aktuellt/${post.id}${goBack ? "?r=true" : ""}`}
							className={styles.postLink}
							onClick={async () => {
								const { getAnalytics } = await import("../firebase/clientApp");
								const analytics = await getAnalytics();
								if (analytics) {
									logEvent(analytics, "post_click", {
										page: window.location.pathname,
									});
								}
							}}
						>
							<div className={styles.image}>
								{post.image ? (
									<Image
										src={post.image}
										width={isGridLayout ? 400 : 120}
										height={isGridLayout ? 300 : 90}
										alt="Post image"
									/>
								) : (
									<Image src={bg} placeholder="blur" alt="Bakgrundsbild KTH" />
								)}
							</div>
							<div className={styles.content}>
								<h2 className={styles.title}>{post.title}</h2>
								<div className={styles.postMeta}>
									{post.author && <span>{post.author} • </span>}
									<span>Publicerat: {convertDate(date)}</span>
								</div>
								{post.type === "event" && (
									<span className={styles.eventDate}>
										Datum: {getDate(post.startDateTime)}
										{getDate(post.startDateTime) !==
											getDate(post.endDateTime) && (
											<span> till {getDate(post.endDateTime)}</span>
										)}
										{new Date(post.endDateTime.seconds * 1000) < Date.now() && (
											<span className={styles.passedDate}> (passerat)</span>
										)}
									</span>
								)}
								<div className={styles.body}>
									{post.subtitle && (
										<p className={styles.subtitle}>{post.subtitle}</p>
									)}
									<div className={styles.description}>
										{parse(
											sanitizeHtml(post.body || post.content || "", {
												allowedTags: ["strong", "em", "b", "i", "p", "br"],
											}),
										)}
									</div>
								</div>
							</div>
						</Link>
					</div>
				);
			})}
		</>
	);
}
