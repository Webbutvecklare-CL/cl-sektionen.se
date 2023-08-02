import { useEffect, useState } from "react";

import styles from "../styles/notification-bell.module.css";
import { solid, bell } from "../styles/fontawesome.module.css";
import NotificationModal from "./NotificationModal";
import { isSupported } from "firebase/messaging";

export default function NotificationBell({}) {
  const [showBell, setShowBell] = useState(true);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Hinten visas inte förutom om notiser är supportat och användaren inte tidigare tillåtit notiser
    isSupported().then((supported) => {
      if (!supported) {
        return;
      } else {
        // Kollar om användaren tidigare har tillåtit notiser och om inställningar finns
        // Om något saknas visas en hinten
        if (
          Notification.permission !== "granted" &&
          !localStorage.getItem("notificationSettings")
        ) {
          setTimeout(() => {
            setShowHint(true);
          }, 2000);
          setTimeout(() => {
            setShowHint(false);
          }, 7000);
        }
      }
    });
  }, []);

  // Kolla support innan den visar modal

  if (!showBell) return <></>;

  return (
    <>
      <div
        className={styles.bell}
        onClick={() => {
          setShowHint(false);
          setShowNotificationSettings(true);
        }}>
        <span className={`${styles.hint} ${!showHint ? styles.hidden : ""}`}>
          <span>
            Missa inga meddelanden!
            <br />
            Slå på notiser!
          </span>
        </span>
        <span>
          <i className={`${solid} ${bell}`} />
        </span>
      </div>

      {showNotificationSettings && (
        <NotificationModal
          show={showNotificationSettings}
          handleClose={() => {
            setShowNotificationSettings(false);
          }}
        />
      )}
    </>
  );
}
