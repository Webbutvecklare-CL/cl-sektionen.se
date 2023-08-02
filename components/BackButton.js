import { useRouter } from "next/router";
import React from "react";

import { fa, arrowLeft } from "../styles/fontawesome.module.css";

export default function BackButton({ page = "", children }) {
  const router = useRouter();

  function handleBackClick() {
    router.push("/" + page);
  }

  return (
    <button className="back-button" onClick={handleBackClick}>
      <i className={`${fa} ${arrowLeft}`} aria-hidden="true" /> {children}
    </button>
  );
}
