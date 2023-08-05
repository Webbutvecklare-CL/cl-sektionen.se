import { useEffect, useState } from "react";

import styles from "../styles/notification-bell.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import NotificationModal from "./NotificationModal";
import { isSupported } from "firebase/messaging";

export default function NotificationBell({
  hideIfNoSupport = false,
  floating = false,
  messageOptions,
}) {
  const [showBell, setShowBell] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const [showHint, setShowHint] = useState(false);
  const [noSupport, setNoSupport] = useState(false);

  useEffect(() => {
    // Gömmer klockan om användaren tidigare stängt av den
    const settings = JSON.parse(localStorage.getItem("notificationSettings"));
    const show = settings?.showBell === undefined ? true : settings?.showBell;
    setShowBell(show);
    if (!show) return;

    // Hinten visas inte förutom om notiser är supportat och användaren inte tidigare tillåtit notiser
    isSupported().then((supported) => {
      if (!supported) {
        setNoSupport(true);
        setShowBell(true);
        // Visar ingen hint om det inte finns stöd
        return;
      } else {
        // Kollar om användaren tidigare har tillåtit notiser och om inställningar finns
        // Om något saknas visas en hinten
        if (Notification.permission == "default" && !localStorage.getItem("notificationSettings")) {
          // Visar hinten efter 2 sekunder och stänger av den efter 7 sekunder
          setTimeout(() => {
            setShowHint(true);
          }, messageOptions?.delay || 2000);
          setTimeout(() => {
            setShowHint(false);
          }, messageOptions?.delay + messageOptions?.duration || 9000);
        }
      }
    });
  }, [messageOptions]);

  // Kolla support innan den visar modal

  //   if (hideIfNoSupport && noSupport) return <></>;
  if (!showBell && floating) return <></>;

  return (
    <>
      <div
        className={`${styles.bellWrapper} ${floating ? styles.floating : ""}`}
        onClick={() => {
          setShowHint(false);
          setShowNotificationSettings(true);
        }}>
        {messageOptions && (
          <span className={`${styles.hint} ${showHint ? "" : styles.hidden}`}>
            <span>
              Missa inga meddelanden!
              <br />
              Slå på notiser!
            </span>
          </span>
        )}
        <span className={styles.bell}>
          <FontAwesomeIcon icon={faBell} />
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
