import Link from "next/link";

const NavSubItem = ({ text, href, active }) => {
  return (
    <Link href={href} className={`submenu_item ${active ? "active" : ""}`}>
      <p>{text}</p>
    </Link>
  );
};

export default NavSubItem;
