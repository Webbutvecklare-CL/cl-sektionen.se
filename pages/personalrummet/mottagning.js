import { useState } from "react";

import {
	Timestamp,
	collection,
	deleteDoc,
	doc,
	getDocs,
	getFirestore,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { app } from "../../firebase/clientApp";
const firestore = getFirestore(app);

import { sendNotification } from "../../utils/server";

import BackButton from "../../components/BackButton";
import Modal from "../../components/Modal";
import FeedItem from "../../components/mottagning/FeedItem";

import { feed as feed_style } from "../../styles/mottagning/mottagning.module.css";
import styles from "../../styles/personalrummet/mottagning.module.css";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Mottagning() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const [editing, setEditing] = useState(false);
	const [modal, setModal] = useState(null);

	const [posts, setPosts] = useState([]);

	const { userData, user } = useAuth();

	const uploadPost = async () => {
		setIsPending(true);
		setMessage("");

		if (!title || !content) {
			setError("Du måste fylla i alla fält");
			setIsPending(false);
			return;
		}

		// Skickar data
		const postData = {
			title,
			content,
			publishDate: Timestamp.fromDate(new Date()),
			creator: userData.uid, // Länkar inlägget till användaren
			visibility: "public",
		};

		const mottagningsPostsRef = doc(collection(firestore, "mottagningsPosts"));
		try {
			await setDoc(mottagningsPostsRef, postData);
			console.log("Inlägget är publicerat!");
		} catch (error) {
			setError("Kunde inte ladda upp inlägget");
			setIsPending(false);
			alert("Kunde inte ladda upp inlägget");
			console.error("Fel vid uppladdningen av inlägget: ", err);
			return;
		}

		// Skickar notis om valt
		try {
			await sendNotification(user, {
				type: "mottagning",
				title,
				body: content,
			});
		} catch (error) {
			console.error("Fel vid skickandet av notisen: ", error);
		}

		postData.id = mottagningsPostsRef.id;
		setPosts([postData, ...posts]);

		setTitle("");
		setContent("");
		setIsPending(false);
		setMessage("Inlägget är publicerat!");
		setError("");
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const editPost = (post) => {
		setMessage("");
		setEditing(post);
		setTitle(post.title);
		setContent(post.content);
	};

	const updatePost = () => {
		setIsPending(true);

		if (!title || !content) {
			setError("Du måste fylla i alla fält");
			setIsPending(false);
			return;
		}
		const postData = {};
		if (title !== editing.title) postData.title = title;
		if (content !== editing.content) postData.content = content;

		if (Object.keys(postData).length === 0) {
			setError("Du måste ändra något");
			setIsPending(false);
			return;
		}

		const postRef = doc(firestore, "mottagningsPosts", editing.id);

		updateDoc(postRef, postData)
			.then(() => {
				console.log("Inlägget är uppdaterat!");
				posts.forEach((post) => {
					if (post.id === editing.id) {
						post.title = title;
						post.content = content;
					}
				});
				setEditing(false);
				setTitle("");
				setContent("");
				setIsPending(false);
			})
			.catch((err) => {
				setError("Kunde inte uppdatera inlägget");
				console.error("Fel vid uppdateringen av inlägget: ", err);
				setIsPending(false);
			});
	};

	const deletePost = async (id) => {
		const promise = new Promise((resolve, reject) => {
			const modal = {};
			modal.onClose = async () => {
				resolve(false);
			};
			const modalStyles = {
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",

				gap: "1rem",
			};
			modal.content = (
				<div style={{ height: "100%", marginBottom: "2rem" }}>
					<h3>Är du säker att du vill radera inlägget?</h3>
					<div style={modalStyles}>
						<button
							type="button"
							onClick={() => {
								resolve(true);
							}}
						>
							Radera
						</button>
						<button
							type="button"
							onClick={() => {
								resolve(false);
							}}
						>
							Ångra
						</button>
					</div>
				</div>
			);

			setModal(modal);
		});

		const answer = await promise;
		setModal(null);

		if (!answer) {
			setMessage("Inlägget raderades ej");
			return;
		}

		setIsPending(true);
		const postRef = doc(firestore, "mottagningsPosts", id);

		deleteDoc(postRef)
			.then(() => {
				console.log("Inlägget är raderat!");
				setMessage("Inlägget är raderat!");
				setPosts(posts.filter((post) => post.id !== id));
				setIsPending(false);
			})
			.catch((err) => {
				setError("Kunde inte radera inlägget");
				console.error("Fel vid raderingen av inlägget: ", err);
				setIsPending(false);
			});
	};

	useState(() => {
		// Hämtar inlägg
		const mottagningsPostsRef = collection(firestore, "mottagningsPosts");
		const q = query(mottagningsPostsRef, where("visibility", "==", "public"));
		getDocs(q).then((docs) => {
			const posts = [];
			docs.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
				posts.push(data);
			});
			posts.sort((a, b) => b.publishDate.seconds - a.publishDate.seconds);
			setPosts(posts);
		});
	}, []);

	if (!user) {
		return (
			<div id="contentbody">
				<BackButton page="/personalrummet">Personalrummet</BackButton>
				<h1>Personalrummet - Mottagning</h1>
				<p>Du måste vara inloggad för att använda denna sidan!</p>
			</div>
		);
	}

	return (
		<div id="contentbody">
			<BackButton page="personalrummet">Personalrummet</BackButton>
			<h1>Personalrummet - Mottagning</h1>
			<h2>Ladda upp nytt inlägg</h2>
			<div className={styles.inputPanel}>
				<p>Title till inlägget:</p>
				<input
					type="text"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<p>Inlägget:</p>
				<textarea
					cols="30"
					rows="4"
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
					}}
				/>
				{!editing && (
					<button type="button" onClick={uploadPost}>
						Ladda upp
					</button>
				)}
				{editing && (
					<div className={styles.menu}>
						<button type="button" onClick={updatePost}>
							Uppdatera
						</button>
						<button
							type="button"
							onClick={() => {
								setTitle("");
								setContent("");
								setError("");
								setMessage("");
								setIsPending(false);
								setEditing(null);
							}}
						>
							Ladda upp ett nytt inlägg
						</button>
					</div>
				)}
				{isPending && <p>Laddar...</p>}
				{error && <p>{error}</p>}
				{message && <p>{message}</p>}
			</div>
			<h2>Tidigare inlägg</h2>
			<div className={feed_style}>
				{posts.map((item, index) => (
					<div key={index} className={styles.feedItemWrapper}>
						<div className={styles.options}>
							<span
								onClick={() => {
									editPost(item);
								}}
								onKeyDown={() => {
									deletePost(item.id);
								}}
							>
								<FontAwesomeIcon icon={faPen} />
							</span>
							<span
								onClick={() => {
									deletePost(item.id);
								}}
								onKeyDown={() => {
									deletePost(item.id);
								}}
							>
								<FontAwesomeIcon icon={faTrashCan} />
							</span>
						</div>
						<FeedItem item={item} key={index} />
					</div>
				))}
			</div>

			{modal && <Modal onClose={modal.onClose}>{modal.content}</Modal>}
		</div>
	);
}
