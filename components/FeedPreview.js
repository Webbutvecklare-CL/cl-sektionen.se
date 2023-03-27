import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import bg from "../public/media/img/KTHcover.jpg";

const FeedPreview = ({ docs, title }) => {
  let post = {};
  return (
    <div className="feed-preview">
      {docs.map(
        (doc) => (
          (doc.data().id = doc.id),
          ((post = doc.data()),
          (
            <Link href={`/aktuellt/${doc.id}`} key={doc.id}>
              <div className="post-preview">
                <div className="image">
                  {post.image && <Image src={post.image} alt="Post image" />}
                  {!post.image && <Image src={bg} alt="Bakgrundsbild KTH" />}
                </div>
                <div className="post-meta">
                  <h2>{post.title}</h2>
                  {/*här fanns post.author förut, kan läggas tillbaka om plats finns*/}
                  <div>
                    <p>{post.publishDate.toDate().toLocaleDateString("sv")}</p>
                  </div>
                </div>
                <div className="post-content">
                  <p className="subtitle">{post.subtitle}</p>
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
              </div>
            </Link>
          ))
        )
      )}
    </div>
  );
};

export default FeedPreview;
