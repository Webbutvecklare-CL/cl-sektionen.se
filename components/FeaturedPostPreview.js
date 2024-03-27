import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import bg from "../public/media/img/KTHcover.jpg";
import { convertDate } from "../utils/convertDate";

import styles from "../styles/feed-preview.module.css";

import { logEvent } from "firebase/analytics";

export default function FeaturedPostPreview({ post }) {
	const getDate = (date) => {
		return new Date(date.seconds * 1000).toLocaleDateString("sv");
	};
	const date = new Date(post.publishDate.seconds * 1000);
	return (
		<div className="featured-preview">
			<Link
				href={`/aktuellt/${post.id}`}
				key={post.id}
				onClick={async () => {
					const { getAnalytics } = await import("../firebase/clientApp");
					const analytics = await getAnalytics();
					if (analytics) {
						logEvent(analytics, "post_click", { page: "featured" });
					}
				}}
			>
				<div className="post-preview featured">
					<div className="image">
						{post.image ? (
							<Image
								src={post.image}
								width={400}
								height={300}
								alt="Post image"
							/>
						) : (
							<Image
								src={bg}
								width={400}
								height={300}
								alt="Bakgrundsbild KTH"
							/>
						)}
					</div>
					<div className="post-meta">
						<h2>{post.title}</h2>
						<div>
							<h3>{post.author}</h3>, {convertDate(date)}
						</div>
					</div>
					<div className="post-content">
						<p className="subtitle">{post.subtitle}</p>
						{post.type === "event" && (
							<span className={styles.eventDate}>
								Datum: {getDate(post.startDateTime)}
								{getDate(post.startDateTime) !== getDate(post.endDateTime) && (
									<span> till {getDate(post.endDateTime)}</span>
								)}
								{new Date(post.endDateTime.seconds * 1000) < Date.now() && (
									<span className={styles.passedDate}> (passerat)</span>
								)}
							</span>
						)}
						<div className="body">
							<br />
							<p>
								{parse(
									sanitizeHtml(post.body, {
										allowedTags: ["strong", "br"],
									}),
								)}
							</p>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
