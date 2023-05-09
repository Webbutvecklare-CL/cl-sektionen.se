import { useRouter } from "next/router";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  function handleBackClick() {
    // Kollar om den förra sidan var från webbplatsen eller extern
    const previousUrl = document.referrer;
    if (previousUrl || !previousUrl.startsWith(window.location.origin)) {
      router.push("/");
    } else {
      router.back();
    }
  }

  return (
    <button className="back-button" onClick={handleBackClick}>
      <i className="fa fa-arrow-left" aria-hidden="true"></i> Tillbaka
    </button>
  );
}
