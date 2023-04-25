import Link from "next/link";
import { useEffect, useState } from "react";
import { readFileSync } from "fs";

//göm majjelåtar mellan månad 6 och 9
function HideDate(currentMonth) {
  if (currentMonth < 6 || currentMonth > 9) {
    return false;
  }
  return true;
}

function Sangbok({ sånger }) {
  const [search, setSearch] = useState("");
  const [alphabetical, setAlphabetical] = useState(true);
  const currentMonth = new Date().getMonth();

  const sortSongs = () => {
    setAlphabetical(!alphabetical);
    sånger.sort((a, b) =>
      alphabetical ? a.kategori.localeCompare(b.kategori) : a.title.localeCompare(b.title)
    );
  };

  return (
    <div id="contentbody">
      <h1 id="page-title">Sångbok</h1>
      <p>
        Nedan finner du samtliga sånger från sektionens officiella sångbok som trycktes inför
        sektionens 20-årsjubileum. Fysisk kopia av sångboken finns att köpa för 130 kr. Prata med
        försäljningsansvarig!
      </p>

      <div className="inputfält-sångbok">
        <input
          type="text"
          placeholder="Sök efter sång..."
          onChange={(e) => setSearch(e.target.value)}
          className="searchbar sångbok"
        />
        <div className="filter">Sortera på kategori</div>
        <input type="checkbox" onChange={() => sortSongs()} className="filterbutton" />
      </div>

      {sånger
        .filter((sång) => search === "" || sång.title.toLowerCase().includes(search.toLowerCase()))
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
  );
}
export default Sangbok;

export async function getStaticProps() {
  var sånger = JSON.parse(readFileSync(`public/content/data/sangbok-index.json`));

  return {
    props: { sånger },
  };
}
