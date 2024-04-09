import React from "react";
import MarkdownRender from "../components/MarkdownRender";

//Create <pagename>.js file in "pages" directory. Url will become cl-sektionen.se/<pagename>
export default function Page({ contents }) {
	return (
		<div id="contentbody">
			<h1 id="page-title">{/* Title of page goes here */}</h1>
			{/* Page contents go here*/}
		</div>
	);
}

export async function getStaticProps() {
	const contents = getContentData(/* Content name */);
	return {
		props: {
			contents,
		}, // will be passed to the page component as props
	};
}
