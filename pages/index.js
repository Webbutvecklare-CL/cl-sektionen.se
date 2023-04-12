import Image from "next/image";
import Link from "next/link";
import Sidhuvud_inv from "../public/media/grafik/sidhuvud_inv.png";
import React, { useState } from "react";
import FeedPreview from "../components/FeedPreview";

// För text rendering
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

//Firebase stuff
import { firestore } from "../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";

export default function Index({ contents, newsList, eventList }) {
  const [open, setOpen] = useState(false);
  const toggleOm = (e) => {
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
        <h1>Dubbel examen, dubbel kompetens</h1>
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
        <section className="mini_aktuellt_o_kalender" id="happenings">
          <div className="event_o_aktuellt">
            <div className="mini_aktuellt">
              <div className="aktuellt_innehåll">
                <h1>Nyheter</h1>
                {/*Om det finns något i post listan så visas de i FeedPreview komponenten*/}
                {eventList.length < 1 && <p>Inlägg saknas</p>}
                {newsList && (
                  <div>
                    <FeedPreview posts={newsList} title="Annat" />
                  </div>
                )}
              </div>
            </div>
            <div className="mini_event">
              <div className="event_innehåll">
                <h1>Event</h1>
                {/*Om det finns något i post listan så visas de i FeedPreview komponenten*/}
                {eventList.length < 1 && <p>Inlägg saknas</p>}
                {eventList && (
                  <div>
                    <FeedPreview posts={eventList} title="Event" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mini_kalender kalender_tab">
            <h1 className="kal_titel">Kalender</h1>
            <iframe
              className="open-web-calendar"
              style={{
                background:
                  "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
              }}
              src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fc_5sqhb0om2kmti770g06qqknfik%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=week&amp;tabs=week&amp;tabs=month"
              sandbox="allow-scripts allow-same-origin allow-top-navigation"></iframe>
            <br />
            <iframe
              className="open-web-calendar agenda"
              style={{
                background:
                  "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
              }}
              src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=agenda&amp;controls=date&amp;tabs=none"
              sandbox="allow-scripts allow-same-origin allow-top-navigation"></iframe>
            <h2
              style={{
                marginTop: "-18rem",
                marginBottom: "16rem",
                textAlign: "center",
              }}>
              Gråttbokningar
            </h2>
          </div>
        </section>
        <hr />
        <section className="resurser">
          <div>
            <section>
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
  let newsList = [];
  let eventList = [];

  // Aktuellt
  const timeNow = Timestamp.now();
  const postRef = collection(firestore, "posts");

  // Skapar en query - vilka inlägg som ska hämtas
  const newsQuery = query(
    postRef,
    where("type", "==", "Nyheter"),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(4)
  );
  const eventQuery = query(
    postRef,
    where("type", "==", "Event"),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(4)
  );
  // Hämtar inläggen från firestore

  let newsDocs = [];
  let eventDocs = [];
  try {
    newsDocs = await getDocs(newsQuery);
    eventDocs = await getDocs(eventQuery);
  } catch (error) {
    console.error("Det gick inte att hämta inläggen: ", error);
  }

  // Plockar ut data och lägger till id i post data
  newsDocs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    newsList.push(data);
  });

  eventDocs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    eventList.push(data);
  });

  // Contents är all text
  // newsList och eventList är listor med de senaste inläggen
  // stringify gör om listan till en sträng parse gör sedan om till objekt
  return {
    props: {
      contents: getContentData("start"),
      newsList: JSON.parse(JSON.stringify(newsList)),
      eventList: JSON.parse(JSON.stringify(eventList)),
    }, // will be passed to the page component as props
  };
}
