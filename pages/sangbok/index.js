import Link from "next/link";
import { analytics } from "../../firebase/clientApp";
import { use, useEffect, useRef, useState } from "react";
import { readFileSync } from "fs";
import { logEvent } from "firebase/analytics";

//göm majjelåtar mellan månad 6 och 9
function HideDate(currentMonth) {
  if (currentMonth < 6 || currentMonth > 9) {
    return false;
  }
  return true;
}

function Sangbok({ sånger }) {
  const [sortedSongs, setSortedSongs] = useState(
    [...sånger].sort((a, b) => parseInt(a.sida, 10) - parseInt(b.sida, 10))
  );
  const [sort, setSort] = useState("pageNr");
  const sortBy = (e) => {
    setSort(e.target.value);
  };

  useEffect(() => {
    if (sort === "category") {
      setSortedSongs([...sånger].sort((a, b) => a.kategori.localeCompare(b.kategori)));
    } else if (sort === "pageNr") {
      setSortedSongs([...sånger].sort((a, b) => parseInt(a.sida, 10) - parseInt(b.sida, 10)));
    } else {
      setSortedSongs([...sånger].sort((a, b) => a.title.localeCompare(b.title)));
    }
  }, [sort]);

  const [search, setSearch] = useState("");
  const currentMonth = new Date().getMonth();

  const [filterPanelOpen, setfilterPanelOpen] = useState(false);
  const [fokusSearchBar, setfokusSearchBar] = useState(false);

  useEffect(() => {
    let focusSearchHandler = (e) => {
      if (!fokusSearchBar && e.target.className === "searchbar aktuellt") {
        setfokusSearchBar(true);
      } else if (fokusSearchBar && e.target.className !== "searchbar aktuellt") {
        setfokusSearchBar(false);
      }
    };

    document.addEventListener("mousedown", focusSearchHandler);
    return () => {
      document.removeEventListener("mousedown", focusSearchHandler);
    };
  });

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
      if (e.target.className === "searchbar aktuellt") {
        return;
      }
      if (e.target.className === "sångbok-filter-knapp active") {
        return;
      }
      if (e.target.className === "fa-solid fa-ellipsis") {
        return;
      }
      setfilterPanelOpen(false);
    };

    document.addEventListener("mousedown", panelCloseHandler);
    return () => {
      document.removeEventListener("mousedown", panelCloseHandler);
    };
  });

  return (
    <div id="contentbody">
      <h1 id="page-title">Sångbok</h1>
      <p>
        Nedan finner du samtliga sånger från sektionens officiella sångbok som trycktes inför
        sektionens 20-årsjubileum. Fysisk kopia av sångboken finns att köpa för 130 kr. Prata med
        försäljningsansvarig!
      </p>

      <div className="sångbok-wrapper">
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
              logEvent(analytics, "search", { search_term: search });
            }}
            className="searchbar"
          />
          <button
            ref={panelref}
            className={`sångbok-filter-knapp ${filterPanelOpen ? "active" : ""}`}
            onClick={() => setfilterPanelOpen(!filterPanelOpen)}>
            <i className="fa-solid fa-ellipsis" />
          </button>
        </div>

        <section
          ref={panelref}
          className={`sångbok filterPanel ${filterPanelOpen ? "open" : "collapsed"}`}>
          <label>
            <input
              type="radio"
              name="filters"
              value="pageNr"
              checked={sort === "pageNr"}
              onChange={(e) => sortBy(e)}
              className="filterbutton"
            />
            <span className="filteroption">Sortera på sidnummer</span>
          </label>
          <label>
            <input
              type="radio"
              name="filters"
              value="alphabetical"
              checked={sort === "alphabetical"}
              onChange={(e) => sortBy(e)}
              className="filterbutton"
            />
            <span className="filteroption">Sortera Alfabetiskt</span>
          </label>
          <label>
            <input
              type="radio"
              name="filters"
              value="category"
              checked={sort === "category"}
              onChange={(e) => sortBy(e)}
              className="filterbutton"
            />
            <span className="filteroption">Sortera på kategori</span>
          </label>
        </section>

        {sortedSongs
          .filter(
            (sång) => search === "" || sång.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((sång) =>
            sång.hemlig && HideDate(currentMonth) ? (
              ""
            ) : (
              <Link href={`sangbok${sång.href}`} className="sånglänk" key={sång.href}>
                <div>
                  <span className="sångtitel">{sång.title}</span>
                  <span className="sångsida">&nbsp; s.{sång.sida}</span>
                </div>
                <div className="sångkategori">&nbsp; {sång.kategori}</div>
              </Link>
            )
          )}
      </div>
    </div>
  );
}
export default Sangbok;

export async function getStaticProps() {
  var sånger = JSON.parse(readFileSync(`public/content/data/sangbok-index.json`));

  return {
    props: { sånger },
  };
}
