import React from "react";
import Link from "next/link";

export default function Card({ link = "", action, children }) {
  if (action) {
    return (
      <div tabIndex={0} className="link-card" onClick={action}>
        {children}
      </div>
    );
  } else {
    return (
      <div className="link-card">
        <Link href={link}>{children}</Link>
      </div>
    );
  }
}
