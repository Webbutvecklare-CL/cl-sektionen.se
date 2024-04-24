import {
	active as activeStyles,
	navItem as navItemStyles,
} from "@/styles/nav.module.css";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavItem({ text, active, submenu }) {
	return (
		<div className={`${navItemStyles} ${active ? activeStyles : ""}`}>
			{text} {submenu ? <FontAwesomeIcon icon={faAngleDown} /> : ""}
		</div>
	);
}
