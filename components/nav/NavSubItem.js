import Link from "next/link";

import { logEvent } from "firebase/analytics";

import {
	active as activeStyles,
	submenuItem as submenuItemStyles,
} from "../../styles/nav.module.css";

export default function NavSubItem({ text, href, active }) {
	return (
		<Link
			href={href}
			className={`${submenuItemStyles} ${active ? activeStyles : ""}`}
			onClick={async () => {
				// När användaren klickar på en nav link
				const { getAnalytics } = await import("../../firebase/clientApp");
				const analytics = await getAnalytics();
				if (analytics) {
					logEvent(analytics, "nav_click", { href });
				}
			}}
		>
			<p>{text}</p>
		</Link>
	);
}
