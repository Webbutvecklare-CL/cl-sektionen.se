import PostFeed from "../../components/PostFeed";
import { firestore } from "../../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";

import FeedPreview from "../../components/FeedPreview";

export default function Aktuellt({ newsList, eventList }) {
  const [currentpage, setcurrentPage] = useState(1);
  const itemsperpage = 6;

  const [filterPanelOpen, setfilterPanelOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [type, setType] = useState({
    Nyheter: true,
    Event: true,
  });
  const [filterTags, setFilterTags] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date().toLocaleString().substring(0, 10));

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

  
  const handleSetType = (e) => {
    if (e) {
      e.preventDefault();
    }
    let tag = e.target.innerHTML;
    let selected = e.target.classList.contains("selected");

    setType((t) => ({ ...t, ...{ [tag]: !selected}}));
  };
  useEffect(() =>{
    //Går säkert att göra super smidigt med '...' syntax, men jag orkar inte lära mig det.
    if (type["Nyheter"] && type["Event"]){
      setFilterTags({
        Aktuellt: filterTags["Aktuellt"]? filterTags["Aktuellt"] : false,
        Viktigt: filterTags["Viktigt"]?  filterTags["Viktigt"] : false,
        Information: filterTags["Information"]?  filterTags["Information"] : false,
        Annat: filterTags["Annat"]?  filterTags["Annat"] : false,
    
        Idrott: filterTags["Idrott"]?  filterTags["Idrott"] : false,
        Gasque: filterTags["Gasque"]?  filterTags["Gasque"] : false,
        Pub: filterTags["Pub"]?  filterTags["Pub"] : false,
        Lunchföreläsning: filterTags["Lunchföreläsning"]?  filterTags["Lunchföreläsning"] : false,
        Workshop: filterTags["Workshop"]?  filterTags["Workshop"] : false,
        Förtroendevalda: filterTags["Förtroendevalda"]?  filterTags["Förtroendevalda"] : false,
        SM: filterTags["SM"]?  filterTags["SM"] : false,
        StyM: filterTags["StyM"]?  filterTags["StyM"] : false,
      })
    }
    else if (type["Nyheter"]){
      setFilterTags({
        Aktuellt: filterTags["Aktuellt"]? filterTags["Aktuellt"] : false,
        Viktigt: filterTags["Viktigt"]?  filterTags["Viktigt"] : false,
        Information: filterTags["Information"]?  filterTags["Information"] : false,
        Annat: filterTags["Annat"]?  filterTags["Annat"] : false,
      })
    }
    else if (type["Event"]){
      setFilterTags({
        Idrott: filterTags["Idrott"]?  filterTags["Idrott"] : false,
        Gasque: filterTags["Gasque"]?  filterTags["Gasque"] : false,
        Pub: filterTags["Pub"]?  filterTags["Pub"] : false,
        Lunchföreläsning: filterTags["Lunchföreläsning"]?  filterTags["Lunchföreläsning"] : false,
        Workshop: filterTags["Workshop"]?  filterTags["Workshop"] : false,
        Förtroendevalda: filterTags["Förtroendevalda"]?  filterTags["Förtroendevalda"] : false,
        SM: filterTags["SM"]?  filterTags["SM"] : false,
        StyM: filterTags["StyM"]?  filterTags["StyM"] : false,
      })
    }
    else {setFilterTags({})}
  }, [type])

  const panelref = useRef();
  //Stänger filterpanelen om man trycker utanför
  useEffect(() => {
    let panelCloseHandler = (e) => {
      if (panelref.current.contains(e.target)){return}
      if (e.target.className === "filterPanel mobile"){return}
      if (e.target.className === "searchbar aktuellt"){return}
      if (e.target.className === "filter-knapp active"){return}
      if (e.target.className === "fa-solid fa-ellipsis"){return}
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
      if (!fokusSearchBar && e.target.className === "searchbar aktuellt"){setfokusSearchBar(true)}
      else if (fokusSearchBar && e.target.className !== "searchbar aktuellt"){setfokusSearchBar(false)}
    };

    document.addEventListener("mousedown", focusSearchHandler);
    return () => {
      document.removeEventListener("mousedown", focusSearchHandler);
    };
  });

  //HTML för filterpaneler
  const TypPanel = () =>{
    return(
      <div>
        <h3><i className="fa-solid fa-filter"/>  Nyheter eller event</h3>
        <button
          className={`${type["Nyheter"] ? "selected" : ""}`}
          onClick={handleSetType}>
          Nyheter
        </button>
        <button
          className={`${type["Event"] ? "selected" : ""}`}
          onClick={handleSetType}>
          Event
        </button>
      </div>
    )
  }
  const SortPanel = () =>{
    return(
      <div>
        <h3><i className="fa-solid fa-arrow-down-wide-short"/> Sortera efter</h3>
        <p>[Sortera efter datum, nämnd eller alfabetisk samt toggle för ascending/descending]</p>
      </div>
    )
  }
  const TagPanel = () =>{
    return (
      <div>
        <h3><i className="fa-solid fa-tags"/> Kategorier</h3>
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
    )
  }
  const DatumPanel = () =>{
    return (
      <div className="publiceringsdatum-wrapper">
        <h3><i className="fa-solid fa-calendar-days"/> Publiceringsdatum</h3>
        <strong>Från&nbsp;</strong>
        <input
          type="date"
          className="datepicker"
          required
          onChange={(e) => setStartDate(e.target.value)}
        /><br/><br/>
        <strong>Till &nbsp;&nbsp;</strong>
        <input
          type="date"
          className="datepicker"
          required
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
        />
      </div>
    )
  }

  // Någon useEffect kanske om användaren laddar in fler inlägg
  // eller vill söka som bara lägger till de nya i newsList/eventList
  return (
    <div id="contentbody">
      <h1>Sök bland alla inlägg</h1>
      <div className="aktuellt-wrapper">

        {/*filterpanel för widescreen*/}
        <section className="filterPanel wide">
          <h2>Filtrera inlägg</h2>
          <TypPanel/>
          <SortPanel/>
          <TagPanel/>
          <DatumPanel/>
        </section>

        <div className="sök-och-content-wrapper">
          <div className={`inputfält-aktuellt ${fokusSearchBar ? "active" : ""}`}>
            <input
              ref={panelref}
              type="text"
              placeholder="Sök efter inlägg..."
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              className="searchbar aktuellt"
            />
            <button
              ref={panelref}
              className={`filter-knapp ${filterPanelOpen ? "active" : ""}`}
              onClick={() => setfilterPanelOpen(!filterPanelOpen)}
            >
              <i className="fa-solid fa-ellipsis"/>
            </button>
          </div>

          {/*filterpanel för mobile*/}
          <section 
              ref={panelref} 
              className={`filterPanel mobile ${filterPanelOpen ? "open" : "collapsed"}`}>
            <div className="typ_o_sort_wrapper">
              <TypPanel/>
              <SortPanel/>
            </div>
            <TagPanel/>
            <DatumPanel/>
          </section>

          <section className="posts">
            <div style={{ display: "flex" }}>
              <FeedPreview posts={newsList.filter((post) =>{
                  return search.toLowerCase() === ""
                  ? true
                  : post.title.toLowerCase().includes(search.toLowerCase());
                })
                .slice(0, (currentpage) * itemsperpage)
              }/>
            </div>
            <button 
              className={`ladda-fler ${(currentpage*itemsperpage < newsList.length)? "ok" : "nope"}`}
              onClick={(currentpage*itemsperpage < newsList.length)? () => setcurrentPage(currentpage + 1) : ()=>{} }>{currentpage*itemsperpage < newsList.length? "Ladda fler inlägg" : "Inga fler inlägg att hämta"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let newsList = [];
  let eventList = [];

  // Aktuellt
  const timeNow = Timestamp.now();
  const postRef = collection(firestore, "posts");

  // Skapar en query - vilka inlägg som ska hämtas
  const newsQuery = query(
    postRef,
    where("type", "==", "Nyheter"),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(60)
  );
  const eventQuery = query(
    postRef,
    where("type", "==", "Event"),
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(60)
  );

  // Hämtar inläggen från firestore
  const newsDocs = await getDocs(newsQuery);
  const eventDocs = await getDocs(eventQuery);

  // Plockar ut data och lägger till id i post data
  newsDocs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    newsList.push(data);
  });

  eventDocs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    eventList.push(data);
  });

  // newsList och eventList är listor med de senaste inläggen
  // stringify gör om listan till en sträng parse gör sedan om till objekt
  return {
    props: {
      newsList: JSON.parse(JSON.stringify(newsList)),
      eventList: JSON.parse(JSON.stringify(eventList)),
    }, // will be passed to the page component as props
  };
}
