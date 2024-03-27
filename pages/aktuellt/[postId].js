import { React } from "react";
import Link from "next/link";
import CustomHead from "../../components/CustomHead";
import { app } from "../../firebase/clientApp";
import {
	getFirestore,
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
const firestore = getFirestore(app);

import PostComponent from "@/components/PostComponent";

import { useRouter } from "next/router";

export default function Post({ postData, postId }) {
	const { query } = useRouter();

	// 404 sida - om det saknas ett inlägg till den angivna länken
	if (!postData) {
		return (
			<div id="contentbody" className="wideContent">
				<h1>Hoppsan, här ekar det tomt</h1>
				<p>
					Det finns inget inlägg med id{" "}
					<q>
						<strong>{postId}</strong>
					</q>
					.
				</p>
				<p>
					Detta kan bero på att du angivit ett felaktigt id, inlägget håller på
					att publiceras eller inlägget inte är publikt.
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
				metaTitle={`${postData.title} | ${postData.author}`}
				description={postData.subtitle}
				image={
					postData.image ||
					"https://www.cl-sektionen.se/media/img/Post_Placeholder.webp"
				}
				url={`https://www.cl-sektionen.se/aktuellt/${postId}`}
			/>
			<div id="contentbody" className="wideContent">
				<PostComponent
					postData={postData}
					backPath={query.r ? "history" : "aktuellt"}
				/>
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
	if (docSnap?.exists()) {
		props = {
			postData: JSON.parse(JSON.stringify(docSnap.data())),
			postId: params.postId,
		};
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
		limit(20),
	);

	// Hämtar inläggen från firestore
	let publicDocs = [];
	try {
		publicDocs = await getDocs(publicQuery);
	} catch (error) {
		console.error("Det gick inte att ladda inläggen: ", error.toString());
	}

	// Plockar ut id:et
	const postIdList = [];
	publicDocs.forEach((doc) => {
		postIdList.push({ params: { postId: doc.id } });
	});

	return {
		paths: postIdList,
		fallback: true, // True gör att inlägg som inte är pre-renderade renderas vid request
	};
}
