import React, { useState } from "react";
import CalendarSubscription from "../components/CalendarSubscription";

function Kalender() {
  const [activeIdx, setActiveIdx] = useState(0);
  function setCalendar(index) {
    setActiveIdx(index);
  }

  const sektionskalender_id =
    "c_ed90bbde0bd3990cdf20f078c68d8e45822fea3b82ffd69687c36ffb0270924f@group.calendar.google.com";
  const grattankalender_id = "konsumclw%40gmail.com";

  return (
    <div id="contentbody">
      <h1>Sektionskalendern och gråttbokningar</h1>
      <CalendarSubscription id={sektionskalender_id}>
        Prenumerera på <strong>Sektionskalendern</strong>:
      </CalendarSubscription>
      <CalendarSubscription id={grattankalender_id}>
        Prenumerera på <strong>Gråttankalendern</strong>:
      </CalendarSubscription>

      <div className="tabs-wrapper">
        <button
          onClick={() => {
            setCalendar(0);
          }}
          className={`kal-knapp sektionskalender ${activeIdx === 0 ? "active" : ""}`}>
          Sektionskalender
        </button>
        <button
          onClick={() => {
            setCalendar(1);
          }}
          className={`kal-knapp gråttkalender ${activeIdx === 1 ? "active" : ""}`}>
          Gråttans kalender
        </button>
      </div>

      <div
        id="sektionskal"
        className="kalender_tab"
        style={{ display: activeIdx === 0 ? "block" : "none" }}>
        <h1 className="kal_titel">Sektionskalendern</h1>
        <iframe
          id="open-web-calendar"
          style={{
            background:
              "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
          }}
          src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fc_5sqhb0om2kmti770g06qqknfik%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;target=_blank"
          sandbox="allow-scripts allow-same-origin allow-top-navigation"
          scrolling="no"
          frameBorder="0"
          height="750px"
          width="100%"></iframe>
      </div>
      <div
        id="gråttkal"
        className="kalender_tab"
        style={{ display: activeIdx === 1 ? "block" : "none" }}>
        <h1 className="kal_titel">Gråttans kalender</h1>
        <iframe
          id="open-web-calendar"
          style={{
            background:
              "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
          }}
          src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2F008gpl3s787te6jhipk5729c6g%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&language=sv&tab=month"
          sandbox="allow-scripts allow-same-origin allow-top-navigation"
          scrolling="no"
          frameBorder="0"
          height="750px"
          width="100%"></iframe>
      </div>
    </div>
  );
}
export default Kalender;
