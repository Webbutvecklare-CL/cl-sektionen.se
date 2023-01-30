import PostPreview from './PostPreview';

const PostFeed = ({ docs, title }) => {
    return (
        <div className="post-list">
            <h2>{title}</h2>
            {docs.map(
                (doc) => (
                    (doc.data().id = doc.id),
                    (
                        <PostPreview
                            post={doc.data()}
                            postId={doc.id}
                            key={doc.id}
                        />
                    )
                )
            )}
        </div>
    );
};

export default PostFeed;
