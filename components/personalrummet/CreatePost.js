import Link from "next/link";
import React, { useState } from "react";

import PostForm from "./PostForm";

import { doc, setDoc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../../firebase/clientApp";

export default function CreatePost({ user }) {
  let today = new Date().toLocaleString().substring(0, 10); // Hämtar dagens datum och sätter som default
  const prefillData = {
    title: "",
    subtitle: "",
    image: "",
    body: "",
    tags: [],
    date: today,
    publishDate: today,
    author: user.committee,
  };

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
      committee: user.committee, // Länkar inlägget med nämnden
      creator: user.uid, // Länkar inlägget till användaren
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

  if (successLink) {
    return (
      <div>
        <p>
          Inlägget är publicerat du hittar på följande länk:{" "}
          <Link
            href={`/aktuellt/${successLink}`}
          >{`www.cl-sektionen.se/aktuellt/${successLink}`}</Link>
          <br />
          <i>
            Observera att endast förtroendevalda som är inloggade kan se inlägget om det har ett
            senare publikationsdatum.
          </i>
          <br />
        </p>
      </div>
    );
  }

  return (
    <div className="create">
      {user && (
        <div>
          <PostForm onSubmit={handleSubmit} prefill={prefillData} buttonText={"Skapa"} />
          {isPending && <p>Skapar inlägget...</p>}
          {error && <p>Error: {error}</p>}
        </div>
      )}
    </div>
  );
}

function create_id(title) {
  title = title.toLowerCase();
  title = title.replace(/[åä]/g, "a");
  title = title.replace(/ö/g, "o");
  title = title.replace(/([\W_]+){1,}/g, "-"); // Tar bort alla konstiga tecken
  title = title.replace(/[ ]{1,}/g, "-"); // Byter ut alla mellanslag till -
  title = title.replace(/-*$/, ""); // Tar bort alla bindestreck i slutet

  return title;
}

async function validateLink(title) {
  let exist = true;
  let unique_link = create_id(title);
  while (exist) {
    console.log("getDoc - Validera länken");
    try {
      const docSnap = await getDoc(doc(firestore, "posts", unique_link));
      if (docSnap.exists()) {
        unique_link = prompt("Ange en unik adress:", "unik-adress");
        if (unique_link == null || unique_link == "") {
          //Användaren avbröt
          return false;
        } else {
          //Gör något test så länken faktiskt fungerar
          unique_link = create_id(title);
        }
      } else {
        // Adressen var unik -> fortsätt försöka skicka data
        exist = false;
      }
    } catch (error) {
      throw error;
    }
  }
  return unique_link;
}
