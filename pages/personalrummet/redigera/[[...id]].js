import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { logEvent } from "firebase/analytics";
import { getFirestore, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { app } from "../../../firebase/clientApp";
const storage = getStorage(app);
const firestore = getFirestore(app);

import PostForm from "../../../components/personalrummet/PostForm";
import BackButton from "@/components/BackButton";
import { useAuth } from "../../../context/AuthContext";

import { revalidate } from "../../../utils/server";

export default function EditPost() {
  // Hämtar id från länken om det finns
  const router = useRouter();
  const { id } = router.query;

  const { user, userData } = useAuth();

  // Input och "ren" id
  const [postLink, setPostLink] = useState("");
  const [postId, setPostId] = useState("");

  // För skapandet
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // För inladdningen av inlägget
  const [loading, setLoading] = useState(false);
  const [prefill, setPrefill] = useState();

  useEffect(() => {
    if (id) {
      setPostLink(id);
      loadPost(id[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Hämtar angivna inlägget
  const loadPost = async (pid) => {
    // Hämtar id från input om ej specificerat
    if (!pid) {
      pid = ("/" + postLink).split("/").pop();
    }

    if (!pid) {
      setError("Du måste skriva in en länk eller inläggs-id.");
      return;
    }
    console.log("getDoc - Laddar inlägg redigera");
    setLoading(true);

    const postRef = doc(firestore, "posts", pid);

    getDoc(postRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const postData = docSnap.data();

          const url_token = postData.image.split("?");
          const url = url_token[0].split("/");
          const fileName = url[url.length - 1].split("%2F")[2];

          const data = {
            title: postData.title,
            subtitle: postData.subtitle,
            image: { url: postData.image, name: fileName },
            body: postData.body,
            tags: postData.tags,
            author: postData.author,
            committee: postData.committee,
            authorCommittee: postData.committee,
            link: pid,
            visibility: postData.visibility,
          };

          if (postData.type) {
            data.type = postData.type;

            if (postData.type === "event") {
              data.startDateTime = postData.startDateTime.toDate().toLocaleDateString("sv");
              data.endDateTime = postData.endDateTime.toDate().toLocaleDateString("sv");
            }
          }

          if (postData.startDateTime) {
            data.startDateTime = postData.startDateTime.toDate().toLocaleString().substring(0, 16);
          }
          if (postData.startDateTime) {
            data.endDateTime = postData.endDateTime.toDate().toLocaleString().substring(0, 16);
          }

          setPostId(pid);
          setPrefill(data);
          setLoading(false);
          setError("");
        } else {
          setLoading(false);
          setError("Inlägget fanns ej, kontrollera att du har angett en giltig länk.");
          console.error(
            `Fel vid inladdningen av inlägget: Det finns inget inlägg med id ${postId}`
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("Det gick inte att ladda in inlägget. Kontakta webbansvariga.");
        console.error("Fel vid inladdningen av inlägget: ", err);
      });
  };

  // Skickar allt till databasen
  const handleFormData = async (data) => {
    setIsPending(true);
    let postData = {};
    // Kollar igenom vilka fält som blivit uppdaterade
    for (let key in data) {
      // Kollar om fälten blivit uppdaterade

      // Om det är en bild så ska den få lite särbehandling senare
      // Link ska aldrig uppdateras och sparas inte heller
      // Data som inte sparas i inlägget/dokumentet
      const jumpKeys = [
        "tags",
        "image",
        "link",
        "publishInCalendar",
        "sendNotification",
        "authorCommittee",
      ];
      if (jumpKeys.includes(key)) {
        continue;
      }

      if (data[key] != prefill[key]) {
        // Datumen sparas som en string och måste göras om till firebase date
        if (key.includes("date") || key.includes("startDateTime") || key.includes("endDateTime")) {
          postData[key] = Timestamp.fromDate(new Date(data[key]));
        } else {
          postData[key] = data[key];
        }
      }
    }

    if (JSON.stringify(data.tags) != JSON.stringify(prefill.tags)) {
      postData.tags = data.tags;
    }

    const committee = userData.permission === "admin" ? data.authorCommittee : userData.committee;
    if (committee != prefill.authorCommittee) {
      postData.committee = committee;
    }

    const postRef = doc(firestore, "posts", postId);
    try {
      await updateDoc(postRef, postData);
      console.log("Inlägget är uppdaterat!");
    } catch (err) {
      setError("Kunde inte ladda upp inlägget");
      setIsPending(false);
      alert("Kunde inte ladda upp inlägget");
      console.error(err);
      return;
    }

    // Kollar om bilden blivit uppdaterad
    if (data.image.name !== prefill.image.name) {
      // Tar bort bilden
      const oldImageRef = ref(storage, `posts/${postId}/${decodeURIComponent(prefill.image.name)}`);
      try {
        if (prefill.image.name) {
          console.log("delete - Raderar gammal bild");
          await deleteObject(oldImageRef);
        }
      } catch (err) {
        console.error(err);
        setIsPending(false);
        setError(
          "Kunde inte radera den tidigare bilden, uppladdningen avbryts. Observera att de övriga fälten kan ha uppdaterats."
        );
        return;
      }

      // Ladda upp den nya bilden om det finns någon
      let downloadUrl = "";
      if (data.image.name) {
        // Laddar upp
        try {
          console.log("upload - Laddar upp bilden.");
          const imageRef = ref(storage, `posts/${postId}/${data.image.name}`);
          await uploadBytes(imageRef, data.image);
          downloadUrl = await getDownloadURL(imageRef);
        } catch (err) {
          console.error(err);
          setIsPending(false);
          setError(
            "Kunde inte ladda upp bilden, uppladdningen avbryts. Observera att de övriga fälten kan ha uppdaterats."
          );
          return;
        }
      }
      // Uppdatera fältet i inlägget med länken till bilden alt tar bort den om ingen ny laddades upp
      try {
        console.log("updateDoc - Uppdatera bildlänken");
        await updateDoc(postRef, {
          image: downloadUrl,
        });
      } catch (err) {
        console.error(err);
        setIsPending(false);
        setError(
          "Det gick inte att uppdatera bildreferensen i inlägget. Bilden kan dock ha blivit uppladdad."
        );
        return;
      }
    }
    setIsPending(false);
    setError("");
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/personalrummet/redigera");

    // Försöker revalidate
    try {
      // Revalidate:ar hemsidan
      revalidate(user, { index: true, aktuellt: true, post: postId });
    } catch (error) {
      console.error(error);
    }

    const { getAnalytics } = await import("../../../firebase/clientApp");
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, "post_update", { updated_keys: Object.keys(postData) });
    }
  };

  // Om man klickar på enter
  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      loadPost();
    }
  };

  return (
    <div id="contentbody">
      <BackButton page="personalrummet">Personalrummet</BackButton>
      <h1>Personalrummet - Redigera</h1>
      {!success && (
        <div className="create">
          {!prefill && (
            <div>
              <input
                type="text"
                onChange={(e) => {
                  setPostLink(e.target.value);
                }}
                value={postLink}
                onKeyDown={handleKeypress}
              />
              <button
                onClick={() => {
                  loadPost();
                }}>
                Hämta inlägg
              </button>
            </div>
          )}
          <div>
            {loading && <p>Hämtar inlägg...</p>}
            {!loading && prefill && (
              <div>
                <PostForm onSubmit={handleFormData} prefill={prefill} editMode={true} />
                {isPending && <p>Uppdaterar inlägg...</p>}
                {error && <p>Error: {error}</p>}
              </div>
            )}
            {error && <p>{error}</p>}
          </div>
        </div>
      )}
      {success && (
        <div>
          <p>
            Inlägget är uppdaterat du hittar på följande länk:{" "}
            <Link href={`/aktuellt/${postId}`}>{`www.cl-sektionen.se/aktuellt/${postId}`}</Link>
            <br />
            <i>
              Observera att endast förtroendevalda som är inloggade kan se inlägget om det har ett
              senare publikationsdatum.
            </i>
            <br />
          </p>
        </div>
      )}
    </div>
  );
}
