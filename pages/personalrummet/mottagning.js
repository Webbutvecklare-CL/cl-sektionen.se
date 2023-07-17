import { useState } from "react";

import {
  doc,
  collection,
  setDoc,
  getDocs,
  updateDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { useAuth } from "../../context/AuthContext";

import { sendNotification } from "../../utils/server";

import FeedItem from "../../components/mottagning/FeedItem";

import styles from "../../styles/personalrummet/mottagning.module.css";
import { feed as feed_style } from "../../styles/mottagning/mottagning.module.css";

export default function Mottagning() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [posts, setPosts] = useState([]);

  const { userData } = useAuth();

  const uploadPost = () => {
    setIsPending(true);

    if (!title || !content) {
      setError("Du måste fylla i alla fält");
      setIsPending(false);
      return;
    }

    // Skickar data
    let postData = {
      title,
      content,
      publishDate: Timestamp.fromDate(new Date()),
      creator: userData.uid, // Länkar inlägget till användaren
      visibility: "public",
    };

    const mottagningsPostsRef = doc(collection(firestore, "mottagningsPosts"));

    setDoc(mottagningsPostsRef, postData)
      .then(console.log("Inlägget är publicerat!"))
      .catch((err) => {
        setError("Kunde inte ladda upp inlägget");
        setIsPending(false);
        alert("Kunde inte ladda upp inlägget");
        console.error("Fel vid uppladdningen av inlägget: ", err);
        return;
      });

    // Skickar notis om valt
    // if (data.sendNotification) {
    //   sendNotification(user, { type: "post", postId: link });
    // }

    setPosts([postData, ...posts]);

    setTitle("");
    setContent("");
    setIsPending(false);
    setMessage("Inlägget är publicerat!");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useState(() => {
    // Hämtar inlägg
    const mottagningsPostsRef = collection(firestore, "mottagningsPosts");
    const q = query(mottagningsPostsRef, where("visibility", "==", "public"));
    getDocs(q).then((docs) => {
      let posts = [];
      docs.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        posts.push(data);
      });
      posts.sort((a, b) => b.publishDate.seconds - a.publishDate.seconds);
      setPosts(posts);
    });
  }, []);

  return (
    <div id="contentbody">
      <h1>Personalrummet - Mottagning</h1>
      <h2>Ladda upp nytt inlägg</h2>
      <div className={styles.inputPanel}>
        <p>Title till inlägget:</p>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <p>Inlägget:</p>
        <textarea
          cols="30"
          rows="4"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}></textarea>
        <button onClick={uploadPost}>Ladda upp</button>
        {isPending && <p>Laddar upp inlägget...</p>}
        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
      </div>
      <h2>Tidigare inlägg</h2>
      <div className={feed_style}>
        {posts.map((item, index) => (
          <FeedItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
