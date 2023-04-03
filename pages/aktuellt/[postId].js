import { React, useState, useEffect } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import { firestore } from "../../firebase/clientApp";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  getDocs,
} from "firebase/firestore";

export default function Post({ postData }) {
  console.log(postData);

  const [post, setPost] = useState(postData);

  const getDate = (date) => {
    return new Date(date.seconds * 1000).toLocaleDateString("sv");
  };

  return (
    <div id="contentbody">
      {post && (
        <article className="post">
          <div className="head">
            <div className="image-container">
              {post.image && <Image src={post.image} width={400} height={400} alt="Post bild" />}
            </div>
            <div className="info">
              <h1 className="title">{post.title}</h1>
              <h2>{post.subtitle}</h2>
              <p className="meta">
                Publicerad {getDate(post.publishDate)} av {post.author}
              </p>
            </div>
          </div>

          <hr />
          <div>{parse(post.body)}</div>
        </article>
      )}
      {!post && <p>Inlägget saknas!</p>}
    </div>
  );
}

export async function getStaticProps({ params }) {
  const docRef = doc(firestore, "posts", params.postId);
  const docSnap = await getDoc(docRef);

  return { props: { postData: JSON.parse(JSON.stringify(docSnap.data())) } };
}

export async function getStaticPaths() {
  const timeNow = Timestamp.now();
  const postRef = collection(firestore, "posts");

  // Skapar en query över de 20 senaste inläggen vilka är troliga att folk vill komma åt
  // Övriga inlägg renderas efter behov
  const publicQuery = query(
    postRef,
    where("publishDate", "<", timeNow),
    orderBy("publishDate", "desc"),
    limit(20)
  );

  // Hämtar inläggen från firestore
  const publicDocs = await getDocs(publicQuery);

  // Plockar ut id:et
  let postIdList = [];
  publicDocs.forEach((doc) => {
    postIdList.push({ params: { postId: doc.id } });
  });

  return {
    paths: postIdList,
    fallback: true, // True gör att inlägg som inte är pre-renderade renderas vid request
  };
}
