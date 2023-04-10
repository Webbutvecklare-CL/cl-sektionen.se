import PostFeed from "../../components/PostFeed";
import { firestore } from "../../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";

import FeedPreview from "../../components/FeedPreview";

export default function Aktuellt({ newsList, eventList }) {
  const [filterPanelOpen, setfilterPanelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTags, setfilterTags] = useState([]);

  // tar bort filter kategori of den redan finns, lägger annars till den
  const handleTagChange = (newTag) =>{
    filterTags.includes(newTag)?
    setfilterTags(filterTags.filter(tag => tag !== newTag)):
    setfilterTags(arr => [...arr, newTag]);
  }

  const toggleSearchControlls = () => {
    setfilterPanelOpen(!filterPanelOpen)
  }

  const panelref = useRef();

  //Stänger filterpanelen om man trycker utanför
  useEffect(() => {
    let handler = (e) => {
      if (panelref.current.contains(e.target)){return}
      if (e.target.className === "filterPanel"){return}
      if (e.target.className === "searchbar aktuellt"){return}
      if (e.target.className === "filter-knapp active"){return}
      if (e.target.className === "fa-solid fa-ellipsis"){return}
      setfilterPanelOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  // Någon useEffect kanske om användaren laddar in fler inlägg
  // eller vill söka som bara lägger till de nya i newsList/eventList
  

  return (
    <div id="contentbody">
      <div>
        <div className="inputfält-aktuellt">
          <input
            ref={panelref}
            type="text"
            placeholder="Sök efter inlägg..."
            onChange={(e) => setSearch(e.target.value)}
            className="searchbar aktuellt"
          />
          <button
            ref={panelref}
            className={`filter-knapp ${filterPanelOpen ? "active" : ""}`}
            onClick={(e) => toggleSearchControlls()}
          >
            <i className="fa-solid fa-ellipsis"/>
          </button>
        </div>
        <section 
          ref={panelref} 
          className={`filterPanel ${filterPanelOpen ? "open" : "collapsed"}`}
        >
          <p>
            Här ska man kunna filtrera på tags osv(WIP)...
          </p>
          <p>
            Kanske vore bättre med en permanent sidebar istället? 
            eller detta för mobile och sidebar för desktop.
          </p>
        </section>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "48%" }}>
          <h1>Nyheter</h1>
          <FeedPreview posts={newsList} />
        </div>
        <div style={{ width: "48%" }}>
          <h1>Event</h1>
          <FeedPreview posts={eventList} />
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
