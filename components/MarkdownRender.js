import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownRender({ source }) {
    let [content, setContent] = useState({ md: '' });

    useEffect(() => {
        fetch(source)
            .then((res) => res.text())
            .then((md) => {
                setContent({ md });
            });
    }, [source]);

    return (
        <div>
            <ReactMarkdown>{content.md}</ReactMarkdown>
        </div>
    );
}
export default MarkdownRender;
