import React from 'react';
import MarkdownRender from '../../components/MarkdownRender';
import { readdirSync } from 'fs';
import { join } from 'path';

function Alumniberattelse({ alumniberattelse }) {
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
    // Skickar med filnamnet som en prop vilket gör att next kan serverside rendera alla blogginlägg
    const { params } = context;
    return {
        props: { alumniberattelse: params }, // will be passed to the page component as props
    };
}

export async function getStaticPaths() {
    // Hämtar alla filnamn från mappen med blogginläggen
    const PATH = join(process.cwd(), 'public/content/alumniblogg');
    const paths = readdirSync(PATH)
        .map((path) => path.replace(/\.mdx?$/, ''))
        .map((blogid) => ({ params: { alumniberattelse: blogid } }));

    return {
        paths,
        fallback: false, // can also be true or 'blocking'
    };
}
