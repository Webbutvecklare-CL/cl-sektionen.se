import React from 'react';
import { useRouter } from 'next/router';
import MarkdownRender from '../../components/MarkdownRender';
function Alumniberattelse() {
    const router = useRouter();
    const { alumniberattelse } = router.query;
    return (
        <div id="contentbody">
            <h1>Alumniblogg</h1>
            <article>
                <MarkdownRender
                    source={`../content/alumniberattelser/${alumniberattelse}.md`}
                />
            </article>
        </div>
    );
}
export default Alumniberattelse;
