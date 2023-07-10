import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";

import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { updateUser } from "../../utils/authUtils";
import { useAuth } from "../../context/AuthContext";

import CommitteeFeed from "./CommitteeFeed";
import MarkdownRender from "../MarkdownRender";
import ErrorPage from "../ErrorPage";
import { all_committees } from "../../constants/committees-data";

export default function UserMenu() {
  const [menuSelect, setMenuSelect] = useState("senaste");
  const [error, setError] = useState("");
  const [committeePosts, setCommitteePosts] = useState([
    // { id: "s", title: "Test", subtitle: "", author: "Test person" },
  ]);

  const [userUpdateStatus, setUserUpdateStatus] = useState("");

  const { user, userData, logOut } = useAuth();
  const router = useRouter();

  // Rensa error om man byter meny
  useEffect(() => {
    setError("");
    document.querySelectorAll(".menu button").forEach((elem) => {
      elem.style.backgroundColor = null;
    });
    document.querySelector(`.${menuSelect}`).style.backgroundColor = "var(--clr3)";
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
      .then((docs) => {
        let posts = [];
        docs.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          posts.push(data);
        });
        setCommitteePosts(posts);
      })
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
          Nedanför kan du se {all_committees.find(namnd => namnd.id == userData.committee).name}s senaste inlägg.
        </p>
        {userData.permission === "moderator" && (
          <p>
            Du kan skapa nya eller redigera tidigare inlägg. Om du ta bort ett inlägg från din nämnd
            kan du arkivera det (Kommer i framtiden).
          </p>
        )}
        {userData.permission === "admin" && <p>Du kan göra vad du vill.</p>}
      </div>

      {/*Knappar*/}
      <div className="menu">
        <button className="senaste" onClick={() => setMenuSelect("senaste")}>
          Senaste inläggen
        </button>
        <button className="update" onClick={handleUserUpdate}>
          Uppdatera uppgifter
        </button>
        <button className="how-to" onClick={() => setMenuSelect("how-to")}>
          HOW-TO
        </button>
        <button className="how-to" onClick={() => logOut()}>
          Logga ut
        </button>
      </div>
      <div className="menu">
        <button className="redigera" onClick={() => router.push("personalrummet/redigera")}>
          Redigera
        </button>
        <button className="publicera" onClick={() => router.push("personalrummet/publicera")}>
          Publicera
        </button>
      </div>
      {menuSelect == "senaste" && (
        <div>
          {committeePosts && (
            <div>
              <h2>Nämndens senaste inlägg</h2>
              <CommitteeFeed posts={committeePosts} permission={userData.permission} />
            </div>
          )}
          {!committeePosts && (
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
