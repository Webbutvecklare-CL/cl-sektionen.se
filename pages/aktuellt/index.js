import PostFeed from "../../components/PostFeed";
import { firestore } from "../../firebase/clientApp";
import { collection, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";

import FeedPreview from "../../components/FeedPreview";

export default function Aktuellt({ newsList, eventList }) {
  // Någon useEffect kanske om användaren laddar in fler inlägg
  // eller vill söka som bara lägger till de nya i newsList/eventList

  return (
    <div id="contentbody">
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
  let newsDocs = [];
  let eventDocs = [];
  try {
    newsDocs = await getDocs(newsQuery);
    eventDocs = await getDocs(eventQuery);
  } catch (error) {
    console.error("Det gick inte att hämta inläggen: ", error);
  }

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
