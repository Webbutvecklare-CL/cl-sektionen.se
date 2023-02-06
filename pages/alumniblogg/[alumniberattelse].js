import React from 'react';
import { useRouter } from 'next/router';
import MarkdownRender from '../../components/MarkdownRender';
import { readdirSync } from 'fs';
import { join } from 'path';

function Alumniberattelse({ alumniberattelse }) {
    // För att kunna läsa länkadressen
    // const router = useRouter();
    // const { alumniberattelse } = router.query; // Länken är densamma som filnamnet
    return (
        <div id="contentbody">
            <h1>Alumniblogg</h1>
            <article>
                <MarkdownRender
                    source={`../content/alumniblogg/${alumniberattelse.alumniberattelse}.md`}
                />
            </article>
        </div>
    );
}
export default Alumniberattelse;

export async function getStaticProps(context) {
    const { params } = context;
    return {
        props: { alumniberattelse: params }, // will be passed to the page component as props
    };
}

export async function getStaticPaths() {
    const PATH = join(process.cwd(), 'public/content/alumniblogg');
    const paths = readdirSync(PATH)
        .map((path) => path.replace(/\.mdx?$/, ''))
        .map((blogid) => ({ params: { alumniberattelse: blogid } }));

    return {
        paths,
        fallback: false, // can also be true or 'blocking'
    };
}
