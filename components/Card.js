import React from "react";
import Link from "next/link";

import { linkCard as linkCardStyles } from "../styles/components.module.css";

export default function Card({ link = "", action, children, newTab }) {
  if (action) {
    return (
      <div tabIndex={0} className={linkCardStyles} onClick={action}>
        {children}
      </div>
    );
  } else {
    return (
      <div className={linkCardStyles}>
        <Link href={link} target={newTab ? "_blank" : ""}>
          {children}
        </Link>
      </div>
    );
  }
}
