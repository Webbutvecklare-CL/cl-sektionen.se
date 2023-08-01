import React, { useEffect, useState, useRef, forwardRef, use } from "react";

import HTMLString from "react-html-string";

import { getPublicEvents } from "../../utils/calendarUtils";
import Link from "next/link";

import styles from "../../styles/calendar-viewer.module.css";

export default function CalendarViewer() {
  const startDay = new Date(new Date("2023-08-14").setHours(0, 0, 0, 0));
  const [events, setEvents] = useState([]);
  const [weeksList, setWeeksList] = useState([]);
  const [scale, setScale] = useState(48);
  const [nrOfDays, setNrOfDays] = useState(7);
  const viewingHours = 16;

  const types = {
    mtp: { color: "#FFD966", name: "Matteövning" },
    bst: { color: "#E69138", name: "Bästis" },
    atp: { color: "#1170C6", name: "Aktivitet" },
    ndp: { color: "#E06666", name: "Nämndpass" },
    ifp: { color: "#E69138", name: "Informationspass" },
    lc: { color: "#EFB6B6", name: "Lunch" },
    oq: { color: "#587B49", name: "Osqvik" },
    gq: { color: "#25AEAE", name: "Gasque" },
    bfp: { color: "#25AEAE", name: "Bakishäng" },
    gsk: { color: "#6AA84F", name: "Gyckelskola" },
    tkp: { color: "#A4C2F4", name: "THS och KTH" },
    dsp: { color: "#76A5AF", name: "Dubbelspexet" },
    gqw: { color: "#45818E", name: "Dubbel gasque" },
  };

  const calendar_id =
    "c_1351cc6b384ac29b6abd7b38136ebae1b08e383e3cc6299a3aa90303770f46ed@group.calendar.google.com";

  useEffect(() => {
    const startMottagning = new Date("2023-08-14").toISOString();
    const endMottagning = new Date("2023-09-04").toISOString();
    const firstWeekM = new Date("2023-08-14");
    const secondWeekM = new Date("2023-08-21");
    const thirdWeekM = new Date("2023-08-28");

    const query = {
      orderBy: "startTime",
      singleEvents: true,
      timeMin: startMottagning,
      timeMax: endMottagning,
    };
    getPublicEvents(calendar_id, query).then((data) => {
      let weeks = [];
      weeks.push(getEventListSpan(data, firstWeekM, 7));
      weeks.push(getEventListSpan(data, secondWeekM, 7));
      weeks.push(getEventListSpan(data, thirdWeekM, 7));
      setWeeksList(weeks);
      setEvents(data);
    });
  }, []);

  const EventBox = ({ event, setInfoBoxData }) => {
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
      24 - viewingHours
    );
    const startTime = (start - reference) / (3600 * 1000); // Till timmar
    const top = startTime * scale;

    // Positionen för eventet
    const posStyles = {
      height: `${height - 3}px`,
      top: `${top}px`,
    };

    const values = event.description.split(/\n|<br>/);
    const location = values[0].substring(7) || "Kolla med bästis";
    const desc = values[1].substring(13);
    const id = values[2].substring(4);

    const color = types[id]?.color || "var(--clr2)";

    const eventClick = () => {
      console.log(id);
      setInfoBoxData({
        top: top,
        title: event.summary,
        location,
        description: desc,
        start: event.start.dateTime,
        end: event.end.dateTime,
      });
    };

    return (
      <>
        <div
          className={styles.eventBox}
          style={{ ...posStyles, backgroundColor: color }}
          onClick={eventClick}>
          <div>
            <p>{event.summary}</p>
            <div className={styles.description}>
              <p>
                Plats: <HTMLString html={location} />
              </p>
              {/* <p>{desc}</p> */}
            </div>
          </div>
        </div>
      </>
    );
  };

  const EventInfoBox = ({ data, close }) => {
    return (
      <div
        className={styles.eventInfoBox}
        // style={{ top: `${0}px` }}
        onClick={() => {
          close();
        }}>
        <h2>{data.title}</h2>
        <p>
          Plats: <HTMLString html={data.location} />
        </p>
        <p>
          <HTMLString html={data.description} />
        </p>
        <p>Start: {data.start.split("T")[1].substring(0, 5)}</p>
        <p>Slut: {data.end.split("T")[1].substring(0, 5)}</p>
      </div>
    );
  };

  const DayBox = ({ dayList, setInfoBoxData }) => {
    return (
      <div className={styles.dayBox} style={{ height: `${scale * viewingHours - 1}px` }}>
        {dayList?.map((event, index) => (
          <EventBox event={event} key={index} setInfoBoxData={setInfoBoxData} />
        ))}
      </div>
    );
  };

  const Grid = ({ weeksList }) => {
    const [infoBoxData, setInfoBoxData] = useState(null);
    const [dayLists, setDayLists] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [refDate, setRefDate] = useState(new Date("2023-08-14"));

    const horizontalLines = [];

    const gridRef = useRef(null);

    for (let i = 24 - viewingHours; i < 24; i++) {
      horizontalLines.push(<div className={styles.horizontalLine} key={i} />);
    }

    const timeStamps = [<div className={styles.timeStamps} key={0}></div>];
    for (let i = 25 - viewingHours; i < 24; i++) {
      timeStamps.push(
        <div className={styles.timeStamps} key={i}>
          <span>{i < 10 ? "0" + i : i}:00</span>
          <span />
        </div>
      );
    }

    const Menu = () => {
      return (
        <div className={styles.menu}>
          <button
            className="small"
            disabled={currentWeek == 0}
            onClick={() => {
              if (currentWeek > 0) {
                setCurrentWeek(currentWeek - 1);
              }
            }}>
            <i className="fa-solid fa-angle-left" />
          </button>
          <h2>Vecka: {getWeekNumber(refDate)}</h2>
          <button
            className="small"
            disabled={currentWeek == 2}
            onClick={() => {
              if (currentWeek < 2) {
                setCurrentWeek(currentWeek + 1);
              }
            }}>
            <i className="fa-solid fa-angle-right" />
          </button>
        </div>
      );
    };

    useEffect(() => {
      setRefDate((prevDate) => {
        return new Date(prevDate.setDate(startDay.getDate() + nrOfDays * currentWeek));
      });
    }, [currentWeek]);

    useEffect(() => {
      const selectedEvents = getEventListSpan(events, refDate, nrOfDays); // Här hämtas eventen för den valda tidsperioden
      setDayLists(eventListToDayLists(selectedEvents, nrOfDays, refDate.getDay() || 7)); // Här delas eventen upp i dagar
    }, [refDate]);

    return (
      <>
        <Menu />
        <Header dayLists={dayLists} refDate={refDate} />
        {infoBoxData && (
          <div
            className={styles.infoBoxOverlay}
            onClick={() => {
              setInfoBoxData(null);
            }}>
            <EventInfoBox
              data={infoBoxData}
              close={() => {
                setInfoBoxData(null);
              }}
            />
          </div>
        )}
        <div className={styles.grid} ref={gridRef}>
          <div className={styles.timeLine}>{timeStamps}</div>

          {
            <>
              <div className={styles.lineContainer}>{horizontalLines}</div>
              <div className={styles.daysContainer}>
                {dayLists.map((dayList, index) => {
                  return <DayBox dayList={dayList} key={index} setInfoBoxData={setInfoBoxData} />;
                })}
              </div>
            </>
          }
        </div>
      </>
    );
  };

  const Header = ({ dayLists, refDate }) => {
    const getDate = (offset) => {
      const tempDate = new Date(refDate);
      tempDate.setDate(tempDate.getDate() + offset);
      return { date: tempDate.getDate(), day: tempDate.getDay() };
    };

    const daysName = ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"];

    const headerItems = [];
    for (let i = 0; i < dayLists.length; i++) {
      const dayIdx = getDate(i).day;
      headerItems.push(
        <HeaderItem date={getDate(i).date} key={i}>
          {daysName[dayIdx]}
        </HeaderItem>
      );
    }

    return (
      <div className={styles.header}>
        <div />
        {headerItems}
        <div>
          <span className={styles.headerSpacer} />
        </div>
      </div>
    );
  };

  const HeaderItem = ({ children, date }) => {
    return (
      <div className={styles.headerItem}>
        <span className={styles.headerDay}>{children}</span>
        <span className={styles.headerDate}>{date}</span>
        <span className={styles.headerSpacer}></span>
      </div>
    );
  };

  return (
    <div
      className={styles.calendarViewer}
      style={{
        "--scale": `${scale}px`,
      }}>
      <Grid weeksList={weeksList} />
    </div>
  );
}

