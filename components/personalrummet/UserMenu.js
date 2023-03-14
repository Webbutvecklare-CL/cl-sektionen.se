import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";

import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore } from "../../firebase/clientApp";
import { updateUser } from "../../utils/authUtils";
import { useAuth } from "../../context/AuthContext";

import FeedPreview from "../FeedPreview";
import MarkdownRender from "../MarkdownRender";
import ErrorPage from "../ErrorPage";

export default function UserMenu() {
  const [menuSelect, setMenuSelect] = useState("senaste");
  const [error, setError] = useState("");
  const [committeePosts, setCommitteePosts] = useState({ docs: [] });

  const [userUpdateStatus, setUserUpdateStatus] = useState("");

  const { user, userData } = useAuth();
  const router = useRouter();

  // Rensa error om man byter meny
  useEffect(() => {
    setError("");
    document.querySelectorAll(".menu button").forEach((elem) => {
      elem.style.backgroundColor = null;
    });
    document.querySelector(`.${menuSelect}`).style.backgroundColor = "var(--clr5)";
  }, [menuSelect]);

  // Hämtar de senaste inläggen nämnden skapat
  useEffect(() => {
    if (!userData.committee) {
      return;
    }
    console.log("getDoc - Committee Query");
    const postRef = collection(firestore, "posts");

    const committeeQuery = query(
      postRef,
      where("committee", "==", userData.committee),
      orderBy("publishDate", "desc"),
      limit(5)
    );

    getDocs(committeeQuery)
      .then((docs) => setCommitteePosts(docs))
      .catch((err) => {
        console.error("Fel vid laddning av nämndinlägg:", err);
        setError("Det gick inte att hämta nämndens inlägg, vänligen kontakta webbansvariga.");
      });
  }, [userData.committee]);

  const handleUserUpdate = () => {
    setMenuSelect("update");
    setUserUpdateStatus("Försöker uppdatera användare...");
    if (user) {
      updateUser(user)
        .then(setUserUpdateStatus("Uppgifter uppdaterade."))
        .catch((err) => {
          console.error("Fel vid user update:", err);
          setUserUpdateStatus("Det gick inte att uppdatera uppgifterna.");
          setError(
            "Det gick inte att uppdatera dina uppgifter. Prova att ladda om sidan och logga in igen eller kontakta webbansvariga."
          );
        });
    } else {
      setError("Du verkar inte vara inloggad. Prova att ladda om sidan och logga in igen.");
    }
  };

  const loadEvents = () => {
    // Make sure to refresh the Auth Token in case it expires!
    const auth = getAuth();

    auth.currentUser
      .getIdToken()
      .then(function () {
        console.log(gapi);
        return gapi.client.calendar.events.list({
          calendarId: "c_5sqhb0om2kmti770g06qqknfik@group.calendar.google.com",
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime",
        });
      })
      .then(function (response) {
        console.log(response);
      });
  };

  if (error) {
    return (
      <ErrorPage
        error={{ header: "Ett fel inträffade vid inloggningen", body: error }}
        close={() => {
          setError("");
        }}
      />
    );
  }

  return (
    <div>
      <div className="userInfo">
        <p>
          Välkommen {userData.displayName}!
          <br />
          Nedanför kan du se {userData.committee}s senaste inlägg.
        </p>
        {userData.permission == "moderator" && (
          <p>
            Du kan skapa nya eller redigera tidigare inlägg. Om du ta bort ett inlägg från din nämnd
            kan du arkivera det (Kommer i framtiden).
          </p>
        )}
        {userData.permission == "admin" && <p>Du kan göra vad du vill.</p>}
      </div>

      {/*Knappar*/}
      <div className="menu">
        <button
          className="senaste"
          onClick={() => setMenuSelect("senaste")}
        >
          Senaste inläggen
        </button>
        <button
          className="update"
          onClick={handleUserUpdate}
        >
          Uppdatera uppgifter
        </button>
        <button
          className="how-to"
          onClick={() => setMenuSelect("how-to")}
        >
          HOW-TO
        </button>

        <button
          className="how-to"
          onClick={loadEvents}
        >
          Events
        </button>
      </div>
      <div className="menu">
        <button
          className="redigera"
          onClick={() => router.push("personalrummet/redigera")}
        >
          Redigera
        </button>
        <button
          className="publicera"
          onClick={() => router.push("personalrummet/publicera")}
        >
          Publicera
        </button>
      </div>
      {menuSelect == "senaste" && (
        <div>
          {committeePosts.docs && (
            <div>
              <h2>Nämndens senaste inlägg</h2>
              <FeedPreview docs={committeePosts.docs} />
            </div>
          )}
          {!committeePosts.docs && (
            <div>
              <h2>Nämndens senaste inlägg</h2>
              <p>Finns inga inlägg</p>
            </div>
          )}
        </div>
      )}
      {menuSelect == "update" && <p>{userUpdateStatus}</p>}
      {menuSelect == "how-to" && (
        <div>
          <h2>HOW-TO</h2>
          <MarkdownRender source={"./content/personalrummet/how-to.md"} />
        </div>
      )}
    </div>
  );
}
