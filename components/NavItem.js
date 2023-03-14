import Link from "next/link";

const NavItem = ({ text, href, active, submenu }) => {
  return (
    <Link
      href={href}
      className={`nav__item ${active ? "active" : ""}`}
    >
      {text}{" "}
      {submenu ? (
        <i
          style={{ fontSize: "1rem" }}
          className="fa-solid fa-angle-down"
        ></i>
      ) : (
        ""
      )}
    </Link>
  );
};

export default NavItem;
