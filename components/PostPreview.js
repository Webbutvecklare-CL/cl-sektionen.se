import Link from 'next/link';
import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';

const PostPreview = ({ post, postId }) => {
    return (
        <div className="post-preview">
            {/* Varje post preview är en länk som leder till inlägget */}
            <Link href={`/aktuellt/${postId}`}>
                <div className="preview">
                    <h2>{post.title}</h2>
                    {/* <p className="subtitle">{post.subtitle}</p> */}
                    <p className="meta">
                        Publicerad{' '}
                        {post.publishDate.toDate().toLocaleDateString('sv')} av{' '}
                        {post.author}
                    </p>
                    {/* <hr /> */}

                    {/* Parse för att formatera om html koden till faktiska element
                    Sanitize för att göra det lite mer stilrent i previewn dvs inga styles*/}
                    <div className="body">
                        <p>
                            {parse(
                                sanitizeHtml(post.body, {
                                    allowedTags: [],
                                })
                            )}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PostPreview;
