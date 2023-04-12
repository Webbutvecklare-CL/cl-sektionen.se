import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import { firestore } from "../../firebase/clientApp";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import bg from "../../public/media/img/KTHcover.jpg";

export default function CommitteeFeed({ posts, permission = "" }) {
  const router = useRouter();

  const handleChangePublic = async (e) => {
    // Ändra om inlägget ska vara publikt eller privat
    e.preventDefault();

    const postElem = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
    const postIdx = postElem.getAttribute("post-idx");
    const post = posts[postIdx];
    const postPublicState = post.public !== undefined ? post.public : true; // Det nuvarande läget true = publikt
    console.log("Nuvarande: ", postPublicState);

    // Uppdatera dokumentet
    const postRef = doc(firestore, "posts", post.id);
    try {
      console.log("updateDoc - Synlighetsstatus");
      await updateDoc(postRef, { public: !postPublicState });
      post.public = !postPublicState;
    } catch (error) {
      console.error("Det gick inte att uppdatera synlighetsstatusen", error);
    }
  };

  const handleDeletePost = () => {
    // Gör en verifiering att användaren vill ta bort inlägget
    // Ta bort inlägget
  };

  return (
    <div className="committee-feed feed-preview">
      {posts.map((post, idx) => {
        return (
          <Link href={`/personalrummet/redigera/${post.id}`} key={post.id} post-idx={idx}>
            <div className="post-preview">
              <div className="options">
                <div>
                  <div onClick={()=>{router.push(`/aktuellt/${post.id}`)}}>
                    <i className="fa-regular fa-solid fa-arrow-up-right-from-square"></i>
                  </div>
                  <div onClick={handleChangePublic}>
                    {(post.public || post.public === undefined) && (
                      <i className="fa-regular fa-eye"></i>
                    )}
                    {!post.public && <i className="fa-regular fa-eye-slash"></i>}
                  </div>

                  {permission === "admin" && (
                    <div href={""} onClick={handleDeletePost}>
                      <i className="fa-regular fa-trash"></i>
                    </div>
                  )}
                </div>
              </div>
              <div className="image">
                {post.image && <Image src={post.image} width={240} height={200} alt="Post image" />}
                {!post.image && <Image src={bg} alt="Bakgrundsbild KTH" />}
              </div>
              <div className="post-meta">
                <h2>{post.title}</h2>
                {/*här fanns post.author förut, kan läggas in igen om plats finns*/}
                <div>{/* <p>{post.publishDate.toDate().toLocaleDateString("sv")}</p> */}</div>
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
        );
      })}
    </div>
  );
}
