import { firestore, analytics } from "../../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { convertDate } from "../../utils/convertDate";

import { useState, useRef, useEffect } from "react";

import FeedPreview from "../../components/FeedPreview";

//Ändra dessa för att lägga till och ta bort tags
import { INFOTAGS, EVENTSTAGS, COMMONTAGS } from "../../constants/tags";

import styles from "../../styles/aktuellt.module.css";
import {
  solid,
  ellipsis,
  filter,
  arrowDownWideShort,
  pencil,
  tags,
  calendarDays,
} from "../../styles/fontawesome.module.css";
import feed from "../../styles/feed-preview.module.css";

const PUBLISHERS = [
  "CtyreLsen",
  "Studienämnden",
  "Näringslivsnämnden",
  "Mottagningsnämnden",
  "JML-nämnden",
  "Aktivitetsnämnden",
  "Lokalnämnden",
  "CLubWästeriet",
  "Valberedningen",
  "Revisor",
  "Fanborg",
  "Kårfullmäktige",
  "Talman",
  "Försäljningsansvarig",
  "Idrottsansvarig",
  "CLek",
  "Dubbelspexet",
  "CLak",
];

export default function Aktuellt({ postList }) {
  const [currentpage, setcurrentPage] = useState(1);
  const itemsperpage = 6;

  const [filterPanelOpen, setfilterPanelOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [type, setType] = useState({
    information: true,
    event: true,
  });

  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const toggleSort = () => {
    setSortNewestFirst(!sortNewestFirst);
    postList.reverse();
  };

  const [filterTags, setFilterTags] = useState({});
  const [publisher, setPublisher] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date().toDateString());

  // tar bort filter kategori of den redan finns, lägger annars till den
  const handleTagClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    let tag = e.target.innerHTML;
    let selected = e.target.classList.contains("selected");

    // Kopiera förra statet och skriver över värdet på den valda tagen
    setFilterTags((filterTags) => ({ ...filterTags, ...{ [tag]: !selected } }));
  };

  const handleSetType = (e, tag) => {
    let selected = e.target.classList.contains("selected");

    setType((t) => ({ ...t, ...{ [tag]: !selected } }));
  };

  //Hanterar tags när man filtrerar bort antingen Event eller Information
  useEffect(() => {
    const infoTags = {};
    INFOTAGS.forEach((tag) => {
      infoTags[tag] = !!filterTags[tag];
    });

    const eventTags = {};
    EVENTSTAGS.forEach((tag) => {
      eventTags[tag] = !!filterTags[tag];
    });

    const commonTags = {};
    COMMONTAGS.forEach((tag) => {
      commonTags[tag] = !!filterTags[tag];
    });

    if (type["information"] && type["event"]) {
      setFilterTags({ ...commonTags, ...infoTags, ...eventTags });
    } else if (type["information"]) {
      setFilterTags({ ...commonTags, ...infoTags });
    } else if (type["event"]) {
      setFilterTags({ ...commonTags, ...eventTags });
    } else {
      setFilterTags({});
    }
    // Lägg inte till filterTags som dependency
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const panelref = useRef();
  //Stänger filterpanelen om man trycker utanför
  useEffect(() => {
    let panelCloseHandler = (e) => {
      if (panelref.current.contains(e.target)) {
        return;
      }
      if (e.target.className === "filterPanel mobile") {
        return;
      }
      if (e.target.className === "searchbar") {
        return;
      }
      if (e.target.className === "filter-knapp active") {
        return;
      }
      if (e.target.className === `${solid}  ${ellipsis}`) {
        return;
      }
      setfilterPanelOpen(false);
    };

    document.addEventListener("mousedown", panelCloseHandler);
    return () => {
      document.removeEventListener("mousedown", panelCloseHandler);
    };
  });

  //outline runt sökfältet om man klickar innuti, detta för att firefox inte stödjer css 'has()' selector
  const [fokusSearchBar, setfokusSearchBar] = useState(false);
  useEffect(() => {
    let focusSearchHandler = (e) => {
      if (!fokusSearchBar && e.target.className === "searchbar") {
        setfokusSearchBar(true);
      } else if (fokusSearchBar && e.target.className !== "searchbar") {
        setfokusSearchBar(false);
      }
    };

    document.addEventListener("mousedown", focusSearchHandler);
    return () => {
      document.removeEventListener("mousedown", focusSearchHandler);
    };
  });

  //HTML för filterpaneler
  const TypPanel = () => {
    return (
      <div>
        <h3>
          <i className={`${solid} ${filter}`} /> Inläggstyp
        </h3>
        <button
          className={`${type["information"] ? "selected" : ""}`}
          onClick={(e) => {
            handleSetType(e, "information");
          }}>
          Information
        </button>
        <button
          className={`${type["event"] ? "selected" : ""}`}
          onClick={(e) => {
            handleSetType(e, "event");
          }}>
          Event
        </button>
      </div>
    );
  };
  const SortPanel = () => {
    return (
      <div>
        <h3>
          <i className={`${solid} ${arrowDownWideShort}`} /> Sortera
        </h3>
        <button className={sortNewestFirst ? "selected" : ""} onClick={() => toggleSort()}>
          Nyast först
        </button>
      </div>
    );
  };

  const CommitteesPanel = () => {
    return (
      <div>
        <h3>
          <i className={`${solid} ${pencil}`} /> Publicerad av
        </h3>
        <select
          className="Committeepicker"
          value={publisher}
          onChange={(e) => {
            setPublisher(e.target.value);
          }}>
          <option value={""}>Alla</option>
          {PUBLISHERS.map((publisher) => {
            return (
              <option key={publisher} value={publisher}>
                {publisher}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const TagPanel = () => {
    return (
      <div>
        <h3>
          <i className={`${solid} ${tags}`} /> Kategorier
        </h3>
        <div className="tag-container">
          <div className="tag-selector">
            {Object.keys(filterTags).map((tag, index) => {
              return (
                <button
                  className={`tag ${filterTags[tag] ? "selected" : ""}`}
                  name={tag}
                  key={index}
                  onClick={handleTagClick}>
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const DatumPanel = () => {
    return (
      <div className="publiceringsdatum-wrapper">
        <h3>
          <i className={`${solid} ${calendarDays}`} /> Publiceringsdatum
        </h3>
        <strong>Från&nbsp;</strong>
        <input
          type="date"
          className="datepicker"
          required
          value={convertDate(new Date(Date.parse(startDate)))}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          max={endDate}
        />
        <br />
        <br />
        <strong>Till &nbsp;&nbsp;</strong>
        <input
          type="date"
          className="datepicker"
          required
          value={convertDate(new Date(Date.parse(endDate)))}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </div>
    );
  };

  // Någon useEffect kanske om användaren laddar in fler inlägg
  // eller vill söka som bara lägger till de nya i newsList/eventList
  return (
    <div id="contentbody">
      <h1>Sök bland alla Nyheter</h1>
      <div className="aktuellt-wrapper">
        {/*filterpanel för widescreen*/}
        <section className="filterPanel wide">
          <h2>Filtrera inlägg</h2>
          <TypPanel />
          <SortPanel />
          <TagPanel />
          <CommitteesPanel />
          <DatumPanel />
        </section>

        <div className="sök-och-content-wrapper">
          <div className={`inputfält ${fokusSearchBar ? "active" : ""}`}>
            <input
              ref={panelref}
              type="text"
              placeholder="Sök efter inlägg..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onBlur={() => {
                // När användaren lämnar sökrutan
                if (analytics) {
                  logEvent(analytics, "search", { search_term: search });
                }
              }}
              className="searchbar"
            />
            <button
              ref={panelref}
              className={`filter-knapp ${filterPanelOpen ? "active" : ""}`}
              onClick={() => setfilterPanelOpen(!filterPanelOpen)}>
              <i className={`${solid}  ${ellipsis}`} />
            </button>
          </div>

          {/*filterpanel för mobile*/}
          <section
            ref={panelref}
            className={`filterPanel mobile ${filterPanelOpen ? "open" : "collapsed"}`}>
            <div className="typ_o_sort_wrapper">
              <TypPanel />
              <SortPanel />
            </div>
            <TagPanel />
            <div className="date_and_committee_wrapper">
              <DatumPanel />
              <CommitteesPanel />
            </div>
          </section>

          <section className="posts">
            <div className={`aktuelltsidan-contentwrapper ${feed.long}`}>
              <FeedPreview
                posts={postList
                  .filter((post) => {
                    return (
                      (publisher === "" || post.committee === publisher) &&
                      (search === "" || post.title.toLowerCase().includes(search.toLowerCase())) &&
                      type[post.type]
                    );
                  })
                  .filter((post) => {
                    //Om alla filters är avstända eller påslagna, returnera allt
                    if (Object.keys(filterTags).every((k) => filterTags[k])) {
                      return true;
                    }
                    if (Object.keys(filterTags).every((k) => !filterTags[k])) {
                      return true;
                    }
                    return post.tags.some((tag) => filterTags[tag]) ? true : false;
                  })
                  .filter((post) => {
                    let res = true;
                    const publishDate = new Date(post.publishDate.seconds * 1000);

                    if (endDate && publishDate > endDate) {
                      res = false;
                    }
                    if (startDate && publishDate < startDate) {
                      res = false;
                    }
                    return res;
                  })
                  .slice(0, currentpage * itemsperpage)}
              />
            </div>
            <button
              className={`ladda-fler ${
                currentpage * itemsperpage < postList.length ? "ok" : "nope"
              }`}
              onClick={
                currentpage * itemsperpage < postList.length
                  ? () => setcurrentPage(currentpage + 1)
                  : () => {}
              }>
              {currentpage * itemsperpage < postList.length
                ? "Ladda fler inlägg"
                : "Inga fler inlägg att hämta"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let postList = [];

  // Aktuellt
  const postRef = collection(firestore, "posts");

  // Skapar en query - vilka inlägg som ska hämtas
  const postQuery = query(
    postRef,
    where("visibility", "in", ["public", "hidden"]),
    orderBy("publishDate", "desc"),
    limit(60)
  );

  // Hämtar inläggen från firestore
  let postDocs = [];
  try {
    postDocs = await getDocs(postQuery);
  } catch (error) {
    console.error("Det gick inte att ladda inläggen: ", error.toString());
  }

  // Plockar ut data och lägger till id i post data
  postDocs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    postList.push(data);
  });

  // Postlist är listan med de senaste inläggen
  // stringify gör om listan till en sträng parse gör sedan om till objekt
  return {
    props: {
      postList: JSON.parse(JSON.stringify(postList)),
    },
    revalidate: 60 * 60 * 12, // Som oftast var 12:e timme - utöver de som kommer in när inlägg uppdateras
  };
}
