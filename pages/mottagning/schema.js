import BackButton from "../../components/BackButton";
import CalendarViewer from "../../components/mottagning/CalendarViewer";
import CustomHead from "../../components/CustomHead";
import CalendarSubscription from "../../components/calendar/CalendarSubscription";

export default function Schema() {
  const calendar_id =
    "c_1351cc6b384ac29b6abd7b38136ebae1b08e383e3cc6299a3aa90303770f46ed@group.calendar.google.com";
  return (
    <>
      <CustomHead
        metaTitle={`Mottagningsschema | Sektionen för Civilingenjör och Lärare`}
        description={"Schemat för mottagningen 2023."}
        url={"https://www.cl-sektionen.se/mottagning/schema"}
      />
      <div id="contentbody">
        <BackButton page="mottagning">Mottagningssidan</BackButton>
        <div>
          <h1>Mottagning - Schema</h1>
        </div>
        <div>
          <CalendarSubscription calendar_id={calendar_id}>
            <h3>Lägg till i din egna kalender:</h3>
          </CalendarSubscription>
          <CalendarViewer calendar_id={calendar_id} />
        </div>
      </div>
    </>
  );
}
