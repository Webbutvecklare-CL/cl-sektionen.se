import Link from "next/link";
import { analytics } from "../../firebase/clientApp";
import { useEffect, useRef, useState } from "react";
import { readFileSync } from "fs";
import { logEvent } from "firebase/analytics";
import TextHighlighter from "../../components/Highlighter";

//göm majjelåtar mellan månad 6 och 9
function HideDate(currentMonth) {
  if (currentMonth < 6 || currentMonth > 9) {
    return false;
  }
  return true;
}

export default function Sangbok({ sånger }) {
  const [sortedSongs, setSortedSongs] = useState(
    [...sånger].sort((a, b) => parseInt(a.sida, 10) - parseInt(b.sida, 10))
  );
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
  });

  const SångLänk = ({ sång }) => {
    return sång.hemlig && HideDate(currentMonth) ? (
      ""
    ) : (
      <Link href={`sangbok${sång.href}`} className="sånglänk">
        <div>
          <span className="sångtitel">
            <TextHighlighter search={search} text={sång.title} />
          </span>
          <span className="sångsida">&nbsp; s.{sång.sida}</span>
        </div>
        <div className="sångkategori">&nbsp; {sång.kategori}</div>
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
    muteButton.innerHTML = '<i class="fa-solid fa-volume-xmark"/>';
    document.querySelector("div.inputfält").appendChild(muteButton);
  };

  return (
    <div id="contentbody">
      <div className="small-header">
        <h1 id="page-title">Sångbok</h1>
        <p>
          Nedan finner du samtliga sånger från sektionens officiella sångbok som trycktes inför
          sektionens 20-årsjubileum. Fysisk kopia av sångboken finns att köpa för 130 kr. Prata med
          försäljningsansvarig
        </p>
        <p>Du skall söka efter en förlist sång. Du behöver ta en resa till Botswana.</p>
      </div>

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
              if (["never gonna give you up", "spela en låt"].includes(search.toLowerCase())) {
                playSong();
              }
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

        {sortedSongs
          .filter(
            (sång) =>
              search === "" ||
              sång.title.toLowerCase().includes(search.toLowerCase()) ||
              sång.altSearch?.some((title) => title.toLowerCase().includes(search.toLowerCase()))
          )
          .map((sång) => (
            <SångLänk key={sång.href} sång={sång} />
          ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  var sånger = JSON.parse(readFileSync(`public/content/data/sangbok-index.json`));

  return {
    props: { sånger },
  };
}
