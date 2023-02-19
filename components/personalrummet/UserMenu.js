import React, { useEffect, useState } from "react";

import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { updateUser } from "../../utils/authUtils";

import CreatePost from "./CreatePost";
import EditPost from "./EditPost";
import FeedPreview from "../FeedPreview";
import MarkdownRender from "../MarkdownRender";

export default function UserMenu({ user }) {
  const [menuSelect, setMenuSelect] = useState("senaste");
  const [error, setError] = useState("");
  const [committeePosts, setCommitteePosts] = useState({ docs: [] });

  const [status, setStatus] = useState("");

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
    console.log("getDoc - Committee Query");
    const postRef = collection(firestore, "posts");

    const committeeQuery = query(
      postRef,
      where("committee", "==", user.committee),
      orderBy("publishDate", "desc"),
      limit(5)
    );

    getDocs(committeeQuery)
      .then((docs) => setCommitteePosts(docs))
      .catch((err) => {
        console.error("Fel vid laddning av nämndinlägg:", err);
        setError("Det gick inte att hämta nämndens inlägg, vänligen kontakta webbansvariga.");
      });
  }, [user.committee]);

  const handleUserUpdate = () => {
    setMenuSelect("update");
    setStatus("Försöker uppdatera användare...");
    if (user) {
      updateUser(user)
        .then(setStatus("Uppgifter uppdaterade."))
        .catch((err) => {
          console.error("Fel vid user update:", err);
          setStatus("Det gick inte att uppdatera uppgifterna.");
          setError(
            "Det gick inte att uppdatera dina uppgifter. Prova att ladda om sidan och logga in igen eller kontakta webbansvariga."
          );
        });
    } else {
      setError("Du verkar inte vara inloggad. Prova att ladda om sidan och logga in igen.");
    }
  };

  return (
    <div>
      <div className="userInfo">
        <p>
          Välkommen {user.displayName}!
          <br />
          Nedanför kan du se {user.committee}s senaste inlägg.
        </p>
        {user.permission == "moderator" && (
          <p>
            Du kan skapa nya eller redigera tidigare inlägg. Om du ta bort ett inlägg från din nämnd
            kan du arkivera det (Kommer i framtiden).
          </p>
        )}
        {user.permission == "admin" && <p>Du kan göra vad du vill.</p>}
      </div>
      <div
        className="menu"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2 + "rem",
        }}
      >
        <button className="senaste" onClick={() => setMenuSelect("senaste")}>
          Senaste inläggen
        </button>
        <button className="redigera" onClick={() => setMenuSelect("redigera")}>
          Redigera
        </button>
        <button className="publicera" onClick={() => setMenuSelect("publicera")}>
          Publicera
        </button>
        <button className="update" onClick={handleUserUpdate}>
          Uppdatera uppgifter
        </button>
        <button className="how-to" onClick={() => setMenuSelect("how-to")}>
          HOW-TO
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
              <FeedPreview docs={committeePosts.docs} />
            </div>
          )}
        </div>
      )}
      {menuSelect == "redigera" && (
        <div>
          <h2>Redigera</h2>
          <EditPost />
        </div>
      )}
      {menuSelect == "publicera" && (
        <div>
          <h2>Publicera</h2>
          <CreatePost user={user} />
        </div>
      )}
      {menuSelect == "update" && <p>{status}</p>}
      {menuSelect == "how-to" && (
        <div>
          <h2>HOW-TO</h2>
          <MarkdownRender source={"./content/personalrummet/how-to.md"} />
        </div>
      )}

      {error && <p>Ett fel har inträffat: {error}</p>}
    </div>
  );
}
