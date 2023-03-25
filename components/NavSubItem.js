import Link from "next/link";

export default function NavSubItem({ text, href, active }) {
  return (
    <Link href={href} className={`submenu_item ${active ? "active" : ""}`}>
      <p>{text}</p>
    </Link>
  );
};
