import React from 'react';
import MarkdownRender from '../components/MarkdownRender';

function VFU() {
    return (
        <div id="contentbody">
            <article>
                <MarkdownRender source={'./content/vfu.md'} />
            </article>
        </div>
    );
}
export default VFU;
