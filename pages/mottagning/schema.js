import BackButton from "@/components/BackButton";
import CustomHead from "@/components/CustomHead";
import CalendarSubscription from "@/components/calendar/CalendarSubscription";
import CalendarViewer from "@/components/mottagning/CalendarViewer";

export default function Schema() {
	const calendar_id =
		"c_685fdcb158806451f21d0cfd532eb5582884b6fb6102c4b35a1ab3362ebad500@group.calendar.google.com";
	return (
		<>
			<CustomHead
				metaTitle={"Mottagningsschema | Sektionen för Civilingenjör och Lärare"}
				description={"Schemat för mottagningen 2023."}
				url={"https://www.cl-sektionen.se/mottagning/schema"}
			/>
			<div id="contentbody" className="wideContent">
				<BackButton page="mottagning">Mottagningssidan</BackButton>
				<div>
					<h1>Mottagning - Schema</h1>
				</div>
				<div>
					<CalendarSubscription calendar_id={calendar_id}>
						<strong>Lägg till i din egna kalender:</strong>
					</CalendarSubscription>
					<CalendarViewer calendar_id={calendar_id} />
				</div>
			</div>
		</>
	);
}
