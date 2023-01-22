import parse from 'html-react-parser';

export default function Post({ post, postId }) {
    return (
        <div id="contentbody">
            {post && (
                <article>
                    <h2>{post.title}</h2>
                    <h3>{post.subtitle}</h3>
                    <p>Publicerad av {post.author}</p>
                    <p>Datum {post.date}</p>
                    <div>{parse(post.body)}</div>
                </article>
            )}
        </div>
    );
}

export async function getServerSideProps({ params }) {
    const postId = params.postId;

    // const post = await fetch(`path-to-posts${postId}`).then((res) =>
    //     res.json()
    // );
    const post = {
        title: 'Gr8Bibloteket',
        subtitle: 'Önska böcker Till gr8ns bibliotek!',
        body: `I Gr8n har <strong>sektionen</strong> en samling kurslitteratur. Nu vill vi i studienämnden utöka denna samling så att den innehåller böcker som är relevanta för oss som går utbildningen just nu. Därför vill vi veta vilka böcker du saknar i Gr8n. (Ni kan även sälja/donera relevant kurslitteratur till biblioteket <3)
        https://docs.google.com/forms/d/e/1FAIpQLSefGeuMcTTPxl1RgCktD3XXHDWut1U0dOJrf-kjk0BHLWSngg/viewform`,
        author: 'Studienämnden',
        tags: ['Gr8an', 'Viktigt'],
        date: '12/20/2022',
        publicationDate: '12/20/2022',
    };
    return {
        props: {
            postId,
            post,
        },
    };
}
