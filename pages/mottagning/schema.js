import BackButton from "../../components/BackButton";
import CalendarViewer from "../../components/mottagning/CalendarViewer";
import CustomHead from "../../components/CustomHead";

export default function Schema({ events }) {
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
          <CalendarViewer events={events} />
        </div>
      </div>
    </>
  );
}
