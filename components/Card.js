import React from "react";
import Link from "next/link";

export default function Card({link, innerText}) {
  return (
    <Link 
        className="link-card"
        href={link}
    >
        {innerText}
    </Link>
  );
}
