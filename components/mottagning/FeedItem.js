import { useState, useEffect, useRef } from "react";

import feed_styles from "../../styles/mottagning/mottagning.module.css";

export default function FeedItem({ item }) {
  const [expanding, setExpanding] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [maxHeight, setMaxHeight] = useState(null);

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

  useEffect(() => {
    const rem = parseInt(getComputedStyle(document.documentElement).fontSize);
    if (contentRef.current.scrollHeight > 4.5 * rem) {
      setMaxHeight(contentRef.current.scrollHeight);
    }
  }, []);

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
        style={expanding ? { maxHeight: maxHeight + "px" } : {}}
        className={`${closing ? feed_styles.closing : ""}`}>
        {item.content}
      </p>
      {maxHeight && <span>{expanding ? "Visa mindre" : "Visa mer"}</span>}
    </div>
  );
}
