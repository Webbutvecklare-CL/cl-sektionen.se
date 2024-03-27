import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidhuvud_inv from "../public/media/grafik/Namn_Vit.webp";
import Sidhuvud_black from "../public/media/grafik/Sidhuvud.webp";

// Komponenter
import FeedPreview from "../components/FeedPreview";
import FeaturedPostPreview from "../components/FeaturedPostPreview";
import CalendarSubscription from "../components/calendar/CalendarSubscription";

// Gör att kalendrarna laddas in efter användaren kommit in på sidan - för att snabba upp laddningstiden
import dynamic from "next/dynamic";
import CalendarLoader from "../components/calendar/CalendarLoader";
const CalendarsWrapper = dynamic(() => import("../components/calendar/CalendarsWrapper"), {
  ssr: false,
  loading: () => <CalendarLoader />,
});

// För text rendering
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

//Firebase stuff
import { logEvent } from "firebase/analytics";

// Styles
import styles from "../styles/index.module.css";
import feedStyles from "../styles/feed-preview.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

export default function Index({ contents, featured, infoList, eventList }) {
  const [open, setOpen] = useState(false);
  const toggleOm = async () => {
    if (!open) {
      // Om vi går från stängd till öppen
      const { getAnalytics } = await import("../firebase/clientApp");
      const analytics = await getAnalytics();
      if (analytics) {
        logEvent(analytics, "view_om");
      }
    }
    setOpen(!open);
  };

  const sektionskalender_id = process.env.NEXT_PUBLIC_CL_CALENDAR;

  return (
    <div>
      <div className={styles.indexBg}>
        <div className={styles.imageContainer}>
          <Image
            src={Sidhuvud_inv}
            placeholder="blur"
            sizes="(max-width: 500px) 400px, 1000px"
            alt='"Sektionen för Civilingenjör & Lärare" skrivet med en fin font'
            className={styles.sektionsloggaVitt}
          />
        </div>
      </div>
      <div id="contentbody" className={`wideContent ${styles.indexContent}`}>
        <div className={`${styles.omContainer} ${open ? styles.open : styles.collapsed}`}>
          <section className={styles.om}>
            <section>
              <MarkdownRender mdData={contents["om-sektionen"]} />

              <Image
                src={Sidhuvud_black}
                alt="sektionslogga, sidhuvud"
                className={styles.sektionslogga}
              />
            </section>
            <section>
              <MarkdownRender mdData={contents["om-programmet"]} />
            </section>
          </section>
        </div>
        <hr className={styles.noMarginLine} />
        <div className={styles.visaOmKnappDiv}>
          <button
            type="button"
            className={`${styles.visaOmKnapp} ${open ? styles.btnOpen : ""}`}
            onClick={toggleOm}>
            Om CL <FontAwesomeIcon icon={open ? faAngleUp : faAngleDown} />
          </button>
        </div>
        <section id={styles.happenings}>
          <div className={feedStyles.small}>
            {/*Om det finns något i post listan så visas de i FeedPreview komponenten*/}
            <div>
              <h2>Senaste</h2>
              {featured && <FeaturedPostPreview post={featured} />}
              <div className={styles.feedWrapper}>
                <div className={styles.feedColumn}>
                  <h2>Information</h2>
                  {infoList.length > 0 && <FeedPreview posts={infoList} />}
                  {!infoList.length > 0 && <p>Inlägg saknas</p>}
                  <Link className={styles.sectionButton} href={"/aktuellt"}>
                    <button type="button" aria-label="Fler informationsinlägg" className="small hollow dark">
                      Fler inlägg
                    </button>
                  </Link>
                </div>
                <div className={styles.feedColumn}>
                  <h2>Event</h2>
                  {eventList.length > 0 && <FeedPreview posts={eventList} />}
                  {!eventList.length > 0 && <p>Inlägg saknas</p>}
                  <Link className={styles.sectionButton} href={"/aktuellt?info=false"}>
                    <button type="button" aria-label="Fler eventinlägg" className="small hollow dark">
                      Fler event
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr />
        <h2>Kalender</h2>
        <CalendarSubscription calendar_id={sektionskalender_id}>
          Prenumerera på <strong>Sektionskalendern</strong>:
        </CalendarSubscription>
        <section className={styles.sektionskalMånadOchBokningar}>
          <CalendarsWrapper />
        </section>
        <hr />
        <section>
          <h1>För studenter</h1>
          <div className={styles.sectionRow}>
            <section>
              <h2>Ny student</h2>
              <MarkdownRender mdData={contents["ny-student"]} />
              {/* Ta visas när mottagningen är aktuell */}
              {/* <Link className={styles.sectionButton} href={"/mottagning"}>
                <button aria-label="Öppna mottagningssidan" className="hollow dark">
                  Mottagningssidan
                </button>
              </Link> */}
            </section>
            <section>
              <h2>Hjälp vid illabehandling</h2>
              <MarkdownRender mdData={contents["hjalp-vid-illabehandling"]} />
              <Link className={styles.sectionButton} href={"/hjalp-vid-illabehandling"}>
                <button type="button" aria-label="Läs mer" className="hollow dark">
                  Läs mer
                </button>
              </Link>
            </section>
          </div>
        </section>
        <hr />
        <section>
          <h1>Näringsliv</h1>
          <div className={styles.sectionRow}>
            <section>
              <h2>För företag</h2>
              <MarkdownRender mdData={contents["for-foretag"]} />
              {/* Länka när vi faktiskt har någon */}
              {/* <Link className={styles.sectionButton} href={"/for-foretag"}>
                  <button aria-label="Läs vår produktkatalog" className="hollow dark">
                    Läs vår produktkatalog
                  </button>
                </Link> */}
            </section>
            <section>
              <h2>Samarbeten</h2>
              <MarkdownRender mdData={contents.samarbeten} />
              <Link className={styles.sectionButton} href={"/samarbeten"}>
                <button
                  type="button"
                  aria-label="Öppna sidan med mer information vad våra samarbetspartners erbjuder våra medlemmar"
                  className="hollow dark">
                  Aktiva samarbeten
                </button>
              </Link>
            </section>
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

  // Importera firestore
  const { app } = await import("../firebase/clientApp");
  const { getFirestore, collection, query, where, orderBy, limit, Timestamp, getDocs } =
    await import("firebase/firestore");
  const firestore = getFirestore(app);

  // Aktuellt
  const todayDate = new Date().toLocaleString("sv-SE").substring(0, 16);
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
  for (const doc of infoDocs) {
    const data = doc.data();
    data.id = doc.id;
    infoList.push(data);
  }

  for (const doc of eventDocs) {
    const data = doc.data();
    data.id = doc.id;
    eventList.push(data);
  }


  let featured = {};

  const newestEventDate = eventList.length ? new Date(eventList[0].publishDate.seconds * 1000) : 0;
  const newestInfoDate = infoList.length ? new Date(infoList[0].publishDate.seconds * 1000) : 0;

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
