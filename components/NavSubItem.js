import Link from "next/link";

const NavSubItem = ({ text, href, active }) => {
  return (
    <Link href={href} className={`submenu_item ${active ? "active" : ""}`}>
      {text}
    </Link>
  );
};

export default NavSubItem;
