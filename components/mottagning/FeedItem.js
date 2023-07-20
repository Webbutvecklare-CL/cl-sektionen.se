import { useState, useEffect, useRef } from "react";

import feed_styles from "../../styles/mottagning/mottagning.module.css";

export default function FeedItem({ item }) {
  const [expanding, setExpanding] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    const transitionend = () => {
      if (closing) {
        setClosing(false);
      }
      if (expanding) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };
    contentRef.current.addEventListener("transitionend", transitionend);
  }, [expanding, closing]);

  return (
    <div
      className={`${feed_styles.feedItem} ${expanding ? feed_styles.expanding : ""}`}
      onClick={() => {
        if (expanded) {
          setClosing(true);
        }
        setExpanding(!expanding);
      }}>
      <h3>{item.title}</h3>
      <p
        ref={contentRef}
        className={`${closing ? feed_styles.closing : ""} ${expanded ? feed_styles.expanded : ""}`}>
        {item.content}
      </p>
      <span>{expanding ? "Visa mindre" : "Visa mer"}</span>
    </div>
  );
}
