import Highlighter from "react-highlight-words";
import React from "react";

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
