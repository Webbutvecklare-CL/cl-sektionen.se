import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import PostForm from "../../components/personalrummet/PostForm";
import BackButton from "@/components/BackButton";
import Modal from "@/components/Modal";

import { getFirestore, doc, setDoc, deleteDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app } from "../../firebase/clientApp";
import { useAuth } from "../../context/AuthContext";

const storage = getStorage(app);
const firestore = getFirestore(app);

import { createEvent } from "../../utils/calendarUtils";
import { validateLink } from "../../utils/postUtils";
import { revalidate, sendNotification } from "../../utils/server";

import { all_committee_ids } from "../../constants/committees-data";

import {
  formWrapper,
  actionMenu,
  responseContainer,
} from "@/styles/personalrummet/post-form.module.css";

export default function Publicera({ calendarID }) {
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
    // publishDate: today,
    author: "",
    visibility: "public",
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
        author: all_committee_ids[userData.committee].name,
        authorCommittee: userData.committee,
      });
    }
  }, [userData, today]);

  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [successLink, setSuccessLink] = useState(""); // False/null om inlägget inte har publicerats
  const [calendarStatus, setCalendarStatus] = useState("");

  const [modal, setModal] = useState(false);

  // Skickar allt till databasen
  const handleSubmit = async (data) => {
    setIsPending(true);
    setStatus("Validera länk...");

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
      publishDate: Timestamp.fromDate(new Date()),
      tags: data.tags,
      committee: userData.permission === "admin" ? data.authorCommittee : userData.committee, // Länkar inlägget med nämnden
      creator: userData.uid, // Länkar inlägget till användaren
      type: data.type,
      visibility: data.visibility,
    };

    if (data.type === "event") {
      postData.startDateTime = Timestamp.fromDate(new Date(data.startDateTime));
      postData.endDateTime = Timestamp.fromDate(new Date(data.endDateTime));
    }

    const postRef = doc(firestore, "posts", link);

    setStatus("Laddar upp inlägget...");
    try {
      await setDoc(postRef, postData);
      console.log("Inlägget är uppladdat");
    } catch (err) {
      setError("Kunde inte ladda upp inlägget");
      setIsPending(false);
      setModal(
        <Modal onClose={() => {}}>
          <h2>Det gick inte att ladda upp inlägget</h2>
          <p>Testa igen eller kontakta webbansvariga.</p>
          <p>Felmeddelande: {err.message}</p>
          <div className={actionMenu}>
            <button
              onClick={() => {
                setModal(false);
                setIsPending(false);
              }}>
              Stäng
            </button>
          </div>
        </Modal>
      );
      console.error("Fel vid uppladdningen av inlägget: ", err);
      return;
    }

    // Kolla om det finns en bild
    if (data.image.name) {
      // Ladda upp bilden
      setStatus("Laddar upp bilden...");
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

        console.log(err);
        const response = new Promise((resolve, reject) => {
          setModal(
            <Modal onClose={() => {}}>
              <h2>Det gick inte att ladda upp bilden</h2>
              <p>
                Inlägget är uppladdat men inte bilden.
                <br />
                Vill du ladda upp inlägget {data.sendNotification ? "och skicka notiser" : ""} ändå?
                <br />
                Du kan ladda upp bilden senare.
              </p>
              <div className={actionMenu}>
                <button
                  onClick={() => {
                    setModal(false);
                    resolve(true);
                  }}>
                  Ladda upp bild senare
                </button>
                <button
                  onClick={async () => {
                    await handleDeletion(data);
                    setModal(false);
                    resolve(false);
                    setIsPending(false);
                    setError("Inlägget är raderat");
                  }}>
                  Ta bort inlägget
                </button>
              </div>
            </Modal>
          );
        });
        const continueUpload = await response;
        if (!continueUpload) {
          setIsPending(false);
          setError("Användaren avbröt uppladdningen och inlägget är raderat.");
          return;
        }
      }
    }

    // Försöker revalidate
    setStatus("Uppdatera webbplatsen...");
    try {
      // Revalidate:ar hemsidan
      await revalidate(user, { index: true, aktuellt: true, post: link });
    } catch (error) {
      console.error(error);
      setModal(
        <Modal
          onClose={() => {
            setModal(false);
            setIsPending(false);
          }}>
          <h2>Det gick inte att uppdatera webbplatsen</h2>
          <p>
            Inlägget är uppladdat med det är inte säkert att det syns på startsidan eller under
            aktuellt. Kontakta webbansvariga.
          </p>
          <p>Felmeddelande: {error.message}</p>
          <button
            onClick={() => {
              setModal(false);
              setIsPending(false);
            }}>
            Stäng
          </button>
        </Modal>
      );
      return;
    }

    // Lägger till i kalender om valt
    if (data.type === "event" && data.publishInCalendar) {
      try {
        await addEvent({
          title: data.title,
          description: data.body,
          start: new Date(data.startDateTime),
          end: new Date(data.endDateTime),
        });
      } catch (error) {
        console.error(error);

        setModal(
          <Modal
            onClose={() => {
              setModal(false);
              setIsPending(false);
            }}>
            <h2>Det gick inte att lägga till eventet i kalendern</h2>
            <p>Du kan gå in i sektionskalendern manuellt och lägga till eventet.</p>
            <p>Felmeddelande: {error.message}</p>

            <button
              onClick={() => {
                setModal(false);
                setIsPending(false);
              }}>
              Stäng
            </button>
          </Modal>
        );
      }
    }

    // Skickar notis om valt
    if (data.sendNotification) {
      setStatus("Skickar notiser...");
      try {
        await sendNotification(user, { type: "post", postId: link });
      } catch (error) {
        setError("Det gick inte att skicka notiserna");
        console.error(error);
        setModal(
          <Modal
            onClose={() => {
              setModal(false);
              setIsPending(false);
            }}>
            <h2>Det gick inte att skicka notiserna</h2>
            <p>Kontakta webbansvariga om du vill skicka en ny notis.</p>
            <p>Felmeddelande: {error.message}</p>

            <button
              onClick={() => {
                setModal(false);
                setIsPending(false);
              }}>
              Stäng
            </button>
          </Modal>
        );
        return;
      }
    }

    setIsPending(false);
    setError("");
    setSuccessLink(link);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletion = async (data) => {
    try {
      const postRef = doc(firestore, "posts", data.link);
      await deleteDoc(postRef);
      console.log("Inlägget är borttaget");
    } catch (err) {
      setError("Kunde inte ta bort inlägget");
      setIsPending(false);
      console.error("Fel vid borttagningen av inlägget: ", err);
      return;
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
          console.error(err);
          throw new Error("Kunde inte logga in på nytt!");
        }
      } else {
        setError("Du måste vara inloggad, prova ladda om sidan!");
        throw new Error("Du måste vara inloggad!");
      }
    }

    createEvent(token, calendarID, eventData)
      .then((res) => {
        console.log(res);
        setCalendarStatus("Uppladdat i kalendern.");
      })
      .catch((err) => {
        if (err.status == 401) {
          console.log(calendarID);
        } else {
          console.error(err);
        }
        err.json().then((data) => {
          console.log(data);
        });
        setCalendarStatus("Det gick inte att ladda upp i kalendern.");
      });
    console.log("Eventet är uppladdat i kalendern");
  };

  return (
    <div id="contentbody">
      <div className="small-header">
        {modal && modal}
        <BackButton page="personalrummet">Personalrummet</BackButton>
        <h1>Personalrummet - Publicera</h1>
        {successLink && (
          <div>
            <p>
              Inlägget är publicerat, du hittar det på följande länk:{" "}
              <Link
                href={`/aktuellt/${successLink}`}>{`www.cl-sektionen.se/aktuellt/${successLink}`}</Link>
              <br />
            </p>
          </div>
        )}
      </div>
      {userData && !successLink && (
        <div className={formWrapper}>
          <PostForm onSubmit={handleSubmit} prefill={prefillData} buttonText={"Skapa"} />
          <div className={responseContainer}>
            {isPending && <p>{status || "Skapar inlägget..."}</p>}
            {error && <p>Error: {error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      calendarID: process.env.CL_CALENDAR,
    },
  };
}

import { googleLogin } from "@/utils/authUtils";

async function reauthenticate() {
  return new Promise((resolve, reject) => {
    googleLogin()
      .then(async (result) => {
        console.log("Omautentiserad!");
        // Användaren har loggat in med sin förtroendevalds-mail
        // Förutsätter att användaren loggat in tidigare dvs att userData finns
        const { GoogleAuthProvider } = await import("firebase/auth");
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        resolve(token);
      })
      .catch((err) => {
        console.error(err);
        if (err.code == "auth/popup-closed-by-user") {
          setError("Inloggningsfönstret stängdes!");
        } else {
          setError("Fel vid inloggningen till google!");
        }
        reject();
      });
  });
}
