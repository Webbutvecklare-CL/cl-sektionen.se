import Image from "next/image";
import Link from "next/link";
import Sidhuvud_inv from "../public/media/grafik/sidhuvud_inv.png";
import React, { useState } from "react";
import FeedPreview from "../components/FeedPreview";
import GråttAgenda from "../components/GråttAgenda";
import FeaturedPostPreview from "../components/FeaturedPostPreview";

// För text rendering
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

//Firebase stuff
import { firestore } from "../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";

export default function Index({ contents, featured, newsList, eventList }) {
  const [open, setOpen] = useState(false);
  const toggleOm = () => {
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
            {newsList.length < 1 && <p>Inlägg saknas</p>}
            {newsList.length > 0 && (
              <div>
                <FeaturedPostPreview post={featured} />
                <div className="inlägg_wrapper">
                  <div className="event_innehåll">
                    <h2>Information</h2>
                    <FeedPreview posts={newsList} title="Annat" />
                  </div>
                  <div className="event_innehåll">
                    <h2>Event</h2>
                    <FeedPreview posts={eventList} title="Annat" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <hr />
        <h2>Kalendern och gråttbokningar</h2>
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
          <GråttAgenda className="agenda-vy"/>
          <br/>
          <iframe id="open-web-calendar månad" 
            className="open-web-calendar gråttan månad"
            style={{
              background:"url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
            }}
            src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&amp;url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2F008gpl3s787te6jhipk5729c6g%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=month"
            sandbox="allow-scripts allow-same-origin allow-top-navigation"
            height="400px" 
            width="100%"></iframe>
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
  let newsList = [];
  let eventList = [];

  // Aktuellt
  const todayDate = new Date().toLocaleString().substring(0, 16);
  const timeNow = Timestamp.fromDate(new Date(todayDate));
  const postRef = collection(firestore, "posts");

  // Skapar en query - vilka inlägg som ska hämtas
  const newsQuery = query(
    postRef,
    where("type", "==", "Nyheter"),
    where("public", "==", true),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(5)
  );
  const eventQuery = query(
    postRef,
    where("type", "==", "Event"),
    where("public", "==", true),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(5)
  );
  // Hämtar inläggen från firestore

  let newsDocs = [];
  let eventDocs = [];
  try {
    newsDocs = await getDocs(newsQuery);
  } catch (error) {
    console.error("Det gick inte att hämta nyhetsinlägg: ", error.toString());
  }
  try {
    eventDocs = await getDocs(eventQuery);
  } catch (error) {
    console.error("Det gick inte att hämta eventinlägg: ", error.toString());
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

  let featured = {}

  let newestEventDate = new Date(eventList[0].publishDate["seconds"] * 1000)
  let newestNewsDate = new Date(newsList[0].publishDate["seconds"] * 1000)

  if (newestEventDate >= newestNewsDate){
    featured = eventList[0]
    eventList = eventList.slice(1)
    newsList = newsList.slice(0, -1)
  } else {
    featured = newsList[0]
    newsList = newsList.slice(1)
    eventList = eventList.slice(0, -1)
  }

  // Contents är all text
  // newsList och eventList är listor med de senaste inläggen
  // stringify gör om listan till en sträng parse gör sedan om till objekt
  return {
    props: {
      contents: getContentData("start"),
      featured: JSON.parse(JSON.stringify(featured)),
      newsList: JSON.parse(JSON.stringify(newsList)),
      eventList: JSON.parse(JSON.stringify(eventList)),
    },
    revalidate: 60 * 60 * 12, // Som oftast var 12:e timme - utöver de som kommer in när inlägg uppdateras
  };
}
