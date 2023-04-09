import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import bg from "../public/media/img/KTHcover.jpg";

const FeedPreview = ({ posts }) => {
  return (
    <div className="feed-preview">
      {posts.map((post) => {
        return (
          <Link href={`/aktuellt/${post.id}`} key={post.id}>
            <div className="post-preview">
              <div className="image">
                {post.image && <Image src={post.image} width={240} height={200} alt="Post image" />}
                {!post.image && <Image src={bg} alt="Bakgrundsbild KTH" />}
              </div>
              <div className="post-meta">
                <h2>{post.title}</h2>
                {/*här fanns post.author förut, kan läggas in igen om plats finns*/}
                <div>{/* <p>{post.publishDate.toDate().toLocaleDateString("sv")}</p> */}</div>
              </div>
              <div className="post-content">
                <p className="subtitle">{post.subtitle}</p>
                {/* Parse för att formatera om html koden till html element
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
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FeedPreview;
