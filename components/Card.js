import React from "react";
import Link from "next/link";

export default function Card({ link, innerText, children }) {
  return (
    <Link className="link-card" href={link}>
      {children}
    </Link>
  );
}
