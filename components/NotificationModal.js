import Link from "next/link";
import { useEffect, useState } from "react";

import { app } from "@/firebase/clientApp";
import { getFCMToken } from "@/firebase/messaging"; // Filen
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { isSupported } from "firebase/messaging"; // Biblioteket
const firestore = getFirestore(app);

import { fa } from "@/styles/fontawesome.module.css"; // För att ios dela ikonen ska fungera
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Toggle from "@/components/Toggle";
import styles from "@/styles/notification-modal.module.css";

export default function NotificationModal({ show, handleClose }) {
	const [noSupport, setNoSupport] = useState(true);

	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [showBell, setShowBell] = useState(true);
	const [information, setInformation] = useState(true);
	const [event, setEvent] = useState(true);
	const [mottagning, setMottagning] = useState(true);

	const [saving, setSaving] = useState(false);
	const [step, setStep] = useState("");
	const [waitingText, setWaitingText] = useState("");
	const [errorText, setErrorText] = useState("");

	const [deviceType, setDeviceType] = useState("");

	useEffect(() => {
		if ("navigator" in window) {
			if (/iPhone/i.test(navigator.userAgent)) {
				setDeviceType("iPhone");
			} else if (/android/i.test(navigator.userAgent)) {
				setDeviceType("Android");
			} else {
				setDeviceType("other");
			}
		} else {
			setDeviceType("other");
		}
	}, []);

	useEffect(() => {
		if (!show) {
			document.querySelector("dialog").close();
			return;
		}

		const settings = JSON.parse(localStorage.getItem("notificationSettings"));
		if (settings) {
			setNotificationsEnabled(settings.enabled);
			setShowBell(settings.showBell);
			if (settings.types) {
				console.log(settings.types.event);
				setInformation(settings.types.information);
				setEvent(settings.types.event);
				setMottagning(settings.types.mottagning);
			}
		} else {
			console.log("Inga inställningar hittades");
		}

		// Kolla support innan den visar modal
		isSupported().then((yes) => {
			if (!document.querySelector("dialog").open) {
				document.querySelector("dialog").showModal();
			}
			if (yes) {
				// Enheten stödjer inte notiser
				setNoSupport(false);
			} else {
				setNoSupport(true);
			}
		});
	}, [show]);

	useEffect(() => {
		if (!notificationsEnabled) {
			setInformation(false);
			setEvent(false);
			setMottagning(false);
		}
	}, [notificationsEnabled]);

	const handleSave = async () => {
		let token;
		setErrorText("");
		setStep("settings");
		const notificationSettings = {
			lastUpdated: new Date(),
			enabled: notificationsEnabled,
			showBell,
			types: {
				information,
				event,
				mottagning,
			},
		};

		// Kolla att åtminstone en kategori är på om notiser är på
		if (!information && !event && !mottagning && notificationsEnabled) {
			setErrorText("Du måste välja åtminstone en kategori");
			return;
		}

		if (!notificationsEnabled) {
			setStep("local");
			setWaitingText("Sparar inställningar...");
			localStorage.setItem(
				"notificationSettings",
				JSON.stringify({ token, ...notificationSettings }),
			);
			handleExit();
			console.log("Exiting modal");
			return;
		}

		// Kolla om användaren har accepterat notiser
		if (Notification.permission === "granted") {
			// Continue
		} else if (Notification.permission === "denied") {
			setSaving(true);
			setStep("retry");
			setWaitingText(
				"Du har tidigare blockerat notiser. Du kan ändra detta i din webbläsares inställningar.",
			);
			return;
		} else {
			console.log("Waiting for permission");
			setWaitingText("Väntar på tillåtelse att skicka notiser");
			return;
		}

		// Fråga om notiser
		setSaving(true);
		setWaitingText("");
		setStep("request");
		try {
			setWaitingText(
				"Väntar på tillåtelse att skicka notiser... Tillåt notiser genom att trycka på tillåt.",
			);
			token = await getFCMToken();
		} catch (error) {
			if (error.code === "messaging/permission-blocked") {
				if (Notification.permission === "denied") {
					setWaitingText(
						"Notiser är sedan tidigare avstängda. Tillåt notiser genom att klicka på låset i adressfältet eller i din webbläsares inställningar.",
					);
				} else {
					setWaitingText(
						"Tillåt notiser genom att klicka på låset i adressfältet eller i din webbläsares inställningar.",
					);
				}

				console.log("Användaren har blockerat notiser");
			} else {
				console.error(error);
				setErrorText("Något gick fel när notiser skulle aktiveras");
			}
			return;
		}

		// Spara i databasen
		setStep("server");
		setWaitingText("Sparar inställningar...");

		try {
			const fcmTokensRef = doc(firestore, "fcmTokens/all");
			await updateDoc(
				fcmTokensRef,
				{ [token]: notificationSettings },
				{ merge: true },
			);
		} catch (error) {
			console.error(error);
			setErrorText("Något gick fel när inställningarna skulle sparas");
			return;
		}

		// Spara i localStorage
		setStep("local");
		setWaitingText("Sparar inställningar...");
		localStorage.setItem(
			"notificationSettings",
			JSON.stringify({ token, ...notificationSettings }),
		);

		console.log("Inställningar sparade");

		// Stäng modal
		handleExit();
	};

	const handleExit = () => {
		setErrorText("");
		setWaitingText("");
		setSaving(false);
		setStep("");
		setNoSupport(true);

		handleClose();
	};

	const hideBell = () => {
		localStorage.setItem("notificationSettings", JSON.stringify({ showBell }));
		handleExit();
	};

	const BellSetting = () => {
		return (
			<>
				<h3>Notifikations ikonen:</h3>
				<Toggle toggled={showBell} onClick={setShowBell}>
					Visar {showBell ? "" : "inte"} klockan
				</Toggle>
				<p>
					Denna inställningen ändra synligheten av ringklockan i nedre högra
					hörnet.
					<br />
					Klockan finns även på <Link href={"/aktuellt"}>Info & Event</Link>
				</p>
			</>
		);
	};

	if (noSupport) {
		return (
			<dialog className={styles.modal}>
				<div className={styles.content}>
					<div>
						<h1>Din enhet stödjer inte notiser</h1>
						{deviceType === "Android" && (
							<>
								<p>
									För att motta notiser behöver du tillåta notiser i din
									webbläsare.
								</p>
								<p>
									Om du inte kan göra det testa att använda Chrome eller Safari
									och lägg till webbplatsen på hemskärmen.
								</p>
							</>
						)}
						{["iPad", "iPhone"].includes(deviceType) && (
							<>
								<p>
									För att motta notiser behöver du spara webbplatsen på din
									hemskärm.
								</p>
								<ul className={styles.instructions}>
									<li>
										Tryck på dela knappen{" "}
										<i className={`${fa} ${styles.faAppleShare}`} />
									</li>
									<li>Scrolla ned</li>
									<li>
										Tryck på &quot;Lägg till på hemskärmen&quot;{" "}
										<FontAwesomeIcon icon={faSquarePlus} />
									</li>
								</ul>
							</>
						)}
						<BellSetting />
						<div className={styles.buttons}>
							<button type="button" onClick={hideBell}>
								Spara val
							</button>
							<button type="button" onClick={handleExit}>
								Stäng
							</button>
						</div>
					</div>
				</div>
			</dialog>
		);
	}

	return (
		<dialog className={styles.modal}>
			<div className={styles.content}>
				<h2>Notifikationsinställningar</h2>

				{saving && (
					<div className={styles.waiting}>
						<p>{waitingText}</p>
						<p>{errorText}</p>

						<div className={styles.buttons}>
							<button
								type="button"
								onClick={() => {
									setSaving(false);
								}}
							>
								Tillbaka
							</button>
							<button type="button" onClick={handleExit}>
								Avsluta
							</button>
						</div>
					</div>
				)}

				{!saving && (
					<div>
						<p>
							Här kan du välja vilka typer av notiser du vill få. Dina val
							sparas i din webbläsare, läs mer i vår{" "}
							<Link href="/kakpolicy">kakpolicy</Link>.
						</p>
						<div className={styles.settings}>
							<Toggle
								toggled={notificationsEnabled}
								onClick={setNotificationsEnabled}
							>
								Notiser {notificationsEnabled ? "på" : "av"}
							</Toggle>
							<h3>Kategorier:</h3>
							<Toggle toggled={information} onClick={setInformation}>
								Informationsinlägg {information ? "på" : "av"}
							</Toggle>
							<Toggle toggled={event} onClick={setEvent}>
								Eventinlägg {event ? "på" : "av"}
							</Toggle>
							<Toggle toggled={mottagning} onClick={setMottagning}>
								Mottagningsnyheter {mottagning ? "på" : "av"}
							</Toggle>

							<BellSetting />
						</div>
						<p>{waitingText}</p>
						<p>{errorText}</p>
						<div className={styles.buttons}>
							<button type="button" onClick={handleSave}>
								Spara
							</button>
							<button type="button" onClick={handleExit}>
								Avsluta
							</button>
						</div>
					</div>
				)}
			</div>
		</dialog>
	);
}
