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
              <h2>Nyheter</h2>
                {/*Om det finns något i post listan så visas de i FeedPreview komponenten*/}
                {newsList.length < 1 && <p>Inlägg saknas</p>}
                {newsList && (
                  <div>
                    <FeaturedPostPreview post={newsList[0]}/>
                    <br/>
                    <FeedPreview posts={newsList.slice(1)} title="Annat"/>
                  </div>
                )}
            </div>
            <hr/>
            <div className="event_innehåll">
              <h2>Event (WIP)</h2>
              {/*Om det finns något i post listan så visas de i FeedPreview komponenten*/}
              {eventList.length < 1 && <p>Inlägg saknas</p>}
              {eventList && (
                <div className="event">
                    <div className="event_och_gråttan">
                        <FeedPreview posts={eventList} title="Annat"/>
                        <GråttAgenda/>
                    </div>
                </div>
              )}
            </div>
        </section>
        <hr />
        <section className="resurser">
          <div>
            <section>
              <br/>
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
            <br/>
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
    limit(5)
  );
  const eventQuery = query(
    postRef,
    where("type", "==", "Event"),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(4)
  );
  
  // Hämtar inläggen från firestore
  const newsDocs = await getDocs(newsQuery);
  const eventDocs = await getDocs(eventQuery);

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
