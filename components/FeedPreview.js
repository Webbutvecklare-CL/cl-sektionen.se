import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import { analytics } from "../firebase/clientApp";
import { logEvent } from "firebase/analytics";

import bg from "../public/media/img/KTHcover.jpg";

export default function FeedPreview({ posts }) {
  return (
    <div className="feed-preview">
      {posts.map((post) => {
        const date = new Date(post.publishDate["seconds"] * 1000);
        return (
          <div className="post-wrapper" key={post.id}>
            <Link
              href={`/aktuellt/${post.id}`}
              onClick={() => {
                logEvent(analytics, "post_click", { page: window.location.pathname });
              }}>
              <div className="post-preview">
                <div className="image">
                  {post.image && (
                    <Image src={post.image} width={240} height={200} alt="Post image" />
                  )}
                  {!post.image && <Image src={bg} alt="Bakgrundsbild KTH" />}
                </div>
                <div className="post-meta">
                  <h2>{post.title}</h2>
                  {post.author} {date.toLocaleDateString()}
                </div>
                <div className="post-content">
                  <p className="subtitle">{post.subtitle}</p>
                  {/* Parse för att formatera om html koden till html element
                                        Sanitize för att göra det lite mer stilrent i previewn dvs inga styles*/}
                  <div className="body">
                    <p>
                      {parse(
                        sanitizeHtml(post.body, {
                          allowedTags: ["strong"],
                        })
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
