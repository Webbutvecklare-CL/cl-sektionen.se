import { React, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import parse from 'html-react-parser';
import { firestore } from '../../firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';

export default function Post() {
    const router = useRouter();
    const { postId } = router.query;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const myLoader = ({ src, width, quality }) => {
        console.log(post.image);
        return post.image;
    };

    useEffect(() => {
        const getPost = async () => {
            setLoading(true);
            if (!postId) {
                setError('Inget post id');
                return;
            }
            const docRef = doc(firestore, 'posts', postId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // console.log('Document data:', docSnap.data());
                setPost(docSnap.data());
                setError(null);
            } else {
                setError('Det finns inget inlägg med id ' + postId);
                console.log('No such document!');
            }
            setLoading(false);
        };

        getPost();
    }, [postId]);

    const getDate = (date) => {
        return date.toDate().toLocaleDateString('sv');
    };
    return (
        <div id="contentbody">
            {loading && <p>Laddar...</p>}
            {error && <p>Error: {error}</p>}
            {post && (
                <article className="post">
                    <h1 className="title">{post.title}</h1>
                    {/* <p>{post.subtitle}</p> */}
                    <p className="meta">
                        Publicerad {getDate(post.date)} av {post.author}
                    </p>
                    {post.image && (
                        <div className="image-container">
                            <img src={post.image} alt="Post bild" />
                        </div>
                    )}

                    <hr />
                    <div>{parse(post.body)}</div>
                </article>
            )}
        </div>
    );
}
