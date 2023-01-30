import React from 'react';
import MarkdownRender from '../components/MarkdownRender';

function VFU() {
    return (
        <div id="contentbody">
            <h1>VFU</h1>
            <article>
                <MarkdownRender source={'./content/vfu.md'} />
            </article>
        </div>
    );
}
export default VFU;
