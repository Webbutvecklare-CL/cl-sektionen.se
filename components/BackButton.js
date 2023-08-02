import { useRouter } from "next/router";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackButton({ page = "", children }) {
  const router = useRouter();

  function handleBackClick() {
    router.push("/" + page);
  }

  return (
    <button className="back-button" onClick={handleBackClick}>
      <FontAwesomeIcon icon={faArrowLeft} /> {children}
    </button>
  );
}
