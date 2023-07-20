import styles from "../styles/cookie-banner.module.css";

export default function CookieBanner({ onDecline, onAccept }) {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p>
          För att vissa funktioner, som notiser och inloggning, ska gå att använda behöver vi spara
          vissa kakor. Vi vill använda kakor för att förbättra webbplatsen och din
          användarupplevelse.
        </p>
        <div className={styles.menu}>
          <button className="small" onClick={onDecline}>
            Bara nödvändiga kakor
          </button>
          <button className="small" onClick={onAccept}>
            Acceptera kakor
          </button>
        </div>
      </div>
      <button className={styles.close} onClick={onDecline}>
        x
      </button>
    </div>
  );
}
