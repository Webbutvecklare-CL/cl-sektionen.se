import Link from "next/link";

export default function NavItem({ text, active, submenu }) {
  return (
    <div className={`nav__item ${active ? "active" : ""}`}>
      {text}{" "}
      {submenu ? <i style={{ fontSize: "1rem" }} className="fa-solid fa-angle-down"></i> : ""}
    </div>
  );
}
