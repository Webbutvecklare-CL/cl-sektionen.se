import { navItem as navItemStyles, active as activeStyles } from "../../styles/nav.module.css";
import { solid, angleDown } from "../../styles/fontawesome.module.css";

export default function NavItem({ text, active, submenu }) {
  return (
    <div className={`${navItemStyles} ${active ? activeStyles : ""}`}>
      {text} {submenu ? <i style={{ fontSize: "1rem" }} className={`${solid} ${angleDown}`} /> : ""}
    </div>
  );
}
