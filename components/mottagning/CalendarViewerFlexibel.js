import { forwardRef, useEffect, useRef, useState } from "react";

import { getPublicEvents } from "@/utils/calendarUtils";

import styles from "@/styles/calendar-viewer.module.css";

export default function CalendarViewer() {
	const [events, setEvents] = useState([]);
	const [weeksList, setWeeksList] = useState([]);
	const gridRef = useRef(null);
	const [scale, setScale] = useState(48);

	const [startDate, setStartDate] = useState("2023-08-14");

	const calendar_id =
		"c_1351cc6b384ac29b6abd7b38136ebae1b08e383e3cc6299a3aa90303770f46ed@group.calendar.google.com";

	useEffect(() => {
		const startMottagning = new Date("2023-08-14").toISOString();
		const endMottagning = new Date("2023-09-03").toISOString();
		const firstWeekM = new Date("2023-08-20").toISOString();
		const secondWeekM = new Date("2023-08-21").toISOString();
		const secondWeekS = new Date("2023-08-27").toISOString();
		const thirdWeekM = new Date("2023-08-28").toISOString();
		const query = {
			orderBy: "startTime",
			singleEvents: true,
			timeMin: startMottagning,
			timeMax: endMottagning,
		};
		getPublicEvents(calendar_id, query).then((data) => {
			const weeks = [];
			weeks.push(getEventListSpan(data, startMottagning, firstWeekM));
			weeks.push(getEventListSpan(data, secondWeekM, secondWeekS));
			weeks.push(getEventListSpan(data, thirdWeekM, endMottagning));
		});
	}, []);

	useEffect(() => {
		getWeek(calendar_id, new Date()).then((data) => setEvents(data));
	}, []);

	useEffect(() => {
		getWeek(calendar_id, startDate).then((data) => setEvents(data));
	}, [startDate]);

	useEffect(() => {
		// Scrolla till 8:00
		gridRef.current.scrollTo(0, scale * 8);
	}, [scale]);

	const EventBox = ({ event }) => {
		const start = new Date(event.start.dateTime);
		const end = new Date(event.end.dateTime);

		// Räkna ut höjden på eventet
		const duration = (end - start) / (3600 * 1000); // i timmar
		const height = duration * scale;

		// Räkna ut starttiden
		const reference = new Date(
			start.getFullYear(),
			start.getMonth(),
			start.getDate(),
			0,
		);
		const startTime = (start - reference) / (3600 * 1000); // Till timmar
		const top = startTime * scale;
		const posStyles = {
			height: `${height - 3}px`,
			top: `${top}px`,
		};
		return (
			<div className={styles.eventBox} style={posStyles}>
				<p>{event.summary}</p>
				{/* <p>{event.description}</p> */}
				{/* <p>Start: {event.start.dateTime}</p>
          <p>Slut: {event.end.dateTime}</p>
          <p>Uppdaterad: {event.updated}</p> */}
			</div>
		);
	};

	const DayBox = ({ dayList }) => {
		return (
			<div className={styles.dayBox}>
				{dayList?.map((event, index) => (
					<EventBox event={event} key={index} />
				))}
			</div>
		);
	};

	const Grid = forwardRef(function Grid({ events }, ref) {
		const dayLists = weekToDayLists(events);

		const horizontalLines = [];
		for (let i = 0; i < 24; i++) {
			horizontalLines.push(<div className={styles.horizontalLine} key={i} />);
		}
		const timeStamps = [<div className={styles.timeStamps} key={0} />];
		for (let i = 1; i < 24; i++) {
			timeStamps.push(
				<div className={styles.timeStamps} key={i}>
					<span>{i < 10 ? `0${i}` : i}:00</span>
					<span />
				</div>,
			);
		}

		return (
			<div className={styles.grid} ref={ref}>
				<div className={styles.timeLine}>{timeStamps}</div>
				<div className={styles.lineContainer}>{horizontalLines}</div>
				<DayBox dayList={dayLists[0]} />
				<DayBox dayList={dayLists[1]} />
				<DayBox dayList={dayLists[2]} />
				<DayBox dayList={dayLists[3]} />
				<DayBox dayList={dayLists[4]} />
				<DayBox dayList={dayLists[5]} />
				<DayBox dayList={dayLists[6]} />
			</div>
		);
	});

	const Header = () => {
		return (
			<div className={styles.header}>
				<div />

				<HeaderItem>Måndag</HeaderItem>
				<HeaderItem>Tisdag</HeaderItem>
				<HeaderItem>Onsdag</HeaderItem>
				<HeaderItem>Torsdag</HeaderItem>
				<HeaderItem>Fredag</HeaderItem>
				<HeaderItem>Lördag</HeaderItem>
				<HeaderItem>Söndag</HeaderItem>
				<div>
					<span className={styles.headerSpacer} />
				</div>
			</div>
		);
	};

	const HeaderItem = ({ children }) => {
		return (
			<div className={styles.headerItem}>
				<span className={styles.headerDay}>{children}</span>
				<span className={styles.headerDate}>{10}</span>
				<span className={styles.headerSpacer} />
			</div>
		);
	};

	return (
		<div
			className={styles.calendarViewer}
			style={{
				"--scale": `${scale}px`,
			}}
		>
			<input
				type="date"
				min="2023-08-14"
				max="2023-09-03"
				value={startDate}
				onChange={(e) => {
					setStartDate(e.target.value);
				}}
			/>
			<button
				type="button"
				onClick={() => {
					const day = new Date(startDate);
					day.setDate(day.getDate() - 7);
					if (day >= new Date("2023-08-14")) {
						setStartDate(day.toISOString().split("T")[0]);
					}
				}}
			>
				Förra vecka
			</button>
			<h2>Vecka: {getWeekNumber(startDate)}</h2>
			<button
				type="button"
				onClick={() => {
					const day = new Date(startDate);
					day.setDate(day.getDate() + 7);
					if (day <= new Date("2023-09-03")) {
						setStartDate(day.toISOString().split("T")[0]);
					}
				}}
			>
				Nästa vecka
			</button>
			<Header />
			<Grid events={events} ref={gridRef} />
			<input
				type="range"
				min="20"
				max="60"
				value={scale}
				name="scale"
				onChange={(e) => {
					setScale(e.target.value);
				}}
			/>
		</div>
	);
}

