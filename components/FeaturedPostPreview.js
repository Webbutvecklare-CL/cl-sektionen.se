import Link from "next/link";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";

import bg from "../public/media/img/KTHcover.jpg";

const FeaturedPostPreview = ({ post }) => {
  const date = new Date(post.publishDate["seconds"] * 1000);
  console.log(post.body)
  return (
    <div className="featured-preview">
      <Link href={`/aktuellt/${post.id}`} key={post.id}>
        <div className="post-preview featured">
          <div className="image">
            {post.image && <Image src={post.image} width={400} height={300} alt="Post image" />}
            {!post.image && <Image src={bg} width={400} height={300} alt="Bakgrundsbild KTH" />}
          </div>
          <div className="post-meta">
            <h2>{post.title}</h2>
            <div>
              <h4>{post.author}</h4>, {date.toLocaleDateString("sv")}
            </div>
          </div>
          <div className="post-content">
            <p className="subtitle">{post.subtitle}</p>

            <div className="body">
              <br />
              <p>
                {parse(
                  sanitizeHtml(post.body, {
                    allowedTags: ["strong", "br"],
                  })
                )}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedPostPreview;
