import Card from "../components/Card";
import CopyButton from "../components/CopyButton";

import { calendarSubscription } from "../styles/kalender.module.css";

export default function CalendarSubscription({ calendar_id, children }) {
  return (
    <div className={calendarSubscription}>
      <p>{children}</p>
      <Card link={`webcal://calendar.google.com/calendar/ical/${calendar_id}/public/basic.ics`}>
        iCal <i className="fa-brands fa-apple" />
      </Card>
      <Card
        link={`https://calendar.google.com/calendar/render?cid=https://calendar.google.com/calendar/ical/${calendar_id}/public/basic.ics`}>
        Google Kalender <i className="fa-brands fa-android" />
      </Card>
      <CopyButton text={calendar_id}>
        Kopiera kalender id <i className="fa-regular fa-copy" />
      </CopyButton>
    </div>
  );
}
