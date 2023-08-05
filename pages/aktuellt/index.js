import { app } from "../../firebase/clientApp";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { logEvent } from "firebase/analytics";
const firestore = getFirestore(app);

import { convertDate } from "../../utils/convertDate";

import { useState, useRef, useEffect } from "react";

import FeedPreview from "../../components/FeedPreview";

//Ändra dessa för att lägga till och ta bort tags
import { INFOTAGS, EVENTSTAGS, COMMONTAGS } from "../../constants/tags";
import { all_committees } from "../../constants/committees-data";

import styles from "../../styles/aktuellt.module.css";
import feed from "../../styles/feed-preview.module.css";
import filterStyles from "../../styles/filter-panel.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faFilter,
  faArrowDownWideShort,
  faPen,
  faTags,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

export default function Aktuellt({ postList }) {
  const [currentpage, setcurrentPage] = useState(1);
  const itemsperpage = 6;

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

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
    let selected = e.target.classList.contains(filterStyles.selected);

    // Kopiera förra statet och skriver över värdet på den valda tagen
    setFilterTags((filterTags) => ({ ...filterTags, ...{ [tag]: !selected } }));
  };

  const handleSetType = (e, tag) => {
    let selected = e.target.classList.contains(filterStyles.selected);

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

  const panelRef = useRef();
  //Stänger filterpanelen om man trycker utanför
  useEffect(() => {
    let panelCloseHandler = (e) => {
      const clickOnPanel = e.composedPath().includes(panelRef.current);
      if (!clickOnPanel) {
        setFilterPanelOpen(false);
      }
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
          <FontAwesomeIcon icon={faFilter} /> Inläggstyp
        </h3>
        <div className={filterStyles.buttonMenu}>
          <button
            className={`${type["information"] ? filterStyles.selected : ""}`}
            onClick={(e) => {
              handleSetType(e, "information");
            }}>
            Information
          </button>
          <button
            className={`${type["event"] ? filterStyles.selected : ""}`}
            onClick={(e) => {
              handleSetType(e, "event");
            }}>
            Event
          </button>
        </div>
      </div>
    );
  };

  const SortPanel = () => {
    return (
      <div>
        <h3>
          <FontAwesomeIcon icon={faArrowDownWideShort} /> Sortera
        </h3>
        <div className={filterStyles.buttonMenu}>
          <button
            className={sortNewestFirst ? filterStyles.selected : ""}
            onClick={() => toggleSort()}>
            Nyast först
          </button>
        </div>
      </div>
    );
  };

  const CommitteesPanel = () => {
    return (
      <div>
        <h3>
          <FontAwesomeIcon icon={faPen} /> Publicerad av
        </h3>
        <select
          className={filterStyles.committeePicker}
          value={publisher}
          onChange={(e) => {
            setPublisher(e.target.value);
          }}>
          <option value={""}>Alla</option>
          {all_committees.map((committee) => {
            return (
              <option key={committee.id} value={committee.id}>
                {committee.name}
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
          <FontAwesomeIcon icon={faTags} /> Kategorier
        </h3>
        <div className={filterStyles.buttonMenu}>
          {Object.keys(filterTags).map((tag, index) => {
            return (
              <button
                className={`tag ${filterTags[tag] ? filterStyles.selected : ""}`}
                name={tag}
                key={index}
                onClick={handleTagClick}>
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const DatumPanel = () => {
    return (
      <div className={filterStyles.publishDateWrapper}>
        <h3>
          <FontAwesomeIcon icon={faCalendarDays} /> Publiceringsdatum
        </h3>
        <strong>Från&nbsp;</strong>
        <input
          type="date"
          className={filterStyles.datePicker}
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
          className={filterStyles.datePicker}
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
      <div className={styles.aktuelltWrapper}>
        {/*filterpanel för widescreen*/}
        <section className={`${filterStyles.panel} ${filterStyles.wide}`}>
          <h2>Filtrera inlägg</h2>
          <TypPanel />
          <SortPanel />
          <TagPanel />
          <CommitteesPanel />
          <DatumPanel />
        </section>

        <div>
          <div className={`${filterStyles.panelWrapper} ${filterStyles.smallPanel}`} ref={panelRef}>
            <div className={`inputfält ${fokusSearchBar ? "active" : ""}`}>
              <input
                type="text"
                className="searchbar"
                placeholder="Sök efter inlägg..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onBlur={async () => {
                  // När användaren lämnar sökrutan
                  const { getAnalytics } = await import("../../firebase/clientApp");
                  const analytics = await getAnalytics();
                  if (analytics) {
                    logEvent(analytics, "search", { search_term: search });
                  }
                }}
              />
              <button
                className={`${filterStyles.filterOpen} ${
                  filterPanelOpen ? filterStyles.active : ""
                }`}
                onClick={() => {
                  setFilterPanelOpen(!filterPanelOpen);
                }}>
                <FontAwesomeIcon icon={faEllipsis} />
              </button>
            </div>

            <section
              className={` ${filterStyles.panel} ${
                filterPanelOpen ? filterStyles.open : filterStyles.collapsed
              }`}>
              <div className={filterStyles.subPanels}>
                <div>
                  <TypPanel />
                  <SortPanel />
                </div>
                <div>
                  <TagPanel />
                </div>
                <div>
                  <DatumPanel />
                  <CommitteesPanel />
                </div>
              </div>
            </section>
          </div>

          {/* Alla inlägg */}
          <section className={styles.posts}>
            <div className={feed.long}>
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
              className={`${styles.loadMore} ${
                currentpage * itemsperpage >= postList.length && styles.nope
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
