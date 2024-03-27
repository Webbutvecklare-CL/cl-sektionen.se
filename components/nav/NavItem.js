import {
	navItem as navItemStyles,
	active as activeStyles,
} from "../../styles/nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function NavItem({ text, active, submenu }) {
	return (
		<div className={`${navItemStyles} ${active ? activeStyles : ""}`}>
			{text} {submenu ? <FontAwesomeIcon icon={faAngleDown} /> : ""}
		</div>
	);
}
