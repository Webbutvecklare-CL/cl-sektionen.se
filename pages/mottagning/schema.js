import BackButton from "../../components/BackButton";
import CalendarViewer from "../../components/mottagning/CalendarViewer";

export default function Schema({ events }) {
  return (
    <div id="contentbody">
      <BackButton page="mottagning">Mottagningssidan</BackButton>
      <div>
        <h1>Mottagning - Schema</h1>
      </div>
      <div>
        <CalendarViewer events={events} />
      </div>
    </div>
  );
}
