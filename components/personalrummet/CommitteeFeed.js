import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import { firestore } from "../../firebase/clientApp";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { revalidate } from "../../utils/server";

import bg from "../../public/media/img/KTHcover.jpg";

export default function CommitteeFeed({ posts, permission = "" }) {
  // För att feedet ska uppdateras när man klickar på ex ögat
  const [postList, setPostList] = useState([]);

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
        revalidate("all");
        revalidate("post", post.id);
      } catch (error) {
        console.error("Fel vid revalidate:", error);
      }
    } catch (error) {
      console.error("Det gick inte att uppdatera synlighetsstatusen", error);
    }
  };

  const handleDeletePost = () => {
    // Gör en verifiering att användaren vill ta bort inlägget
    // Ta bort inlägget
    console.log("Ta bort inlägg");
  };

  return (
    <div className="committee-feed feed-preview">
      {postList.map((post, idx) => {
        return (
          <div className="post-wrapper" key={post.id} post-idx={idx}>
            <div className="options">
              <div>
                <Link href={`/aktuellt/${post.id}`} target={"_blank"}>
                  <i className="fa-regular fa-solid fa-arrow-up-right-from-square"></i>
                </Link>
                <div onClick={handleChangePublic}>
                  <i
                    className={`fa-regular fa-eye${
                      post.visibility !== "public" ? "-slash" : ""
                    }`}></i>
                </div>

                {permission === "admin" && (
                  <div href={""} onClick={handleDeletePost}>
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                )}
              </div>
            </div>
            <Link href={`/personalrummet/redigera/${post.id}`}>
              <div className="post-preview">
                <div className="image">
                  {post.image && (
                    <Image src={post.image} width={240} height={200} alt="Post image" />
                  )}
                  {!post.image && <Image src={bg} alt="Bakgrundsbild KTH" />}
                </div>
                <div>
                  <h2>{post.title}</h2>
                </div>
                <div className="post-content">
                  <p className="subtitle">{post.subtitle}</p>
                  {/* Parse för att formatera om html koden till html element
                                  Sanitize för att göra det lite mer stilrent i previewn dvs inga styles*/}
                  <div className="body">
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
