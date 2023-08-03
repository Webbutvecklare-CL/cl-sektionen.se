import BackButton from "../components/BackButton";
import Image from "next/image";
import bg from "../public/media/grafik/CLsharp.webp";

import styles from "../styles/404.module.css";

export default function Custom404() {
  return (
    <div id="contentbody" className={styles.body}>
      <Image src={bg} alt="background logo" className={styles.background} />
      <div className={styles.errorMsg}>
        <span className={styles.errorCode}>404</span>
        <span className={styles.divider} />
        <span className={styles.errorDescription}>Sidan kunde inte hittas</span>
      </div>
      <div className={styles.errorBackLink}>
        <BackButton>Startsidan</BackButton>
      </div>
    </div>
  );
}
