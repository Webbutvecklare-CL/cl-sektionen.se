import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import PostForm from "../../components/personalrummet/PostForm";

import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../../firebase/clientApp";
import { useAuth } from "../../context/AuthContext";

import { validateLink, create_id } from "../../utils/postUtils";

export default function Publicera() {
  const { userData } = useAuth();
  const router = useRouter();

  let today = new Date().toLocaleString().substring(0, 10); // Hämtar dagens datum och sätter som default
  const [prefillData, setPrefillData] = useState({
    title: "",
    subtitle: "",
    image: "",
    body: "",
    tags: [],
    date: today,
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
        date: today,
        publishDate: today,
        author: userData.committee,
      });
    }
  }, [userData, today]);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const [successLink, setSuccessLink] = useState(""); // False/null om inlägget inte har publicerats

  // Skickar allt till databasen
  const handleSubmit = async (data) => {
    setIsPending(true);

    // Validera id/länk
    // Om ej unik be användaren specificera en adress kollar därefter om den är unik
    let link = "";
    try {
      link = await validateLink(data.title);
    } catch (error) {
      console.error("Fel vid valideringen av länken:", error);
      setError("Det gick inte att validera länken/id:et");
      setIsPending(false);
      return;
    }

    if (!link) {
      // Användaren
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
      date: Timestamp.fromDate(new Date(data.date)),
      publishDate: Timestamp.fromDate(new Date(data.publishDate)),
      tags: data.tags,
      committee: userData.committee, // Länkar inlägget med nämnden
      creator: userData.uid, // Länkar inlägget till användaren
    };

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
    if (data.image) {
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
    setIsPending(false);
    setError("");
    setSuccessLink(link);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="contentbody">
      <h1>Personalrummet - Publicera</h1>
      <button
        type="button"
        onClick={() => router.back()}
      >
        Tillbaka
      </button>
      {userData && !successLink && (
        <div className="create">
          <PostForm
            onSubmit={handleSubmit}
            prefill={prefillData}
            buttonText={"Skapa"}
          />
          {isPending && <p>Skapar inlägget...</p>}
          {error && <p>Error: {error}</p>}
        </div>
      )}

      {successLink && (
        <div>
          <p>
            Inlägget är publicerat du hittar på följande länk:{" "}
            <Link
              href={`/aktuellt/${successLink}`}
            >{`www.cl-sektionen.se/aktuellt/${successLink}`}</Link>
            <br />
          </p>
        </div>
      )}
    </div>
  );
}
