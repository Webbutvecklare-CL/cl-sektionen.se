import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import { firestore, storage } from "../../firebase/clientApp";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";

import { useAuth } from "../../context/AuthContext";
import { revalidate } from "../../utils/server";

import bg from "../../public/media/img/KTHcover.jpg";

import styles from "../../styles/personalrummet.module.css";
import feed from "../../styles/feed-preview.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function CommitteeFeed({ posts, permission = "" }) {
  // För att feedet ska uppdateras när man klickar på ex ögat
  const [postList, setPostList] = useState([]);

  const { user } = useAuth();

  // För att postList ska få data när komponenten laddas in
  useEffect(() => {
    setPostList(posts);
  }, [posts]);

  const handleChangePublic = async (e) => {
    // Ändra om inlägget ska vara publikt eller privat
    e.preventDefault();

    const postElem = e.currentTarget.parentElement.parentElement.parentElement;
    const postIdx = postElem.getAttribute("post-idx");
    const post = posts[postIdx];
    const postVisibility = post.visibility !== undefined ? post.visibility : "public"; // Det nuvarande läget true = publikt

    // Uppdatera dokumentet
    const postRef = doc(firestore, "posts", post.id);
    // console.log("Innan:", postVisibility);
    try {
      console.log("updateDoc - Synlighetsstatus");
      await updateDoc(postRef, { visibility: postVisibility === "public" ? "private" : "public" });
      post.visibility = postVisibility === "public" ? "private" : "public";

      // Uppdaterar post med ny status
      setPostList((prevState) => {
        const posts = [...prevState];
        posts[postIdx] = post;
        return posts;
      });
      // Försöker revalidate
      try {
        // Revalidate:ar hemsidan
        revalidate(user, { index: true, aktuellt: true, post: post.id });
      } catch (error) {
        console.error("Fel vid revalidate:", error);
      }
    } catch (error) {
      console.error("Det gick inte att uppdatera synlighetsstatusen", error);
    }
  };

  const handleDeletePost = async (postId) => {
    // Gör en verifiering att användaren vill ta bort inlägget - Gör med dialog ruta
    alert("Är du säker på att du vill ta bort inlägget?");

    // Ta bort inlägget
    const postRef = doc(firestore, "posts", postId);
    try {
      await deleteDoc(postRef);
      console.log("Inlägget borttaget:", postId);
    } catch (error) {
      console.error("Det gick inte att ta bort inlägget", error);
    }

    try {
      const folderRef = ref(storage, `posts/${postId}`);
      const allImages = await listAll(folderRef);
      allImages.items.forEach(async (itemRef) => {
        await deleteObject(itemRef);
        console.log("Bild borttagen:", itemRef.name);
      });
    } catch (error) {
      console.error("Det gick inte att ta bort bilderna", error);
      return;
    }

    // Uppdatera klienten utan att göra en ny get request
    setPostList((prevState) => {
      const posts = [...prevState];
      const postIdx = posts.findIndex((post) => post.id === postId);
      posts.splice(postIdx, 1);
      return posts;
    });

    // Försöker revalidate
    try {
      // Revalidate:ar hemsidan
      revalidate(user, { index: true, aktuellt: true, post: postId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`${styles.committeeFeed} ${styles.preview} ${feed.preview}`}>
      {postList.map((post, idx) => {
        return (
          <div className={`${styles.postWrapper} ${feed.postWrapper}`} key={post.id} post-idx={idx}>
            <div className={styles.options}>
              <div>
                <Link href={`/aktuellt/${post.id}`} target={"_blank"}>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </Link>
                <div onClick={handleChangePublic}>
                  <FontAwesomeIcon icon={post.visibility !== "public" ? faEyeSlash : faEye} />
                </div>

                {permission === "admin" && (
                  <div
                    href={""}
                    onClick={() => {
                      handleDeletePost(post.id);
                    }}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </div>
                )}
              </div>
            </div>
            <Link href={`/personalrummet/redigera/${post.id}`}>
              <div className={`${styles.postPreview} ${feed.postPreview}`}>
                <div className={feed.image}>
                  {post.image && (
                    <Image src={post.image} width={240} height={200} alt="Post image" />
                  )}
                  {!post.image && <Image src={bg} alt="Bakgrundsbild KTH" />}
                </div>
                <div>
                  <h2>{post.title}</h2>
                </div>
                <div className={feed.postContent}>
                  <p className={feed.subtitle}>{post.subtitle}</p>
                  {/* Parse för att formatera om html koden till html element
                                  Sanitize för att göra det lite mer stilrent i preview dvs inga styles*/}
                  <div className={feed.body}>
                    <p>
                      {parse(
                        sanitizeHtml(post.body, {
                          allowedTags: [],
                        })
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
