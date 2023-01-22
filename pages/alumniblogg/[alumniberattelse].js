import React from 'react';
import { useRouter } from 'next/router';
import MarkdownRender from '../../components/MarkdownRender';
function Alumniberattelse() {
    // För att kunna läsa länkadressen
    const router = useRouter();
    const { alumniberattelse } = router.query; // Länken är densamma som filnamnet
    return (
        <div id="contentbody">
            <h1>Alumniblogg</h1>
            <article>
                <MarkdownRender
                    source={`../content/alumniblogg/${alumniberattelse}.md`}
                />
            </article>
        </div>
    );
}
export default Alumniberattelse;
