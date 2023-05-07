import { useRouter } from "next/router";
import React from "react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      <i className="fa fa-arrow-left" aria-hidden="true"></i> Tillbaka
    </button>
  );
}
