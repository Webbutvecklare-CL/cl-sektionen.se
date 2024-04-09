import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import BackButton from "../../components/BackButton";
import MarkdownRender from "../../components/MarkdownRender";

export default function Alumniberattelse({ content }) {
	return (
		<div id="contentbody" className="wideContent">
			<article className="alumniblogg">
				<div className="article-head">
					<BackButton page={"alumniblogg"}>Alumniblogg</BackButton>
				</div>
				<MarkdownRender mdData={content} />
			</article>
		</div>
	);
}

export async function getStaticProps(context) {
	// Skickar med filnamnet som en prop vilket gör att next kan serverside rendera alla blogginlägg
	const { params } = context;

	// Hämtar all text
	const content = readFileSync(
		`content/alumniblogg/${params.alumniberattelse}.md`,
		"utf8",
	);

	return {
		props: {
			alumniberattelse: params.alumniberattelse,
			content: JSON.parse(JSON.stringify(content)),
		}, // will be passed to the page component as props
	};
}

export async function getStaticPaths() {
	// Hämtar alla filnamn från mappen med blogginläggen
	const PATH = join(process.cwd(), "content/alumniblogg");
	const paths = readdirSync(PATH)
		.map((path) => path.replace(/\.mdx?$/, ""))
		.map((blogid) => ({ params: { alumniberattelse: blogid } }));

	return {
		paths,
		fallback: false, // can also be true or 'blocking'
	};
}
