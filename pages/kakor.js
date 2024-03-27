import { useState } from "react";

import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";

import { button as buttonStyles } from "../styles/cookie-banner.module.css";

export default function Kakor({ contents, cookiesAllowed, setCookieState }) {
  const menuStyles = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "1rem",
    minHeight: "2.5rem",
  };

  const [open, setOpen] = useState(true);

  return (
    <div id="contentbody">
      <h1>Kakpolicy</h1>
      <MarkdownRender mdData={contents.kakor} />
      <h2>Godkänn kakor</h2>

      <div style={menuStyles}>
        {open && (
          <>
            <button
              className={`${buttonStyles} small`}
              onClick={() => {
                setCookieState(true);
                setOpen(false);
              }}>
              Godkänn alla
            </button>
            <button
              className={`${buttonStyles} small`}
              onClick={() => {
                setCookieState(false);
                setOpen(false);
              }}>
              Godkänn nödvändiga
            </button>
          </>
        )}
        {!open && <p>Dina preferenser är sparade!</p>}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("kakor");
  return { props: { contents } };
}
