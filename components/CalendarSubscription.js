import Card from "../components/Card";
import CopyButton from "../components/CopyButton";

import { calendarSubscription } from "../styles/kalender.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAndroid, faApple } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

export default function CalendarSubscription({ calendar_id, children }) {
  return (
    <div className={calendarSubscription}>
      <p>{children}</p>
      <Card link={`webcal://calendar.google.com/calendar/ical/${calendar_id}/public/basic.ics`}>
        iCal <FontAwesomeIcon icon={faApple} />
      </Card>
      <Card
        link={`https://calendar.google.com/calendar/render?cid=https://calendar.google.com/calendar/ical/${calendar_id}/public/basic.ics`}>
        Google Kalender <FontAwesomeIcon icon={faAndroid} />
      </Card>
      <CopyButton text={calendar_id}>
        Kopiera kalender id <FontAwesomeIcon icon={faCopy} />
      </CopyButton>
    </div>
  );
}
