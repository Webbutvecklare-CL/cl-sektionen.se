import Image from "next/image";
import Link from "next/link";
import Sidhuvud_inv from "../public/media/grafik/Namn_Vit.png";
import React, { useEffect, useState } from "react";
import FeedPreview from "../components/FeedPreview";
import GråttAgenda from "../components/GråttAgenda";
import GråttKalender from "../components/GråttKalender";
import FeaturedPostPreview from "../components/FeaturedPostPreview";

// För text rendering
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

//Firebase stuff
import { firestore, analytics } from "../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

export default function Index({ contents, featured, infoList, eventList }) {
  const [open, setOpen] = useState(false);
  const toggleOm = () => {
    if (!open) {
      // Om vi går från stängd till öppen
      logEvent(analytics, "view_om");
      console.log("hej");
    }
    setOpen(!open);
  };

  return (
    <div>
      <div className="index-bg">
        <div className="image-container">
          <Image
            src={Sidhuvud_inv}
            alt="sektionslogga, sidhuvud vitt"
            className="sektionslogga-vitt"
          />
        </div>
      </div>
      <div className="bg_bottom_cover"></div>
      <div id="contentbody" className="index_content">
        <div className={`om-container ${open ? "open" : "collapsed"}`}>
          <section className="om">
            <section>
              <MarkdownRender mdData={contents["om-sektionen"]} />
            </section>
            <section>
              <MarkdownRender mdData={contents["om-programmet"]} />
            </section>
          </section>
          <hr />
        </div>
        <div className="visa_om_knapp_div">
          <button className={`visa_om_knapp ${open ? "btn-open" : ""}`} onClick={toggleOm}>
            Om CL{" "}
            {open ? (
              <i className="fa-solid fa-angle-up"></i>
            ) : (
              <i className="fa-solid fa-angle-down"></i>
            )}
          </button>
        </div>
        <section id="happenings">
          <div className="aktuellt_innehåll">
            {/*Om det finns något i post listan så visas de i FeedPreview komponenten*/}
            <div>
              <h2>Senaste</h2>
              {featured && <FeaturedPostPreview post={featured} />}
              <div className="inlägg_wrapper">
                <div className="event_innehåll">
                  <h2>Information</h2>
                  {infoList.length > 0 && <FeedPreview posts={infoList} />}
                  {!infoList.length > 0 && <p>Inlägg saknas</p>}
                </div>
                <div className="event_innehåll">
                  <h2>Event</h2>
                  {eventList.length > 0 && <FeedPreview posts={eventList} />}
                  {!eventList.length > 0 && <p>Inlägg saknas</p>}
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr />
        <h2>Kalender</h2>
        <p>
          <b>Psst!!</b> Du kan exportera sektionens kalendrar för att komma åt dem enklare.
          <br />
          <a href="https://calendar.google.com/calendar/embed?src=c_5sqhb0om2kmti770g06qqknfik%40group.calendar.google.com&ctz=Europe%2FBerlin">
            Tryck här <i className="fa-solid fa-arrow-up-right-from-square" />
          </a>
          &nbsp;för att exportera <strong>Sektionskalendern</strong>.<br />
          <a href="https://calendar.google.com/calendar/u/0/embed?height=700&wkst=2&bgcolor=%23616161&ctz=Europe/Stockholm&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=MONTH&src=MDA4Z3BsM3M3ODd0ZTZqaGlwazU3MjljNmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=a29uc3VtY2x3QGdtYWlsLmNvbQ&color=%237CB342&color=%23AD1457&pli=1">
            Tryck här <i className="fa-solid fa-arrow-up-right-from-square" />
          </a>
          &nbsp;för att exportera <strong>Gråttkalendern</strong>.
        </p>
        <section className="sektionskal_månad_och_bokningar">
          <iframe
            className="open-web-calendar månad"
            style={{
              background:
                "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
            }}
            src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fc_5sqhb0om2kmti770g06qqknfik%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=month"
            sandbox="allow-scripts allow-same-origin allow-top-navigation"
            height="400px"
            width="100%"></iframe>
          <GråttAgenda className="agenda-vy" />
          <br />
          <GråttKalender />
        </section>
        <hr />
        <section className="resurser">
          <div>
            <section>
              <br />
              <h1>Hjälp vid illabehandling</h1>
              <MarkdownRender mdData={contents["hjalp-vid-illabehandling"]} />
              <Link className="section-button" href={"/hjalp-vid-illabehandling"}>
                <button>Mer information</button>
              </Link>
            </section>
          </div>
          <div>
            <section>
              <h1>Ny student</h1>
              <MarkdownRender mdData={contents["ny-student"]} />
            </section>
          </div>
          <div>
            <br />
            <h1>Näringsliv</h1>
            <div className="start-naringsliv">
              <section>
                <MarkdownRender mdData={contents["for-foretag"]} />
                <Link className="section-button" href={"/for-foretag"}>
                  <button>Mer information och produktkatalog</button>
                </Link>
              </section>
              <section>
                <MarkdownRender mdData={contents["samarbeten"]} />
                <Link className="section-button" href={"/samarbeten"}>
                  <button>Läs om våra samarbeten</button>
                </Link>
              </section>
            </div>
          </div>
        </section>
        <hr />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let infoList = [];
  let eventList = [];

  // Aktuellt
  const todayDate = new Date().toLocaleString().substring(0, 16);
  const timeNow = Timestamp.fromDate(new Date(todayDate));
  const postRef = collection(firestore, "posts");

  // Skapar en query - vilka inlägg som ska hämtas
  const infoQuery = query(
    postRef,
    where("type", "==", "information"),
    where("visibility", "==", "public"),
    orderBy("publishDate", "desc"),
    limit(5)
  );
  const eventQuery = query(
    postRef,
    where("type", "==", "event"),
    where("visibility", "==", "public"),
    orderBy("publishDate", "desc"),
    limit(5)
  );
  // Hämtar inläggen från firestore

  let infoDocs = [];
  let eventDocs = [];
  try {
    infoDocs = await getDocs(infoQuery);
  } catch (error) {
    console.error("Det gick inte att hämta nyhetsinlägg: ", error.toString());
  }
  try {
    eventDocs = await getDocs(eventQuery);
  } catch (error) {
    console.error("Det gick inte att hämta eventinlägg: ", error.toString());
  }
  // Plockar ut data och lägger till id i post data
  infoDocs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    infoList.push(data);
  });

  eventDocs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    eventList.push(data);
  });

  let featured = {};

  let newestEventDate = eventList.length ? new Date(eventList[0].publishDate["seconds"] * 1000) : 0;
  let newestInfoDate = infoList.length ? new Date(infoList[0].publishDate["seconds"] * 1000) : 0;

  if (newestEventDate >= newestInfoDate) {
    featured = eventList[0];
    eventList = eventList.slice(1);
    infoList = infoList.slice(0, -1);
  } else {
    featured = infoList[0];
    infoList = infoList.slice(1);
    eventList = eventList.slice(0, -1);
  }

  // Contents är all text
  // infoList och eventList är listor med de senaste inläggen
  // stringify gör om listan till en sträng parse gör sedan om till objekt
  return {
    props: {
      contents: getContentData("start"),
      featured: JSON.parse(JSON.stringify(featured)),
      infoList: JSON.parse(JSON.stringify(infoList)),
      eventList: JSON.parse(JSON.stringify(eventList)),
    },
    revalidate: 60 * 60 * 12, // Som oftast var 12:e timme - utöver de som kommer in när inlägg uppdateras
  };
}
