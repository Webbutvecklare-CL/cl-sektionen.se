import React from 'react';
import { useRouter } from 'next/router';
import MarkdownRender from '../../components/MarkdownRender';
function Reseberattelse() {
    const router = useRouter();
    const { reseberattelse } = router.query;
    return (
        <div id="contentbody">
            <h1>Reseberättelse</h1>
            <article className="rese">
                <MarkdownRender
                    source={`../content/reseberattelser/${reseberattelse}.md`}
                />
            </article>
        </div>
    );
}
export default Reseberattelse;
