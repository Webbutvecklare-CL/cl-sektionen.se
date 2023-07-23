import BackButton from "../../components/BackButton";
import CalendarViewer from "../../components/mottagning/CalendarViewer";
import { getPublicEvents } from "../../utils/calendarUtils";

export default function Schema({ events }) {
  return (
    <div id="contentbody">
      <BackButton page="mottagning">Mottagningssidan</BackButton>
      <div>
        <p>Här finns schemat för mottagningen. Kanske kommer schemat kunna uppdateras?</p>
      </div>
      <div>
        <CalendarViewer events={events} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const calendar_id =
    "c_1351cc6b384ac29b6abd7b38136ebae1b08e383e3cc6299a3aa90303770f46ed@group.calendar.google.com";
  let events = [];
  try {
    events = await getPublicEvents(calendar_id, { orderBy: "startTime", singleEvents: true });
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      events: events,
    },
  };
}
