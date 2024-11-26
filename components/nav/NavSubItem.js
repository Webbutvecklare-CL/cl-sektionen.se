import PropTypes from "prop-types";
import Link from "next/link";
import { logEvent } from "firebase/analytics";
import styles from "@/styles/nav.module.css";

export default function NavSubItem({ text, href, active, onClick }) {
	const handleClick = async (e) => {
		if (onClick) {
			onClick(e);
		}

		try {
			const { getAnalytics } = await import("../../firebase/clientApp");
			const analytics = await getAnalytics();
			if (analytics) {
				logEvent(analytics, "nav_click", { href });
			}
		} catch (error) {
			console.error("Analytics error:", error);
		}
	};

	return (
		<Link
			className={styles.submenuLink}
			href={href}
			onClick={handleClick}
			role="menuitem"
		>
			<span className={`${styles.submenuItem} ${active ? styles.active : ""}`}>
				{text}
			</span>
		</Link>
	);
}

NavSubItem.propTypes = {
	text: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	active: PropTypes.bool,
	onClick: PropTypes.func,
};

NavSubItem.defaultProps = {
	active: false,
	onClick: null,
};
