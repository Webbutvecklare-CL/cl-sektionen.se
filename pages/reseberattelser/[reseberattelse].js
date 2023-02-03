import React from 'react';
import { useRouter } from 'next/router';
import MarkdownRender from '../../components/MarkdownRender';
import { join } from 'path';
import { readdirSync } from 'fs';
function Reseberattelse({ reseberattelse }) {
    return (
        <div id="contentbody">
            <h1>Reseberättelse</h1>
            <article className="rese">
                <MarkdownRender
                    source={`../content/reseberattelser/${reseberattelse.reseberattelse}.md`}
                />
            </article>
        </div>
    );
}
export default Reseberattelse;

export async function getStaticProps(context) {
    const { params } = context;
    return {
        props: { reseberattelse: params }, // will be passed to the page component as props
    };
}

export async function getStaticPaths() {
    const PATH = join(process.cwd(), 'public/content/reseberattelser');
    const paths = readdirSync(PATH)
        .map((path) => path.replace(/\.mdx?$/, ''))
        .map((blogid) => ({ params: { reseberattelse: blogid } }));

    return {
        paths,
        fallback: false, // can also be true or 'blocking'
    };
}
