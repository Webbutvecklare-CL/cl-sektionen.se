import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Definition from "./Definition";

export default function MarkdownRender({ source, mdData, id }) {
	const [content, setContent] = useState("");

	// Om det kommer in redan inladdad text så renderas den
	useEffect(() => {
		if (mdData) {
			setContent(mdData);
		}
	}, [mdData]);

	// Hämtar markdown filen och sparar textdata i content
	useEffect(() => {
		if (source) {
			console.log("Fetchar");
			fetch(source)
				.then((res) => res.text())
				.then((data) => {
					setContent(data);
				});
		}
	}, [source]);

	const components = {
		def: ({ node, ...props }) => {
			const { term = "", text = "", children } = props;
			return (
				<Definition term={term} text={text}>
					{...children}
				</Definition>
			);
		},
	};

	return (
		//Rehype gör så att man kan skriva html kod i markdown filen
		<div id={id}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={components}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
