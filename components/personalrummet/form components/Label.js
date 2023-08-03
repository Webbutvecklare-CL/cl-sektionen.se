import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";

import styles from "../../../styles/personalrummet/publicera.module.css";

export default function Label({ children, required }) {
  return (
    <label>
      {children}
      {required && (
        <FontAwesomeIcon icon={faStarOfLife} rotation={90} className={styles.required} />
      )}
    </label>
  );
}