async function getWeek(calendar_id, date) {
	const now = new Date(date);

	const weekDay = now.getDay() === 0 ? 7 : now.getDay();

	const weekStart = new Date(now.setDate(now.getDate() - weekDay + 1));
	const weekEnd = new Date(now.setDate(now.getDate() + 6));

	const query = {
		orderBy: "startTime",
		singleEvents: true,
		timeMin: weekStart.toISOString(),
		timeMax: weekEnd.toISOString(),
	};
	const response = await getPublicEvents(calendar_id, query);
	return response;
}

function weekToDayLists(events) {
	const days = [[], [], [], [], [], [], []];

	// Event listan är och måste vara i ordning efter start tid/datum
	for (const event of events) {
		const date = new Date(event.start.dateTime);

		const weekDay = date.getDay() === 0 ? 7 : date.getDay();

		days[weekDay - 1].push(event);
	}

	return days;
}

function getWeekNumber(refDate) {
	const date = new Date(refDate);
	date.setDate(date.getDate() + 4 - (date.getDay() || 7)); // Set to nearest Thursday: current date + 4 - current day number, make Sunday's day number 7
	const yearStart = new Date(date.getFullYear(), 0, 1);
	const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7); // Calculate full weeks to nearest Thursday
	return weekNo;
}

function getEventListSpan(eventList, startDate, endDate) {
	const span = [];
	for (const event of eventList) {
		if (eventDate >= startDate && eventDate <= endDate) {
			span.push(event);
		}
	}
	return span;
}
