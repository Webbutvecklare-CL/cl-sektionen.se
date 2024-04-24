import MarkdownRender from "@/components/MarkdownRender";
import { getContentData } from "@/utils/contents";
import React from "react";

export default function Samarbete({ contents }) {
	return (
		<div id="contentbody">
			<h1 id="page-title">Om oss</h1>
			<MarkdownRender mdData={contents.sektionen} />
			<MarkdownRender mdData={contents.programmet} />
			<MarkdownRender mdData={contents.inriktningar} />
			<MarkdownRender mdData={contents.kpu} />
		</div>
	);
}

export async function getStaticProps() {
	const contents = getContentData("om-oss");
	return {
		props: {
			contents,
		}, // will be passed to the page component as props
	};
}
