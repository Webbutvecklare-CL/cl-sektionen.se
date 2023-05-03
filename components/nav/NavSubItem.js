import Link from "next/link";

import { analytics } from "../../firebase/clientApp";
import { logEvent } from "firebase/analytics";

export default function NavSubItem({ text, href, active }) {
  return (
    <Link
      href={href}
      className={`submenu_item ${active ? "active" : ""}`}
      onClick={() => {
        // När användaren klickar på en nav link
        logEvent(analytics, "nav_click", { href });
      }}>
      <p>{text}</p>
    </Link>
  );
}
