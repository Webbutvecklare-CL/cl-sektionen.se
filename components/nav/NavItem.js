import styles from "@/styles/nav.module.css";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

export default function NavItem({ text, active, expanded, submenu, onClick }) {
	return (
		<button
			type="button"
			className={`${styles.navItem} ${active ? styles.active : ""}`}
			onClick={onClick}
			aria-expanded={expanded}
			aria-haspopup={!!submenu}
		>
			<span>{text}</span>
			{submenu && (
				<FontAwesomeIcon
					icon={faAngleDown}
					className={`${styles.dropdownIcon} ${expanded ? styles.rotated : ""}`}
					aria-hidden="true"
				/>
			)}
		</button>
	);
}

NavItem.propTypes = {
	text: PropTypes.string.isRequired,
	active: PropTypes.bool,
	expanded: PropTypes.bool,
	submenu: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.string.isRequired,
			href: PropTypes.string.isRequired,
		}),
	),
	onClick: PropTypes.func,
};

NavItem.defaultProps = {
	active: false,
	expanded: false,
	submenu: null,
	onClick: () => {},
};
