import { useState, useEffect } from "react";

import { getFCMToken } from "../firebase/messaging"; // Filen
import { isSupported } from "firebase/messaging"; // Biblioteket
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";

import styles from "../styles/notification-modal.module.css";
import Toggle from "./Toggle";

export default function NotificationModal({ show, handleClose }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [information, setInformation] = useState(true);
  const [event, setEvent] = useState(true);
  const [mottagning, setMottagning] = useState(true);
  const [topics, setTopics] = useState({});

  const [noSupport, setNoSupport] = useState(true);

  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("");
  const [waitingText, setWaitingText] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!show) {
      document.querySelector("dialog").close();
      return;
    }

    isSupported().then((yes) => {
      setNoSupport(!yes);
      document.querySelector("dialog").showModal();

      if (!yes) {
        return;
      }

      if (Notification.permission !== "granted") {
        setNotificationsEnabled(false);
      }

      if (localStorage.getItem("notificationSettings")) {
        const notificationSettings = JSON.parse(localStorage.getItem("notificationSettings"));
        setInformation(notificationSettings.types.information);
        setEvent(notificationSettings.types.event);
        setMottagning(notificationSettings.types.mottagning);
      } else {
        console.log("Inga inställningar hittades");
      }
    });
  }, [show]);

  useEffect(() => {
    if (notificationsEnabled) {
      setInformation(true);
      setEvent(true);
      setMottagning(false);
    } else {
      setInformation(false);
      setEvent(false);
      setMottagning(false);
    }
  }, [notificationsEnabled]);

  const handleSave = async () => {
    setErrorText("");
    setStep("settings");
    const notificationSettings = {
      lastUpdated: new Date(),
      types: {
        information,
        event,
        mottagning,
      },
    };

    // Kolla att åtminstone en kategori är på
    if (!information && !event && !mottagning) {
      setErrorText("Du måste välja åtminstone en kategori");
      return;
    }

    // Kolla om användaren har accepterat notiser
    if (Notification.permission !== "granted") {
      // Visa användaren hur man gör
    }

    // Fråga om notiser
    setSaving(true);
    setWaitingText("");
    setStep("request");
    var token;
    try {
      setWaitingText("Väntar på tillåtelse att skicka notiser");
      token = await getFCMToken();
    } catch (error) {
      if (error.code === "messaging/permission-blocked") {
        console.log("Användaren har blockerat notiser");
        setErrorText(
          "Du har blockerat notiser. Du kan ändra detta i din webbläsares inställningar."
        );
      } else {
        console.error(error);
      }
      return;
    }
    const size = new TextEncoder().encode(JSON.stringify(notificationSettings)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    console.log(megaBytes);

    // Spara i databasen
    setStep("server");
    setWaitingText("Sparar inställningar...");
    // const fcmTokensRef = doc(firestore, `fcmTokens/${token}`);
    var obj = {};
    obj[token] = notificationSettings;
    const fcmTokensRef = doc(firestore, `fcmTokens/all`);
    try {
      await updateDoc(
        fcmTokensRef,
        {
          [`${token}`]: notificationSettings,
        },
        { merge: true }
      );

      //   await setDoc(fcmTokensRef, notificationSettings);
    } catch (error) {
      console.error(error);
      setErrorText("Något gick fel när inställningarna skulle sparas");
    }

    // Spara i localStorage
    setStep("local");
    setWaitingText("Sparar inställningar...");
    localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings));

    console.log("Inställningar sparade");

    // Stäng modal
    handleExit();
  };

  const handleExit = () => {
    setErrorText("");
    setWaitingText("");
    setSaving(false);
    setStep("");
    setNoSupport(false);

    handleClose();
  };

  if (noSupport) {
    return (
      <dialog className={styles.modal}>
        <div className={styles.content}>
          <div>
            <p>Din enhet stödjer inte notiser</p>
            <button onClick={handleExit}>Avsluta</button>
          </div>
        </div>
      </dialog>
    );
  }

  return (
    <dialog className={styles.modal}>
      <div className={styles.content}>
        <h2>Notiscenter</h2>
        {saving && (
          <div className={styles.waiting}>
            <p>{waitingText}</p>
            <p>{errorText}</p>
            <div className={styles.buttons}>
              <button
                onClick={() => {
                  setSaving(false);
                }}>
                Tillbaka
              </button>
              <button onClick={handleExit}>Avsluta</button>
            </div>
          </div>
        )}

        {!saving && (
          <div>
            <div className={styles.settings}>
              <Toggle toggled={notificationsEnabled} onClick={setNotificationsEnabled}>
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
                Mottagning {mottagning ? "på" : "av"}
              </Toggle>
            </div>
            <p>{errorText}</p>
            <div className={styles.buttons}>
              <button onClick={handleSave}>Spara</button>
              <button onClick={handleExit}>Avsluta</button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
