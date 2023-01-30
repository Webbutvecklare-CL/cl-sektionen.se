import Link from 'next/link';

const PostFeed = ({ blogs, title }) => {
    return (
        <div className="post-list">
            <h2>{title}</h2>
            {blogs.map((blog) => (
                <div className="post-preview" key={blog.id}>
                    {/* Varje post preview är en länk som leder till inlägget */}
                    <Link href={`/aktuellt/${blog.id}`}>
                        <h2>{blog.title}</h2>
                        <p className="author">Publicerad av {blog.author}</p>
                        {/* <h3>{blog.subtitle}</h3> */}
                        <p className="body">{blog.body}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default PostFeed;
