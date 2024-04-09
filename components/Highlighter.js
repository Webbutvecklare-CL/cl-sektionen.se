import React from "react";
import Highlighter from "react-highlight-words";

export default function TextHighlighter({ search, text }) {
	return (
		<Highlighter
			highlightClassName="highlighted"
			searchWords={[search]}
			autoEscape={true}
			textToHighlight={text}
		/>
	);
}
