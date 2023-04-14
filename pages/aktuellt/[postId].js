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
  const getDate = (date) => {
    return new Date(date.seconds * 1000).toLocaleDateString("sv");
  };

  return (
    <div id="contentbody">
      {postData && (
        <article className="post">
          <div className="head">
            <div className="image-container">
              {postData.image && (
                <Image src={postData.image} width={400} height={400} alt="Post bild" />
              )}
            </div>
            <div className="info">
              <h1 className="title">{postData.title}</h1>
              <h2>{postData.subtitle}</h2>
              <p className="meta">
                Publicerad {getDate(postData.publishDate)} av {postData.author}
              </p>
            </div>
          </div>

          <hr />
          <div>{parse(postData.body)}</div>
        </article>
      )}
      {!postData && <p>Inlägget saknas eller håller på att laddas upp!</p>}
    </div>
  );
}

export async function getStaticProps({ params }) {
  // Hämtar all inläggs data
  const docRef = doc(firestore, "posts", params.postId);
  let docSnap = null;
  try {
    docSnap = await getDoc(docRef);
  } catch (error) {
    console.error("Det gick inte att ladda inlägget: ", error);
  }

  // Kollar om inlägget faktiskt fanns
  if (docSnap.exists()) {
    return { props: { postData: JSON.parse(JSON.stringify(docSnap.data())) } };
  } else {
    return { props: { postData: null } };
  }
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
  let publicDocs = [];
  try {
    publicDocs = await getDocs(publicQuery);
  } catch (error) {
    console.error("Det gick inte att ladda inläggen: ", error);
  }

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
