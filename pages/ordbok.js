import { useEffect, useRef, useState } from "react";
import TextHighlighter from "../components/Highlighter";
import { readFileSync } from "fs";

function Ordbok({ ordbok }) {
  const [sortedOrdbok, setSortedOrdbok] = useState(
    [...ordbok].sort((a, b) => a.begrepp.localeCompare(b.begrepp, "sv"))
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("alphabetical");

  const [filterPanelOpen, setfilterPanelOpen] = useState(false);
  const [fokusSearchBar, setfokusSearchBar] = useState(false);
  const panelref = useRef();

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
      if (panelref.current.contains(e.target)) {
        return;
      }
      if (e.target.className === "filterPanel mobile") {
        return;
      }
      if (e.target.className === "searchbar") {
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
  }, []);

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
  }, [fokusSearchBar]);

  const Ord = ({ ord }) => {
    return (
      <div className="ord">
        <div>
          <span lang="sv" className="begrepp">
            <TextHighlighter search={search} text={ord.begrepp} />
          </span>
          <br />
          <span className="kategori">{ord.kategori}</span>
        </div>
        <p className="betydelse">
          <TextHighlighter search={search} text={ord.betydelse} />
        </p>
      </div>
    );
  };

  return (
    <div id="contentbody">
      <h1 id="page-title">Ordbok</h1>
      <p>
        Följande är en lista över krångliga begrepp och förkortningar som kan dyka upp på SM eller
        andra sammanhang på sektionen.
      </p>
      <div className="ordbok-wrapper">
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
              value="alphabetical"
              checked={sort === "alphabetical"}
              onChange={(e) => sortBy(e)}
              className="filterbutton"
            />
            <span className="filteroption">Sortera alfabetiskt</span>
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
