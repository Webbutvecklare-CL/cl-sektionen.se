import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function MarkdownRender({ source, mdData }) {
  let [content, setContent] = useState("");

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

  return (
    //Rehype gör så att man kan skriva html kod i markdown filen
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
