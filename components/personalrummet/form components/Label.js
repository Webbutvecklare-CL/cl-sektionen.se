import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";

import styles from "@/styles/personalrummet/post-form.module.css";

export default function Label({ children, required, htmlFor = "" }) {
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      {children}
      {required && (
        <FontAwesomeIcon icon={faStarOfLife} rotation={90} className={styles.required} />
      )}
    </label>
  );
}
