import { useState } from "react";

import styles from "../styles/notification-bell.module.css";
import NotificationModal from "./NotificationModal";

export default function NotificationBell({}) {
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Kolla support innan den visar modal

  return (
    <>
      <span
        className={styles.bell}
        onClick={() => {
          setShowNotificationSettings(true);
        }}>
        <i className="fa-solid fa-bell" />
      </span>
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
