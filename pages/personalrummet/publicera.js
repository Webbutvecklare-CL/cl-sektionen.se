import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import PostForm from "../../components/personalrummet/PostForm";

import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../../firebase/clientApp";
import { useAuth } from "../../context/AuthContext";

import { createEvent } from "../../utils/calendarUtils";
import { validateLink } from "../../utils/postUtils";
import { reauthenticate } from "../../utils/authUtils";
import { revalidate } from "../../utils/server";

export default function Publicera() {
  const { user, userData, userAccessToken, setUserAccessToken } = useAuth();
  const router = useRouter();

  let today = new Date().toLocaleString().substring(0, 16); // Hämtar dagens datum och sätter som default
  const [prefillData, setPrefillData] = useState({
    title: "",
    subtitle: "",
    image: "",
    body: "",
    tags: [],
    startDateTime: new Date().toLocaleString().substring(0, 16),
    endDateTime: new Date().toLocaleString().substring(0, 16),
    publishDate: today,
    author: "",
  });

  useEffect(() => {
    if (userData) {
      setPrefillData({
        title: "",
        subtitle: "",
        image: "",
        body: "",
        tags: [],
        publishDate: today,
        author: userData.committee,
      });
    }
  }, [userData, today]);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const [successLink, setSuccessLink] = useState(""); // False/null om inlägget inte har publicerats
  const [calendarStatus, setCalendarStatus] = useState("");

  // Skickar allt till databasen
  const handleSubmit = async (data) => {
    setIsPending(true);

    // Validera id/länk
    // Om ej unik be användaren specificera en adress kollar därefter om den är unik
    let link = "";
    try {
      if (data.link) {
        link = await validateLink(data.link);
      } else {
        link = await validateLink(data.title);
      }
    } catch (error) {
      console.error("Fel vid valideringen av länken:", error);
      setError("Det gick inte att validera länken/id:et");
      setIsPending(false);
      return;
    }

    if (!link) {
      // Användaren stängde fönstret för att ange unik länk
      setIsPending(false);
      setError("Användaren avbröt uppladdningen.");
      return;
    }

    // Skickar data
    let postData = {
      title: data.title,
      subtitle: data.subtitle,
      image: "",
      body: data.body,
      author: data.author,
      publishDate: Timestamp.fromDate(new Date(data.publishDate)),
      tags: data.tags,
      committee: userData.committee, // Länkar inlägget med nämnden
      creator: userData.uid, // Länkar inlägget till användaren
      type: data.type,
      public: true,
    };

    if (data.type === "Event") {
      postData.startDateTime = Timestamp.fromDate(new Date(data.startDateTime));
      postData.endDateTime = Timestamp.fromDate(new Date(data.endDateTime));
    }

    const postRef = doc(firestore, "posts", link);

    setDoc(postRef, postData)
      .then(console.log("Inlägget är publicerat!"))
      .catch((err) => {
        setError("Kunde inte ladda upp inlägget");
        setIsPending(false);
        alert("Kunde inte ladda upp inlägget");
        console.error("Fel vid uppladdningen av inlägget: ", err);
        return;
      });

    // Kolla om det finns en bild
    if (data.image.name) {
      // Ladda upp bilden
      try {
        const imageRef = ref(storage, `posts/${link}/${data.image.name}`);
        await uploadBytes(imageRef, data.image);
        const downloadUrl = await getDownloadURL(imageRef);

        // Uppdatera en länk till bilden i posten
        await updateDoc(postRef, {
          image: downloadUrl,
        });

        // Hoppar ner och rensar formuläret osv
      } catch (err) {
        setError("Inlägget uppladdat men inte bilden");
        setIsPending(false);
        console.log(err);
        return;
      }
    }

    if (data.type === "Event" && data.publishInCalendar) {
      addEvent({
        title: data.title,
        description: data.subtitle,
        start: new Date(data.startDateTime),
        end: new Date(data.endDateTime),
      });
    }

    setIsPending(false);
    setError("");
    setSuccessLink(link);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Försöker revalidate
    try {
      // Revalidate:ar hemsidan
      revalidate("all");
      revalidate("post", link);
    } catch (error) {
      console.error(error);
    }
  };

  // Lägger in event i kalendern
  const addEvent = async (eventData) => {
    // Om access token inte finns måste användaren logga in på nytt
    let token = userAccessToken;
    if (!token) {
      if (user && userData) {
        try {
          token = await reauthenticate();
          setUserAccessToken(token);
        } catch (err) {
          return;
        }
      } else {
        setError("Du måste vara inloggad, prova ladda om sidan!");
        return;
      }
    }
    const calendarID =
      "c_ed90bbde0bd3990cdf20f078c68d8e45822fea3b82ffd69687c36ffb0270924f@group.calendar.google.com";

    createEvent(token, calendarID, eventData)
      .then((res) => {
        console.log(res);
        setCalendarStatus("Uppladdat i kalendern.");
      })
      .catch((err) => {
        if (err.status == 401) {
          console.log(
            "c_ed90bbde0bd3990cdf20f078c68d8e45822fea3b82ffd69687c36ffb0270924f@group.calendar.google.com"
          );
        } else {
          console.error(err);
        }
        err.json().then((data) => {
          console.log(data);
        });
        setCalendarStatus("Det gick inte att ladda upp i kalendern.");
      });
  };

  return (
    <div id="contentbody">
      <h1>Personalrummet - Publicera</h1>
      <button type="button" onClick={() => router.back()}>
        Tillbaka
      </button>
      {userData && !successLink && (
        <div className="create">
          <PostForm onSubmit={handleSubmit} prefill={prefillData} buttonText={"Skapa"} />
          {isPending && <p>Skapar inlägget...</p>}
          {error && <p>Error: {error}</p>}
        </div>
      )}

      {successLink && (
        <div>
          <p>
            Inlägget är publicerat du hittar på följande länk:{" "}
            <Link
              href={`/aktuellt/${successLink}`}>{`www.cl-sektionen.se/aktuellt/${successLink}`}</Link>
            <br />
          </p>
        </div>
      )}
    </div>
  );
}
