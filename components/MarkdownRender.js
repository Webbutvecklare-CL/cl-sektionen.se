import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

function MarkdownRender({ source }) {
    let [content, setContent] = useState('');

    // Hämtar markdown filen och sparar textdata i content
    useEffect(() => {
        fetch(source)
            .then((res) => res.text())
            .then((data) => {
                setContent(data);
            });
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
export default MarkdownRender;
