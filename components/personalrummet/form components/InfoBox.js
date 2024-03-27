import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "@/styles/personalrummet/post-form.module.css";

export default function InfoBox({ text }) {
	return (
		<div className={styles.infoboxContainer}>
			<FontAwesomeIcon icon={faCircleQuestion} size="sm" />
			<span className={styles.infobox}>{text}</span>
		</div>
	);
}
