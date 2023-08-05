import GråttAgenda from "../components/GråttAgenda";
import GråttKalender from "../components/GråttKalender";

import calStyles from "../styles/kalender.module.css";

export default function CalendarsWrapper() {
  return (
    <>
      <iframe
        title="Sektionskalender månadsvy"
        className={`${calStyles.openWebCalendar} ${calStyles.månad}`}
        style={{
          background:
            "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
        }}
        src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fc_5sqhb0om2kmti770g06qqknfik%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=month"
        sandbox="allow-scripts allow-same-origin allow-top-navigation"
        height="400px"
        width="100%"
        loading="lazy"
      />
      <GråttAgenda className={calStyles.agendaVy} />
      <br />
      <GråttKalender />
    </>
  );
}

export function CalendarLoader() {
  return (
    <div className={calStyles.loader}>
      <div>
        <p>Laddar kalendrar...</p>
      </div>
      <div
        className={`${calStyles.miniKalender} ${calStyles.kalenderTab} ${calStyles.gråttan} ${calStyles.månad}`}>
        <h1 className={calStyles.kalTitel}></h1>
        <div>
          <p>Laddar kalendrar...</p>
        </div>
      </div>
    </div>
  );
}
