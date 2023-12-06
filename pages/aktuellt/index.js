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

import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

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
import NotificationBell from "../../components/NotificationBell";

export default function Aktuellt({ postList }) {
  const router = useRouter();
  const { replace, query } = router;

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
  const [startDate, setStartDate] = useState("");
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

  // Filter via länkar
  // Uppdatera objektet som sparas i query params
  const queryParams = useMemo(() => {
    let newQueryParams = {};

    // Skapar en sträng med alla tags
    let tags = "";
    for (let tag in filterTags) {
      if (filterTags[tag]) {
        tags += tag + "-";
      }
    }

    // Tar bort sista minustecknet
    tags = tags.slice(0, -1);

    // Tar bara med de som inte är sitt standard-värde
    if (!type.information) newQueryParams.info = "false";
    if (!type.event) newQueryParams.event = "false";
    if (!sortNewestFirst) newQueryParams.newest = "false";

    // Dessa är från början false eller null
    const filters = {
      s: search,
      tags: tags,
      pub: publisher,
      start: startDate,
    };

    for (let key in filters) {
      const value = filters[key];
      if (value) {
        newQueryParams[key] = value;
      }
    }

    if (endDate && endDate != new Date().toDateString()) {
      newQueryParams.end = endDate;
    }

    return newQueryParams;
  }, [search, type, filterTags, sortNewestFirst, publisher, startDate, endDate]);

  // Sätter filtret vid inladdning från query params
  useEffect(() => {
    // Kör bara om det faktiskt finns en query
    if (!router.isReady) {
      return;
    }

    // Tar bara med de som inte är sitt standard-värde
    if (query.info === "false") setType({ ...type, information: false });
    if (query.event === "false") setType({ ...type, event: false });
    if (query.newest === "false") {
      setSortNewestFirst(false);
      postList.reverse();
    }

    const queryTags = query.tags?.split("-") || [];
    let tags = {};
    for (let tag of queryTags) {
      tags[tag] = true;
    }

    setFilterTags((filterTags) => ({ ...filterTags, ...tags }));

    if (query.s) setSearch(query.s);
    if (query.pub) setPublisher(query.pub);
    if (query.start) setStartDate(query.start);
    if (query.end) setEndDate(query.end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]); // Is ready för att den inte ska uppdateras när filtret uppdateras

  // Uppdaterar länken när filtret ändras
  useEffect(() => {
    // Hindrar att den ändrar query innan query laddats in
    if (!router.isReady) {
      return;
    }

    // Uppdatera bara om det finns något att uppdatera - hindrar att den rensar vid inladdning
    if (Object.keys(queryParams).length > 0 || Object.keys(query).length > 0) {
      // Körs två gånger av någon anledning men det funkar - oftast när det är typ som ändras
      replace({ query: queryParams }, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

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
          name="committeePicker"
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
    <div id="contentbody" className="wideContent">
      <div className={styles.header}>
        <h1>Sök bland alla Nyheter</h1>
        <NotificationBell />
      </div>
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
                name="searchbar"
                className="searchbar"
                placeholder="Sök efter inlägg..."
                value={search}
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
                goBack={true}
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
