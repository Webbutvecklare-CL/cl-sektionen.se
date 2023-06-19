import { useRouter } from "next/router";
import Router from "next/router";
import React from "react";

export default function BackButton({ page = "", children }) {
  const router = useRouter();

  function handleBackClick() {
    router.push("/" + page);
  }

  return (
    <button className="back-button" onClick={handleBackClick}>
      <i className="fa fa-arrow-left" aria-hidden="true" /> {children}
    </button>
  );
}