async function getWeek(calendar_id, date) {
  const now = new Date(date);

  const weekDay = now.getDay() == 0 ? 7 : now.getDay();

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

function eventListToDayLists(events, nrOfDays, startWeekDay = 1) {
  let days = [];
  for (let i = 0; i < nrOfDays; i++) {
    days.push([]);
  }

  // Event listan är och måste vara i ordning efter start tid/datum
  for (let event of events) {
    const date = new Date(event.start.dateTime);
    const weekDay = date.getDay() == 0 ? 7 : date.getDay();
    var idx = weekDay - startWeekDay;
    if (idx < 0) {
      // Om den valda tidsperioden överlappar två veckor
      // Lägg till en vecka så det blir positivt
      idx = idx + startWeekDay;
    }
    days[idx].push(event);
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

function getEventListSpan(eventList, startDate, endRef) {
  let endDate = null;
  if (typeof endRef === "number") {
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + endRef);
  } else {
    endDate = endRef;
  }

  let span = [];
  for (let event of eventList) {
    const eventDate = new Date(event.start.dateTime);
    if (eventDate >= startDate && eventDate <= endDate) {
      span.push(event);
    }
  }
  return span;
}

const urlify = (text) => {
  const urlRegex = /(([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.\]?[\w-]+)*\/?)/gm;
  const urls = text.match(urlRegex) || [];

  let strings = [];
  let newStrings = [, text];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    newStrings = newStrings[1].split(url);
    strings.push(newStrings[0]);
  }
  strings.push(newStrings[1]);

  return (
    <>
      {strings.map((string, idx) => {
        return (
          //React fragment för att kunna sätta en key
          <React.Fragment key={idx}>
            {idx > 0 && (
              <Link
                href={!urls[idx - 1].includes("//") ? "https://" + urls[idx - 1] : urls[idx - 1]}
                target="_blank">
                {urls[idx - 1]}
              </Link>
            )}
            {string}
          </React.Fragment>
        );
      })}
    </>
  );
};
