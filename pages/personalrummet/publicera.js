import Link from "next/link";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";

import BackButton from "@/components/BackButton";
import Modal from "@/components/Modal";
import PostForm from "../../components/personalrummet/PostForm";

import { createId, getTypedLink } from "@/utils/postUtils";
import {
	Timestamp,
	deleteDoc,
	doc,
	getFirestore,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { app } from "../../firebase/clientApp";

const storage = getStorage(app);
const firestore = getFirestore(app);

import { createEvent } from "../../utils/calendarUtils";
import { validateLink } from "../../utils/postUtils";
import { revalidate, sendNotification } from "../../utils/server";

import { all_committee_ids } from "../../constants/committees-data";

import ValidationModal from "@/components/personalrummet/ValidationModal";

import {
	actionMenu,
	formWrapper,
	responseContainer,
} from "@/styles/personalrummet/post-form.module.css";

export default function Publicera() {
	const { user, userData, userAccessToken, setUserAccessToken } = useAuth();

	const today = new Date().toLocaleString().substring(0, 16); // Hämtar dagens datum och sätter som default
	const [prefillData, setPrefillData] = useState({
		title: "",
		subtitle: "",
		image: "",
		body: "",
		tags: [],
		startDateTime: new Date().toLocaleString().substring(0, 16),
		endDateTime: new Date().toLocaleString().substring(0, 16),
		// publishDate: today,
		author: "",
		visibility: "public",
	});

	useEffect(() => {
		if (userData) {
			setPrefillData({
				title: "",
				subtitle: "",
				image: "",
				body: "",
				tags: [],
				publishDate: today,
				author: all_committee_ids[userData.committee].name,
				authorCommittee: userData.committee,
			});
		}
	}, [userData, today]);

	const [isPending, setIsPending] = useState(false);
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");

	const [successLink, setSuccessLink] = useState(""); // False/null om inlägget inte har publicerats
	const [calendarStatus, setCalendarStatus] = useState("");

	const [modal, setModal] = useState(false);

	// Skickar allt till databasen
	const handleSubmit = async (data) => {
		setIsPending(true);
		setStatus("Validerar länk...");

		if (!data.link) {
			data.link = createId(data.title, data.type);
		}

		// Validera id/länk
		let uniqueLink;
		try {
			// Funktionen resolverar med false om länken inte är unik annars med en korrekt länk
			let link = await validateLink(data.link, data.type);
			if (link === false) {
				// Om länken inte är unik låt användaren skriva in en ny tills den är unik
				link = await new Promise((resolve, reject) => {
					setModal(
						<ValidationModal data={data} onClose={resolve} onError={reject} />,
					);
				});
			}

			// Förtydliga att detta är den validerade unika länken
			uniqueLink = link;
		} catch (error) {
			console.error("Fel vid valideringen av länken:", error);
			setError("Det gick inte att validerar länken/id:et");
			setIsPending(false);
			return;
		}
		setModal(false);

		if (!uniqueLink) {
			// Användaren stängde fönstret för att ange unik länk
			console.log("Användaren avbröt uppladdningen", uniqueLink);
			setIsPending(false);
			setError("Användaren avbröt uppladdningen.");
			return;
		}

		// Skickar data
		const postData = {
			title: data.title,
			subtitle: data.subtitle,
			image: "",
			body: data.body,
			author: data.author,
			publishDate: Timestamp.fromDate(new Date()),
			tags: data.tags,
			committee:
				userData.permission === "admin"
					? data.authorCommittee
					: userData.committee, // Länkar inlägget med nämnden
			creator: userData.uid, // Länkar inlägget till användaren
			type: data.type,
			visibility: data.visibility,
		};

		if (data.type === "event") {
			postData.startDateTime = Timestamp.fromDate(new Date(data.startDateTime));
			postData.endDateTime = Timestamp.fromDate(new Date(data.endDateTime));
		}

		const postRef = doc(firestore, "posts", uniqueLink);

		setStatus("Laddar upp inlägget...");
		try {
			await setDoc(postRef, postData);
			console.log("Inlägget är uppladdat");
		} catch (err) {
			setError("Kunde inte ladda upp inlägget");
			setIsPending(false);
			setModal(
				<Modal onClose={() => {}}>
					<h2>Det gick inte att ladda upp inlägget</h2>
					<p>Testa igen eller kontakta webbansvariga.</p>
					<p>Felmeddelande: {err.message}</p>
					<div className={actionMenu}>
						<button
							type="submit"
							onClick={() => {
								setModal(false);
								setIsPending(false);
							}}
						>
							Stäng
						</button>
					</div>
				</Modal>,
			);
			console.error("Fel vid uppladdningen av inlägget: ", err);
			return;
		}

		// Kolla om det finns en bild
		if (data.image.name) {
			// Ladda upp bilden
			setStatus("Laddar upp bilden...");
			try {
				const imageRef = ref(storage, `posts/${uniqueLink}/${data.image.name}`);
				await uploadBytes(imageRef, data.image);
				const downloadUrl = await getDownloadURL(imageRef);

				// Uppdatera en länk till bilden i posten
				await updateDoc(postRef, {
					image: downloadUrl,
				});

				// Hoppar ner och rensar formuläret osv
			} catch (err) {
				setError("Inlägget uppladdat men inte bilden");

				console.log(err);
				const response = new Promise((resolve, reject) => {
					setModal(
						<Modal onClose={() => {}}>
							<h2>Det gick inte att ladda upp bilden</h2>
							<p>
								Inlägget är uppladdat men inte bilden.
								<br />
								Vill du ladda upp inlägget{" "}
								{data.sendNotification ? "och skicka notiser" : ""} ändå?
								<br />
								Du kan ladda upp bilden senare.
							</p>
							<div className={actionMenu}>
								<button
									type="submit"
									onClick={() => {
										setModal(false);
										resolve(true);
									}}
								>
									Ladda upp bild senare
								</button>
								<button
									type="submit"
									onClick={async () => {
										await handleDeletion(data);
										setModal(false);
										resolve(false);
										setIsPending(false);
										setError("Inlägget är raderat");
									}}
								>
									Ta bort inlägget
								</button>
							</div>
						</Modal>,
					);
				});
				const continueUpload = await response;
				if (!continueUpload) {
					setIsPending(false);
					setError("Användaren avbröt uppladdningen och inlägget är raderat.");
					return;
				}
			}
		}

		// Försöker revalidate
		setStatus("Uppdatera webbplatsen...");
		try {
			// Revalidate:ar hemsidan
			await revalidate(user, { index: true, aktuellt: true, post: uniqueLink });
		} catch (error) {
			console.error(error);
			setModal(
				<Modal
					onClose={() => {
						setModal(false);
						setIsPending(false);
					}}
				>
					<h2>Det gick inte att uppdatera webbplatsen</h2>
					<p>
						Inlägget är uppladdat med det är inte säkert att det syns på
						startsidan eller under aktuellt. Kontakta webbansvariga.
					</p>
					<p>Felmeddelande: {error.message}</p>
					<button
						type="submit"
						onClick={() => {
							setModal(false);
							setIsPending(false);
						}}
					>
						Stäng
					</button>
				</Modal>,
			);
			return;
		}

		// Lägger till i kalender om valt
		if (data.type === "event" && data.publishInCalendar) {
			try {
				await addEvent({
					title: data.title,
					description: data.body,
					start: new Date(data.startDateTime),
					end: new Date(data.endDateTime),
				});
			} catch (error) {
				console.error(error);

				// Väntar på att användaren stängt dialogrutan
				await new Promise((resolve) => {
					setModal(
						<Modal
							onClose={() => {
								setModal(false);
								resolve(true);
							}}
						>
							<h2>Det gick inte att lägga till eventet i kalendern</h2>
							<p>
								Eventet är däremot uppladdat på webbplatsen.
								<br />
								Du kan gå in i sektionskalendern manuellt och lägga till
								eventet.
							</p>
							<p>Felmeddelande: {error.message}</p>
							<button
								type="submit"
								onClick={() => {
									setModal(false);
									resolve(true);
								}}
							>
								Stäng
							</button>
						</Modal>,
					);
				});
			}
		}

		// Skickar notis om valt
		if (data.sendNotification) {
			setStatus("Skickar notiser...");
			try {
				await sendNotification(user, { type: "post", postId: uniqueLink });
			} catch (error) {
				setError("Det gick inte att skicka notiserna");
				console.error(error);
				setModal(
					<Modal
						onClose={() => {
							setModal(false);
							setIsPending(false);
						}}
					>
						<h2>Det gick inte att skicka notiserna</h2>
						<p>Kontakta webbansvariga om du vill skicka en ny notis.</p>
						<p>Felmeddelande: {error.message}</p>

						<button
							type="submit"
							onClick={() => {
								setModal(false);
								setIsPending(false);
							}}
						>
							Stäng
						</button>
					</Modal>,
				);
				return;
			}
		}

		setIsPending(false);
		setError("");
		setSuccessLink(uniqueLink);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleDeletion = async () => {
		try {
			const postRef = doc(firestore, "posts", uniqueLink);
			await deleteDoc(postRef);
			console.log("Inlägget är borttaget");
		} catch (err) {
			setError("Kunde inte ta bort inlägget");
			setIsPending(false);
			console.error("Fel vid borttagningen av inlägget: ", err);
			return;
		}
	};

	// Lägger in event i kalendern
	const addEvent = async (eventData) => {
		const calendarID = process.env.NEXT_PUBLIC_CL_CALENDAR;
		// Om access token inte finns måste användaren logga in på nytt
		let token = userAccessToken;
		if (!token) {
			if (user && userData) {
				try {
					token = await reauthenticate();
					setUserAccessToken(token);
				} catch (err) {
					console.error(err);
					throw new Error("Kunde inte logga in på nytt!");
				}
			} else {
				setError("Du måste vara inloggad, prova ladda om sidan!");
				throw new Error("Du måste vara inloggad!");
			}
		}

		try {
			const response = await createEvent(token, calendarID, eventData);

			console.log(response);
			setCalendarStatus("Uppladdat i kalendern.");
		} catch (errRes) {
			console.error(errRes);
			if (errRes.status === 401) {
				console.log(calendarID);
			}

			const { error } = await errRes.json();
			console.error("Fel vid uppladdning av event:", error);

			setCalendarStatus("Det gick inte att ladda upp i kalendern.");
			throw new Error(error.message);
		}
		console.log("Eventet är uppladdat i kalendern");
	};

	return (
		<div id="contentbody">
			<div className="small-header">
				{modal && modal}
				<BackButton page="personalrummet">Personalrummet</BackButton>
				<h1>Personalrummet - Publicera</h1>
				{successLink && (
					<div>
						<p>
							Inlägget är publicerat, du hittar det på följande länk:{" "}
							<Link
								href={`/aktuellt/${successLink}`}
							>{`www.cl-sektionen.se/aktuellt/${successLink}`}</Link>
							<br />
						</p>
					</div>
				)}
			</div>
			{userData && !successLink && (
				<div className={formWrapper}>
					<PostForm
						onSubmit={handleSubmit}
						prefill={prefillData}
						buttonText={"Skapa"}
					/>
					<div className={responseContainer}>
						{isPending && <p>{status || "Skapar inlägget..."}</p>}
						{error && <p>Error: {error}</p>}
					</div>
				</div>
			)}
		</div>
	);
}

import { googleLogin } from "@/utils/authUtils";

async function reauthenticate() {
	return new Promise((resolve, reject) => {
		googleLogin()
			.then(async (result) => {
				console.log("Omautentiserad!");
				// Användaren har loggat in med sin förtroendevalds-mail
				// Förutsätter att användaren loggat in tidigare dvs att userData finns
				const { GoogleAuthProvider } = await import("firebase/auth");
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				resolve(token);
			})
			.catch((err) => {
				console.error(err);
				let errorText;
				if (err.code === "auth/popup-closed-by-user") {
					errorText = "Inloggningsfönstret stängdes!";
				} else if (err.code === "auth/popup-blocked") {
					errorText =
						"Det gick inte att öppna ett inloggningsfönster. Kolla dina webbläsarinställningar.";
				} else {
					errorText = "Fel vid inloggningen till google!";
				}
				setError(errorText);
				reject(errorText);
			});
	});
}
