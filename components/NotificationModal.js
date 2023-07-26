import { useState, useEffect } from "react";
import Link from "next/link";

import { getFCMToken } from "../firebase/messaging"; // Filen
import { isSupported } from "firebase/messaging"; // Biblioteket
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";

import styles from "../styles/notification-modal.module.css";
import Toggle from "./Toggle";

export default function NotificationModal({ show, handleClose }) {
  const [noSupport, setNoSupport] = useState(true);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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

    // Kolla support innan den visar modal
    isSupported().then((yes) => {
      if (!yes) {
        if (!document.querySelector("dialog").open) {
          document.querySelector("dialog").showModal();
        }
        return;
      }
      setNoSupport(false);

      if (localStorage.getItem("notificationSettings")) {
        const notificationSettings = JSON.parse(localStorage.getItem("notificationSettings"));
        setNotificationsEnabled(notificationSettings.enabled);
        setInformation(notificationSettings.types.information);
        setEvent(notificationSettings.types.event);
        setMottagning(notificationSettings.types.mottagning);
      } else {
        console.log("Inga inställningar hittades");
      }

      if (!document.querySelector("dialog").open) {
        document.querySelector("dialog").showModal();
      }
    });
  }, [show]);

  useEffect(() => {
    if (notificationsEnabled) {
      setInformation(true);
      setEvent(true);
      setMottagning(true);
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
      enabled: notificationsEnabled,
      types: {
        information,
        event,
        mottagning,
      },
    };

    // Kolla att åtminstone en kategori är på
    if ((!information && !event && !mottagning) || !notificationsEnabled) {
      setErrorText("Du måste välja åtminstone en kategori");
      return;
    }

    // Kolla om användaren har accepterat notiser
    if (Notification.permission === "granted") {
    } else if (Notification.permission === "denied") {
      setSaving(true);
      setStep("retry");
      setWaitingText(
        "Du har tidigare blockerat notiser. Du kan ändra detta i din webbläsares inställningar."
      );
    } else {
      setWaitingText("Väntar på tillåtelse att skicka notiser");
    }

    // Fråga om notiser
    setSaving(true);
    setWaitingText("");
    setStep("request");
    var token;
    try {
      setWaitingText(
        "Väntar på tillåtelse att skicka notiser... Tillåt notiser genom att trycka på tillåt."
      );
      token = await getFCMToken();
    } catch (error) {
      if (error.code === "messaging/permission-blocked") {
        if (Notification.permission === "denied") {
          setWaitingText(
            "Notiser är sedan tidigare avstängda. Tillåt notiser genom att klicka på låset i adressfältet eller i din webbläsares inställningar."
          );
        } else {
          setWaitingText(
            "Tillåt notiser genom att klicka på låset i adressfältet eller i din webbläsares inställningar."
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
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify({ token, ...notificationSettings })
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

  if (noSupport) {
    return (
      <dialog className={styles.modal}>
        <div className={styles.content}>
          <div>
            <h1>Din enhet stödjer inte notiser</h1>
            {deviceType === "Android" && (
              <>
                <p>För att motta notiser behöver du tillåta notiser i din webbläsare.</p>
                <p>
                  Om du inte kan göra det testa att använda Chrome eller Safari och lägg till
                  webbplatsen på hemskärmen.
                </p>
              </>
            )}
            {["iPad", "iPhone"].includes(deviceType) && (
              <>
                <p>För att motta notiser behöver du spara webbplatsen på din hemskärm.</p>
                <ul className={styles.instructions}>
                  <li>
                    Tryck på dela knappen{" "}
                    <i className={`fa ${styles.faAppleShare}`} aria-hidden="true" />
                  </li>
                  <li>Scrolla ned</li>
                  <li>
                    Tryck på &quot;Lägg till på hemskärmen&quot;{" "}
                    <i className="fa-regular fa-square-plus" />
                  </li>
                </ul>
              </>
            )}
            <div className={styles.buttons}>
              <button onClick={handleExit}>Stäng</button>
            </div>
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
            <p>
              Här kan du välja vilka typer av notiser du vill få. Dina val sparas i din webbläsare,
              läs mer i vår <Link href="/kakpolicy">kakpolicy</Link>.
            </p>
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
                Mottagningsnyheter {mottagning ? "på" : "av"}
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
