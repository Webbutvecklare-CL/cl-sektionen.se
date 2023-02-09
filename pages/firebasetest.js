import React, { useMemo } from 'react';
import {
    collection,
    orderBy,
    query,
    where,
    Timestamp,
} from 'firebase/firestore';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase/clientApp';

import PostFeed from '../components/PostFeed';

function Firebase() {
    const timeNow = useMemo(() => Timestamp.now(), []);
    const oldTime = useMemo(
        () => Timestamp.fromDate(new Date('2000-01-01')),
        []
    );
    //https://www.youtube.com/watch?v=Ofux_4c94FI
    const postRef = collection(firestore, 'posts');
    const infoQuery = query(
        postRef,
        where('tags', 'array-contains', 'Information'),
        where('publishDate', '<', timeNow),
        orderBy('publishDate', 'desc')
    );

    const annatQuery = query(
        postRef,
        where('tags', 'array-contains', 'Annat')
        // where('pusblishDate', '<=', new Date())
    );
    const [infoFeed, infoLoading, infoError] = useCollectionOnce(infoQuery);
    const [annatFeed, annatLoading, annatError] = useCollectionOnce(annatQuery);

    console.log(infoError);
    return (
        <div id="contentbody">
            <h1>Firebase</h1>
            <div>
                {/*Om det finns något i post listan så visas de i PostFeed komponenten
                        Annars visas ett fel meddelande*/}
                {annatError && (
                    <strong>
                        Error:{' '}
                        {(JSON.stringify(annatError), console.log(annatError))}
                    </strong>
                )}
                {annatLoading && <span>Collection: Loading...</span>}
                {annatFeed && (
                    <div className="feed-container">
                        <PostFeed docs={annatFeed.docs} title="Annat" />
                    </div>
                )}
            </div>
            <div>
                {/*Om det finns något i post listan så visas de i PostFeed komponenten
                        Annars visas ett fel meddelande*/}
                {infoError && (
                    <strong>Error: {JSON.stringify(infoError)}</strong>
                )}
                {infoLoading && <span>Collection: Loading...</span>}
                {infoFeed && (
                    <div className="feed-container">
                        <PostFeed docs={infoFeed.docs} title="Information" />
                    </div>
                )}
            </div>
        </div>
    );
}
export default Firebase;
