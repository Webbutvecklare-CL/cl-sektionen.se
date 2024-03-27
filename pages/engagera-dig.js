import React from "react";
import Link from "next/link";
import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

export default function Engagera({ contents }) {
	return (
		<div id="contentbody">
			<h1 id="page-title">Engagera dig</h1>
			<h3>På sidan</h3>
			<ul>
				<li>
					<Link href={"#engagera-dig"}>Att engagera sig</Link>
				</li>
				<li>
					<Link href={"#anordna-evenemang"}>Anordna evenemang och gasquer</Link>
				</li>
			</ul>
			<MarkdownRender mdData={contents["engagera-dig"]} id="engagera-dig" />
			<br />
			<MarkdownRender
				mdData={contents["anordna-evenemang"]}
				id="anordna-evenemang"
			/>
		</div>
	);
}

export async function getStaticProps() {
	const contents = getContentData("engagera-dig");
	return {
		props: {
			contents,
		},
	};
}
