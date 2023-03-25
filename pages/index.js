import Image from "next/image";
import Link from "next/link";
import Sidhuvud from "../public/media/grafik/Sidhuvud.png";
import Sidhuvud_inv from "../public/media/grafik/sidhuvud_inv.png";
import React, { useState, useMemo } from "react";
import FeedPreview from "../components/FeedPreview";

// För text rendering
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

//Firebase stuff
import { firestore } from "../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";

export default function Index({ contents }) {
  // Aktuellt feed
  const timeNow = useMemo(() => Timestamp.now(), []);
  const postRef = collection(firestore, "posts");
  const annatQuery = query(
    postRef,
    where("tags", "array-contains-any", ["Annat", "Information", "Aktuellt"]),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(4)
  );
  const eventQuery = query(
    postRef,
    where("tags", "array-contains", "Event"),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(4)
  );
  const [annatFeed, annatLoading, annatError] = useCollectionOnce(annatQuery);
  const [eventFeed, eventLoading, eventError] = useCollectionOnce(eventQuery);

  const [open, setOpen] = useState(false);
  const toggleOm = (e) => {
    //Scrollar upp igen så man kommer till toppen
    if (open) {
      document.querySelectorAll("h2")[0].scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      document
        .querySelector(".om-container")
        .scrollIntoView({ block: "start", behavior: "smooth" });
    }
    setOpen(!open);
  };

  return (
    <div>
      <div className="index_bg">
        <Image
          src={Sidhuvud_inv}
          alt="sektionslogga, sidhuvud vitt"
          className="sektionslogga_vitt"
        />
      </div>
      <div className="bg_bottom_cover"></div>
      <div id="contentbody" className="index_content">
        <header>
            <h1>Sektionen för Civilingenjör &amp; Lärare</h1>
            <h2>Dubbel examen, dubbel kompetens</h2>
        </header>

        <div className={`om-container ${open ? 'open' : 'collapsed'}`}>
            <hr />
            <section className="om">
                <section>
                    <h2>Om sektionen</h2>
                    <p>
                        <b>Sektionen</b> för Civilingenjör & Lärare (CL) är
                        en ideell studentsektion under Tekniska
                        Högskolans Studentkår och företräder studenter på KTH inom
                        programmet Civilingenjör och lärare samt två utbildningar med kompletterande pedagogisk utbildning för den som redan har ämneskunskaper.
                    </p>
                    <p>
                        Sektionens syfte är att värna om alla
                        programstuderande under dess studietid. Detta
                        strävar vi efter genom att bedriva
                        utbildningsbevakning, näringslivsverksamhet och
                        studiesocial verksamhet. Ansvaret för sektionens
                        arbete är uppdelad mellan sektionsstyrelsen
                        &quot;
                        <span
                            style={{
                                color: 'var(--clr5)',
                                fontWeight: '600',
                            }}
                        >
                            C
                        </span>
                        tyre
                        <span
                            style={{
                                color: 'var(--clr5)',
                                fontWeight: '600',
                            }}
                        >
                            L
                        </span>
                        sen&quot; samt ett antal nämnder och övriga
                        förtroendevalda. Läs mer om sektionens nämnder
                        och förtroendevalda på&nbsp;
                        <Link href="/fortroendevalda">Denna sida</Link>.
                    </p>
                    <Image
                        src={Sidhuvud}
                        alt="sektionslogga, sidhuvud"
                        className="sektionslogga"
                    />
                </section>
                <section>
                    <h2>Om programmet</h2>
                    <p>
                        <b>Programmet</b> Civilingenjör och lärare 300
                        hp (CLGYM) är ett program som
                        sedan 2002 erbjuds på KTH. Utbildningen leder
                        till dubbla yrkesexamina: en fullständig
                        civilingenjörsexamen samt en komplett
                        lärarutbildning med behörighet för undervisning
                        i gymnasieskolan och högstadiet.
                    </p>
                    <p>
                        Det finns fyra inriktningar på
                        programmet. De olika inriktningarna samläser med
                        motsvarande civilingenjörsutbildning och ger
                        behörighet för undervisning i olika
                        gymansiekurser. De fyra inriktningarna är:
                    </p>
                    <ul style={{ marginTop: '-1rem' }}>
                        <li>
                            Matematik och fysik, <strong>(MAFY)</strong>
                        </li>
                        <li>
                            Matematik och kemi, <strong>(MAKE)</strong>
                        </li>
                        <li>
                            Matematik och teknik med specialisering mot
                            energi och miljö, <strong>(TEMI)</strong>
                        </li>
                        <li>
                            Matematik och teknik med specialisering mot
                            datateknik, <strong>(TEDA)</strong>
                        </li>
                    </ul>
                </section>
            </section>
        </div>
        <hr />
        <div className="visa_om_knapp_div">
            <button className="visa_om_knapp" onClick={toggleOm}>
                Om CL{' '}
                {open ? (
                    <i className="fa-solid fa-angle-up"></i>
                ) : (
                    <i className="fa-solid fa-angle-down"></i>
                )}
            </button>
        </div>
        <section className="mini_aktuellt_o_kalender">
                <div className="event_o_aktuellt">
                    <div className="mini_aktuellt">
                        <div className="aktuellt_innehåll">
                            <h1>Aktuellt</h1>
                            <div>
                                {/*Om det finns något i post listan så visas de i PostFeed komponenten
                                        Annars visas ett fel meddelande*/}
                                {annatError && (
                                    <strong>
                                        Error: {JSON.stringify(annatError)}
                                    </strong>
                                )}
                                {annatLoading && (
                                    <span>Collection: Loading...</span>
                                )}
                            </div>
                            {annatFeed && (
                                <div>
                                    <FeedPreview
                                        docs={annatFeed.docs}
                                        title="Annat"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mini_event">
                        <div className="event_innehåll">
                            <h1>Event</h1>
                            <div>
                                {/*Om det finns något i post listan så visas de i PostFeed komponenten
                                    Annars visas ett fel meddelande*/}
                                {eventError && (
                                    <strong>
                                        Error: {JSON.stringify(eventError)}
                                    </strong>
                                )}
                                {eventLoading && (
                                    <span>Collection: Loading...</span>
                                )}
                            </div>
                            {eventFeed && (
                                <div>
                                    <FeedPreview
                                        docs={eventFeed.docs}
                                        title="Event"
                                    />
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
          sandbox="allow-scripts allow-same-origin allow-top-navigation"
        ></iframe>
        <br />
        <iframe
          className="open-web-calendar agenda"
          style={{
            background:
              "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
          }}
          src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=agenda&amp;controls=date&amp;tabs=none"
          sandbox="allow-scripts allow-same-origin allow-top-navigation"
        >
        </iframe>
        <h2
          style={{
            marginTop: "-18rem",
            marginBottom: "16rem",
            textAlign: "center",
          }}
        >
          Gråttbokningar
        </h2>
      </div>
        </section>
        <hr />
        <section className="resurser">
          <div>
            <h1>Hjälp vid illabehandling</h1>
            <MarkdownRender mdData={contents["hjalp-vid-illabehandling"]} />
            <Link className="illabehandling_knapp" href={"/hjalp-vid-illabehandling"}>
              <button>Mer information</button>
            </Link>
          </div>
          <div>
            <h1>Ny student</h1>
            <MarkdownRender mdData={contents["ny-student"]} />
          </div>
        </section>
        <hr />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let contents = getContentData("start");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}
