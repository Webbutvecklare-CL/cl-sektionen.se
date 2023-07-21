import { useEffect, useRef, useState } from "react";
import TextHighlighter from "../components/Highlighter";
import { readFileSync } from "fs";

import styles from "../styles/ordbok.module.css";
import songStyles from "../styles/sangbok.module.css";
import filterStyles from "../styles/filter-panel.module.css";

function Ordbok({ ordbok }) {
  const [sortedOrdbok, setSortedOrdbok] = useState(
    [...ordbok].sort((a, b) => a.begrepp.localeCompare(b.begrepp, "sv"))
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("alphabetical");

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [fokusSearchBar, setFokusSearchBar] = useState(false);
  const panelRef = useRef();

  const sortBy = (e) => {
    setSort(e.target.value);
  };

  useEffect(() => {
    if (sort === "category") {
      setSortedOrdbok(
        [...ordbok]
          .sort((a, b) => a.begrepp.localeCompare(b.begrepp, "sv"))
          .sort((a, b) => a.kategori.localeCompare(b.kategori, "sv"))
      );
    } else {
      setSortedOrdbok([...ordbok].sort((a, b) => a.begrepp.localeCompare(b.begrepp, "sv")));
    }
  }, [ordbok, sort]);

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
      if (e.target.className === `${filterStyles.filterOpen} ${filterStyles.active}`) {
        return;
      }
      if (e.target.className === "fa-solid fa-ellipsis") {
        return;
      }
      setFilterPanelOpen(false);
    };

    document.addEventListener("mousedown", panelCloseHandler);
    return () => {
      document.removeEventListener("mousedown", panelCloseHandler);
    };
  }, []);

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
  }, [fokusSearchBar]);

  const Ord = ({ ord }) => {
    return (
      <div className={styles.ord}>
        <div>
          <span lang="sv" className={styles.begrepp}>
            <TextHighlighter search={search} text={ord.begrepp} />
          </span>
          <br />
          <span className={styles.kategori}>{ord.kategori}</span>
        </div>
        <p className={styles.betydelse}>
          <TextHighlighter search={search} text={ord.betydelse} />
        </p>
      </div>
    );
  };

  return (
    <div id="contentbody">
      <div className="small-header">
        <h1 id="page-title">Ordbok</h1>
        <p>
          Följande är en lista över krångliga begrepp och förkortningar som kan dyka upp på SM eller
          andra sammanhang på sektionen.
        </p>
      </div>
      <div className={styles.ordbokWrapper}>
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
            }}
            className="searchbar"
          />
          <button
            ref={panelRef}
            className={`${filterStyles.filterOpen} ${filterPanelOpen ? filterStyles.active : ""}`}
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}>
            <i className="fa-solid fa-ellipsis" />
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
          </div>
        </section>

        {sortedOrdbok
          .filter(
            (ord) =>
              search === "" ||
              ord.begrepp.toLowerCase().includes(search.toLowerCase()) ||
              ord.betydelse.toLowerCase().includes(search.toLowerCase()) ||
              ord.kategori.toLowerCase().includes(search.toLowerCase())
          )
          .map((ord) => {
            return <Ord key={ord.begrepp} ord={ord} />;
          })}
      </div>
    </div>
  );
}
export default Ordbok;

export async function getStaticProps() {
  var ordbok = JSON.parse(readFileSync(`public/content/data/ordbok.json`));

  return {
    props: { ordbok },
  };
}
