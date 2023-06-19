import { React } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import CustomHead from "../../components/CustomHead";
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
import BackButton from "../../components/BackButton";

export default function Post({ postData, postId }) {
  const getDate = (date) => {
    return new Date(date.seconds * 1000).toLocaleDateString("sv");
  };

  const router = useRouter();

  // 404 sida - om det saknas ett inlägg till den angivna länken
  if (!postData) {
    return (
      <div id="contentbody">
        <h1>Hoppsan, här ekar det tomt</h1>
        <p>
          Det finns inget inlägg med id{" "}
          <q>
            <strong>{postId}</strong>
          </q>
          .
        </p>
        <p>
          Detta kan bero på att du angivit ett felaktigt id, inlägget håller på att publiceras eller
          inlägget inte är publikt.
        </p>
        <p>
          <Link href={"/aktuellt"}>Tillbaka till aktuellt & event</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <CustomHead
        metaTitle={`${postData.author} | Sektionen för Civilingenjör och Lärare`}
        description={postData.title}
        image={postData.image || "https://www.cl-sektionen.se/media/img/Post_Placeholder.webp"}
        url={"https://www.cl-sektionen.se/aktuellt/" + postId}
      />
      <div id="contentbody">
        <article className="post">
          <div className="article-head">
            <BackButton page={"aktuellt"}>Aktuellt</BackButton>
          </div>
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
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  // Hämtar all inläggs data
  const docRef = doc(firestore, "posts", params.postId);
  let docSnap = null;
  try {
    docSnap = await getDoc(docRef);
  } catch (error) {
    console.error("Det gick inte att ladda inlägget: ", error.toString());
  }

  let props = { postData: null, postId: params.postId }; // default om inget inlägg finns

  // Kollar om inlägget faktiskt fanns
  if (docSnap && docSnap.exists()) {
    props = { postData: JSON.parse(JSON.stringify(docSnap.data())), postId: params.postId };
  }

  return {
    props,
    revalidate: 60 * 60 * 12, // Som oftast var 12:e timme - utöver de som kommer in när inlägg uppdateras
  };
}

export async function getStaticPaths() {
  const timeNow = Timestamp.now();
  const postRef = collection(firestore, "posts");

  // Skapar en query över de 20 senaste inläggen vilka är troliga att folk vill komma åt
  // Övriga inlägg renderas efter behov
  const publicQuery = query(
    postRef,
    where("visibility", "in", ["public", "hidden"]),
    orderBy("publishDate", "desc"),
    limit(20)
  );

  // Hämtar inläggen från firestore
  let publicDocs = [];
  try {
    publicDocs = await getDocs(publicQuery);
  } catch (error) {
    console.error("Det gick inte att ladda inläggen: ", error.toString());
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
