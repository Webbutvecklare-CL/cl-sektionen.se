import React, { useState } from "react";
import CalendarSubscription from "../components/calendar/CalendarSubscription";

import styles from "../styles/kalender.module.css";

export default function Kalender() {
  const [activeIdx, setActiveIdx] = useState(0);
  function setCalendar(index) {
    setActiveIdx(index);
  }

  const sektionskalender_id = process.env.NEXT_PUBLIC_CL_CALENDAR;
  const grattankalender_id = "konsumclw%40gmail.com";

  return (
    <div id="contentbody" className="wideContent">
      <h1>Sektionskalendern och gråttbokningar</h1>
      <CalendarSubscription calendar_id={sektionskalender_id}>
        Prenumerera på <strong>Sektionskalendern</strong>:
      </CalendarSubscription>
      <CalendarSubscription calendar_id={grattankalender_id}>
        Prenumerera på <strong>Gråttankalendern</strong>:
      </CalendarSubscription>

      <div className={styles.tabsWrapper}>
        <button
          type="button"
          onClick={() => {
            setCalendar(0);
          }}
          className={`${styles.kalKnapp} ${styles.sektionskalender} ${
            activeIdx === 0 ? styles.active : ""
          }`}>
          Sektionskalender
        </button>
        <button
          type="button"
          onClick={() => {
            setCalendar(1);
          }}
          className={`${styles.kalKnapp} ${styles.gråttkalender} ${
            activeIdx === 1 ? styles.active : ""
          }`}>
          Gråttans kalender
        </button>
      </div>

      <div
        id={styles.sektionskal}
        className={styles.kalenderTab}
        style={{ display: activeIdx === 0 ? "block" : "none" }}>
        <h1 className={styles.kalTitel}>Sektionskalendern</h1>
        <iframe
          title="Sektionskalender månadsvy"
          id={`${styles.open} ${styles.web} ${styles.calendar}`}
          style={{
            background:
              "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
          }}
          src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fc_5sqhb0om2kmti770g06qqknfik%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;target=_blank"
          sandbox="allow-scripts allow-same-origin allow-top-navigation"
          scrolling="no"
          frameBorder="0"
          height="750px"
          width="100%"
        />
      </div>
      <div
        id={styles.gråttkal}
        className={styles.kalenderTab}
        style={{ display: activeIdx === 1 ? "block" : "none" }}>
        <h1 className={styles.kalTitel}>Gråttans kalender</h1>
        <iframe
          title="Gråttbokningar månadsvy"
          id={`${styles.open} ${styles.web} ${styles.calendar}`}
          style={{
            background:
              "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
          }}
          src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2F008gpl3s787te6jhipk5729c6g%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&language=sv&tab=month"
          sandbox="allow-scripts allow-same-origin allow-top-navigation"
          scrolling="no"
          frameBorder="0"
          height="750px"
          width="100%"
        />
      </div>
    </div>
  );
}
