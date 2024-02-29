import MarkdownRender from "./MarkdownRender";
import Image from "next/image";

import styles from "../styles/fortroendevalda.module.css";

export default function CommitteeInfo({ committee, description, contact }) {
  const MandatePeriod = ({ contact }) => {
    if (!contact.period) return null;
    let periods = contact.period.split(";");
    let elementList = []; // Varje element är en mandatperiod

    // Lägger till första mandat perioden, första ska vara generell för nämnden
    elementList.push(
      <span className={styles.mandatePeriod} key={0}>
        Mandatperiod {periods.shift()}
      </span>
    );

    // Om det finns fler så läggs de också till
    periods.forEach((period, idx) => {
      elementList.push(
        <span className={styles.mandatePeriod} key={idx + 1}>
          {period}
        </span>
      );
    });

    return elementList;
  };

  return (
    <div>
      <MarkdownRender mdData={description} />
      <MandatePeriod contact={contact} />
      <br />
      <div className={styles.imageWrapper}>
        <section>
          <div className={styles.poster}>
            {contact.trustees.map((trustee, idx) => {
              return (
                <p key={idx}>
                  {trustee.name} {trustee.year}, <strong>{trustee.position}</strong>
                  <br />
                  <a href={"mailto:" + trustee.mail}>{trustee.mail}</a>
                </p>
              );
            })}
          </div>
        </section>
        <div className={styles.imageContainer}>
          <Image
            src={"/media/förtroendevalda/" + committee + ".webp"}
            width={500}
            height={500}
            alt="Gruppbild"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
}
