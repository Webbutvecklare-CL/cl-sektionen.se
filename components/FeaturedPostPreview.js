import Link from "next/link";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
import { convertDate } from "../utils/convertDate";
import bg from "../public/media/img/KTHcover.jpg";

import feedStyles from "../styles/feed-preview.module.css";

import { logEvent } from "firebase/analytics";

export default function FeaturedPostPreview({ post }) {
  const date = new Date(post.publishDate["seconds"] * 1000);
  return (
    <div className="featured-preview">
      <Link
        href={`/aktuellt/${post.id}`}
        key={post.id}
        onClick={async () => {
          const { getAnalytics } = await import("../firebase/clientApp");
          const analytics = await getAnalytics();
          if (analytics) {
            logEvent(analytics, "post_click", { page: "featured" });
          }
        }}>
        <div className="post-preview featured">
          <div className="image">
            {post.image && <Image src={post.image} width={400} height={300} alt="Post image" />}
            {!post.image && <Image src={bg} width={400} height={300} alt="Bakgrundsbild KTH" />}
          </div>
          <div className="post-meta">
            <h2>{post.title}</h2>
            <div>
              <h3>{post.author}</h3>, {convertDate(date)}
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
}
