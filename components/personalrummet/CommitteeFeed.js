import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";

import { app } from "@/firebase/clientApp";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, listAll, ref } from "firebase/storage";
const storage = getStorage(app);
const firestore = getFirestore(app);

import { useAuth } from "@/context/AuthContext";
import { revalidate, sendNotification } from "@/utils/server";

import bg from "@/media/img/KTHcover.webp";

import feed from "@/styles/feed-preview.module.css";
import styles from "@/styles/personalrummet.module.css";

import {
	faEye,
	faEyeSlash,
	faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import {
	faArrowUpRightFromSquare,
	faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CommitteeFeed({ posts, permission = "" }) {
	// För att feedet ska uppdateras när man klickar på ex ögat
	const [postList, setPostList] = useState([]);

	const { user } = useAuth();

	// För att postList ska få data när komponenten laddas in
	useEffect(() => {
		setPostList(posts);
	}, [posts]);

	const handleChangePublic = async (e) => {
		// Ändra om inlägget ska vara publikt eller privat
		e.preventDefault();

		const postElem = e.currentTarget.parentElement.parentElement.parentElement;
		const postIdx = postElem.getAttribute("post-idx");
		const post = postList[postIdx];
		const postVisibility =
			post.visibility !== undefined ? post.visibility : "public"; // Det nuvarande läget true = publikt
		const becomesPublic = postVisibility !== "public";

		let wantToSendNotification = false;
		if (becomesPublic) {
			const promptText = post.notificationSent
				? "Inlägget görs nu publikt.\n\nNotis har redan skickats tidigare för detta inlägg. Vill du skicka en ny notis till sektionsmedlemmarna?"
				: "Inlägget görs nu publikt.\n\nVill du samtidigt skicka ut en notis till sektionsmedlemmarna?";
			wantToSendNotification = window.confirm(promptText);
		}

		// Uppdatera dokumentet
		const postRef = doc(firestore, "posts", post.id);
		// console.log("Innan:", postVisibility);
		try {
			console.log("updateDoc - Synlighetsstatus");
			await updateDoc(postRef, {
				visibility: becomesPublic ? "public" : "private",
			});
			post.visibility = becomesPublic ? "public" : "private";

			if (wantToSendNotification) {
				try {
					await sendNotification(user, {
						type: "post",
						postId: post.id,
						dryRun: false,
					});
					post.notificationSent = true;
					alert("Notis skickad!");
				} catch (notifErr) {
					console.error("Fel vid skickande av notis:", notifErr);
					alert(`Kunde inte skicka notis: ${notifErr.message}`);
				}
			}

			// Uppdaterar post med ny status
			setPostList((prevState) => {
				const updated = [...prevState];
				updated[postIdx] = { ...post };
				return updated;
			});
			// Försöker revalidate
			try {
				// Revalidate:ar hemsidan
				revalidate(user, { index: true, aktuellt: true, post: post.id });
			} catch (error) {
				console.error("Fel vid revalidate:", error);
			}
		} catch (error) {
			console.error("Det gick inte att uppdatera synlighetsstatusen", error);
		}
	};

	const handleManualNotification = async (e, post, postIdx) => {
		e.preventDefault();
		e.stopPropagation();

		const postVisibility =
			post.visibility !== undefined ? post.visibility : "public";

		if (postVisibility !== "public") {
			alert(
				"Inlägget måste vara publikt för att kunna skicka notis. Ändra synlighet först.",
			);
			return;
		}

		const confirmMsg = post.notificationSent
			? `En notis har redan skickats för "${post.title}".\n\nVill du skicka en ny notis till sektionsmedlemmarna?`
			: `Vill du skicka en notis för "${post.title}" till sektionsmedlemmarna?`;

		if (!window.confirm(confirmMsg)) {
			return;
		}

		try {
			await sendNotification(user, {
				type: "post",
				postId: post.id,
				dryRun: false,
			});
			post.notificationSent = true;
			setPostList((prevState) => {
				const updated = [...prevState];
				updated[postIdx] = { ...post };
				return updated;
			});
			alert("Notis skickad!");
		} catch (error) {
			console.error("Det gick inte att skicka notis:", error);
			alert(`Kunde inte skicka notis: ${error.message}`);
		}
	};

	const handleDeletePost = async (postId) => {
		// Gör en verifiering att användaren vill ta bort inlägget - Gör med dialog ruta
		alert("Är du säker på att du vill ta bort inlägget?");

		// Ta bort inlägget
		const postRef = doc(firestore, "posts", postId);
		try {
			await deleteDoc(postRef);
			console.log("Inlägget borttaget:", postId);
		} catch (error) {
			console.error("Det gick inte att ta bort inlägget", error);
		}

		try {
			const folderRef = ref(storage, `posts/${postId}`);
			const allImages = await listAll(folderRef);
			allImages.items.forEach(async (itemRef) => {
				await deleteObject(itemRef);
				console.log("Bild borttagen:", itemRef.name);
			});
		} catch (error) {
			console.error("Det gick inte att ta bort bilderna", error);
			return;
		}

		// Uppdatera klienten utan att göra en ny get request
		setPostList((prevState) => {
			const posts = [...prevState];
			const postIdx = posts.findIndex((post) => post.id === postId);
			posts.splice(postIdx, 1);
			return posts;
		});

		// Försöker revalidate
		try {
			// Revalidate:ar hemsidan
			revalidate(user, { index: true, aktuellt: true, post: postId });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div
			className={`${styles.committeeFeed} ${styles.preview} ${feed.preview}`}
		>
			{postList.map((post, idx) => {
				return (
					<div
						className={`${styles.postWrapper} ${feed.postWrapper}`}
						key={post.id}
						post-idx={idx}
					>
						<div className={styles.options}>
							<div>
								<Link href={`/aktuellt/${post.id}`} target={"_blank"}>
									<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
								</Link>
								<div
									onClick={handleChangePublic}
									onKeyDown={handleChangePublic}
									title={
										post.visibility !== "public"
											? "Gör publikt"
											: "Gör privat"
									}
								>
									<FontAwesomeIcon
										icon={post.visibility !== "public" ? faEyeSlash : faEye}
									/>
								</div>
								<div
									title={
										post.visibility !== "public"
											? "Inlägget måste vara publikt för att skicka notis"
											: post.notificationSent
												? "Skicka ny notis (notis redan skickad)"
												: "Skicka notis"
									}
									style={{
										opacity: post.visibility !== "public" ? 0.35 : 1,
										cursor:
											post.visibility !== "public"
												? "not-allowed"
												: "pointer",
									}}
									onClick={(e) => handleManualNotification(e, post, idx)}
									onKeyDown={(e) => handleManualNotification(e, post, idx)}
								>
									<FontAwesomeIcon icon={faBell} />
								</div>

								{permission === "admin" && (
									<div
										href={""}
										onClick={() => {
											handleDeletePost(post.id);
										}}
										onKeyDown={() => {
											handleDeletePost(post.id);
										}}
									>
										<FontAwesomeIcon icon={faTrashCan} />
									</div>
								)}
							</div>
						</div>
						<Link href={`/personalrummet/redigera/${post.id}`}>
							<div className={`${styles.postPreview} ${feed.postPreview}`}>
								<div className={feed.image}>
									{post.image && (
										<Image
											src={post.image}
											width={240}
											height={200}
											alt="Post image"
										/>
									)}
									{!post.image && <Image src={bg} alt="Bakgrundsbild KTH" />}
								</div>
								<div>
									<h2>{post.title}</h2>
								</div>
								<div className={feed.postContent}>
									<p className={feed.subtitle}>{post.subtitle}</p>
									{/* Parse för att formatera om html koden till html element
                                  Sanitize för att göra det lite mer stilrent i preview dvs inga styles*/}
									<div className={feed.body}>
										<p>
											{parse(
												sanitizeHtml(post.body, {
													allowedTags: [],
												}),
											)}
										</p>
									</div>
								</div>
							</div>
						</Link>
					</div>
				);
			})}
		</div>
	);
}
