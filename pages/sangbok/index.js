import Link from "next/link";
import { analytics } from "../../firebase/clientApp";
import { useEffect, useRef, useState } from "react";
import { readFileSync } from "fs";
import { logEvent } from "firebase/analytics";
import CustomHead from "../../components/CustomHead";
import TextHighlighter from "../../components/Highlighter";

import styles from "../../styles/sangbok.module.css";
import { solid, ellipsis, volumeXmark } from "../../styles/fontawesome.module.css";
import filterStyles from "../../styles/filter-panel.module.css";

//göm majjelåtar mellan månad 6 och 9
function HideDate(currentMonth) {
  if (currentMonth < 5 || currentMonth > 8) {
    return false;
  }
  return true;
}

export default function Sangbok({ sånger, index }) {
  const [sortedSongs, setSortedSongs] = useState(
    [...sånger].sort((a, b) => parseInt(a.sida, 10) - parseInt(b.sida, 10))
  );

  const [fulltextSearchResults, setFulltextSearchResults] = useState([]);
  const [searchFullText, setSearchFullText] = useState(false);

  const [sort, setSort] = useState("pageNr");
  const sortBy = (e) => {
    setSort(e.target.value);
  };

  useEffect(() => {
    if (sort === "category") {
      setSortedSongs([...sånger].sort((a, b) => a.kategori.localeCompare(b.kategori, "sv")));
    } else if (sort === "pageNr") {
      setSortedSongs([...sånger].sort((a, b) => parseInt(a.sida, 10) - parseInt(b.sida, 10)));
    } else {
      setSortedSongs([...sånger].sort((a, b) => a.title.localeCompare(b.title, "sv")));
    }
  }, [sort, sånger]);

  const [search, setSearch] = useState("");
  const currentMonth = new Date().getMonth();

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [fokusSearchBar, setFokusSearchBar] = useState(false);

  useEffect(() => {
    let focusSearchHandler = (e) => {
      if (!fokusSearchBar && e.target.className === "searchbar") {
        setFokusSearchBar(true);
      } else if (fokusSearchBar && e.target.className !== "searchbar") {
        setFokusSearchBar(false);
      }
    };

    document.addEventListener("mousedown", focusSearchHandler);
    return () => {
      document.removeEventListener("mousedown", focusSearchHandler);
    };
  });

  //WIP
  useEffect(() => {
    const contentindex = new Map(Object.entries(index));
    const sanitizeExpression = /[#_:.,*|/\"\'\\!?()[\]\{\}+’´']/gm;
    const wordsArray = search.replaceAll(sanitizeExpression, "").trim().split(" ");

    //console.log(wordsArray)
    var results = contentindex.has(wordsArray[0]) ? contentindex.get(wordsArray[0]).split(" ") : [];

    if (results) {
      for (var i = 1; i < wordsArray.length; i++) {
        const word = wordsArray[i];

        // Check if the key exists in the hashmap
        if (contentindex.has(word)) {
          var newRes = contentindex.get(word).split(" ");
          results = results.filter((elem) => newRes.includes(elem));
        } else {
          results = [];
          break;
        }
      }
    }
    //console.log(results)
    setFulltextSearchResults(results);
  }, [index, search, searchFullText]);

  const panelRef = useRef();
  //Stänger filterpanelen om man trycker utanför
  useEffect(() => {
    let panelCloseHandler = (e) => {
      if (panelRef.current.contains(e.target)) {
        return;
      }
      if (e.target.className === filterStyles.panel + " mobile") {
        return;
      }
      if (e.target.className === "searchbar") {
        return;
      }
      if (e.target.className === `${styles.songbookFilterButton} ${styles.active}`) {
        return;
      }
      if (e.target.className === `${solid}  ${ellipsis}`) {
        return;
      }
      setFilterPanelOpen(false);
    };

    document.addEventListener("mousedown", panelCloseHandler);
    return () => {
      document.removeEventListener("mousedown", panelCloseHandler);
    };
  });

  const SångLänk = ({ sång }) => {
    // Döljer bla majjelåtar under vår/sommar
    if (sång.hemlig && HideDate(currentMonth)) {
      return "";
    }
    return (
      <Link href={`/sangbok${sång.href}`} className={styles.songLink} referrerPolicy="hej">
        <div>
          <span className={styles.songTitle}>
            <TextHighlighter search={search} text={sång.title} />
          </span>
          <span className={styles.songPage}>&nbsp; s.{sång.sida}</span>
        </div>
        <div className={styles.songCategory}>&nbsp; {sång.kategori}</div>
      </Link>
    );
  };

  var audio;
  const playSong = () => {
    if (audio) {
      audio.pause();
      const btn = document.querySelector(".muteButton");
      if (btn) btn.remove();
    }
    audio = new Audio("/media/ljud/Rick Astley - Never Gonna Give You Up.mp3");
    audio.play();
    const muteButton = document.createElement("button");
    muteButton.addEventListener("click", (e) => {
      audio.pause();
      muteButton.remove();
    });
    muteButton.classList.add("muteButton");
    muteButton.innerHTML = `<i class="${solid} ${volumeXmark}"/>`;
    document.querySelector("div.inputfält").appendChild(muteButton);
  };

  return (
    <>
      <CustomHead
        metaTitle={`Sångbok | Sektionen för Civilingenjör och Lärare`}
        description={"Sektionens digitala sångbok."}
        url={"https://www.cl-sektionen.se/songbok"}
      />
      <div id="contentbody">
        <div className="small-header">
          <h1 id="page-title">Sångbok</h1>
          <p>
            Nedan finner du samtliga sånger från sektionens officiella songbook som trycktes inför
            sektionens 20-årsjubileum. Fysisk kopia av songbooken finns att köpa för 130 kr. Prata
            med försäljningsansvarig!
          </p>
        </div>

        <div className={styles.songbookWrapper}>
          <div className={`inputfält ${fokusSearchBar ? "active" : ""} ${filterStyles.smallPanel}`}>
            <input
              ref={panelRef}
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
                if (["never gonna give you up", "spela en låt"].includes(search.toLowerCase())) {
                  playSong();
                }
              }}
              className="searchbar"
            />
            <button
              ref={panelRef}
              className={`${filterStyles.filterOpen} ${filterPanelOpen ? filterStyles.active : ""}`}
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}>
              <i className={`${solid}  ${ellipsis}`} />
            </button>
          </div>

          <section
            ref={panelRef}
            className={`${filterStyles.smallPanel} ${filterStyles.panel} ${
              filterPanelOpen ? filterStyles.open : filterStyles.collapsed
            }`}>
            <div className={filterStyles.innerWrapper}>
              <label>
                <input
                  type="radio"
                  name="filters"
                  value="pageNr"
                  checked={sort === "pageNr"}
                  onChange={(e) => sortBy(e)}
                  className={filterStyles.filterInput}
                />
                <span className={filterStyles.filterOption}>Sortera på sidnummer</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="filters"
                  value="alphabetical"
                  checked={sort === "alphabetical"}
                  onChange={(e) => sortBy(e)}
                  className={filterStyles.filterInput}
                />
                <span className={filterStyles.filterOption}>Sortera alfabetiskt</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="filters"
                  value="category"
                  checked={sort === "category"}
                  onChange={(e) => sortBy(e)}
                  className={filterStyles.filterInput}
                />
                <span className={filterStyles.filterOption}>Sortera på kategori</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="filters"
                  checked={searchFullText}
                  onChange={() => setSearchFullText(!searchFullText)}
                  className={filterStyles.filterInput}
                />
                <span className={filterStyles.filterOption}>
                  Sök i sångtext <i>(experimentell!)</i>
                </span>
              </label>
            </div>
          </section>

          <div>
            {sortedSongs
              .filter(
                (sång) =>
                  search === "" ||
                  sång.title.toLowerCase().includes(search.toLowerCase()) ||
                  sång.altSearch?.some((title) =>
                    title.toLowerCase().includes(search.toLowerCase())
                  ) ||
                  (searchFullText &&
                    fulltextSearchResults.some((elem) => elem.includes(sång.href.slice(-1))))
              )
              .map((sång) => (
                <SångLänk key={sång.href} sång={sång} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  var sånger = JSON.parse(readFileSync(`public/content/data/sangbok-index.json`));
  var index = JSON.parse(readFileSync(`public/content/data/sangbok-content-index.json`));

  return {
    props: { sånger, index },
  };
}
