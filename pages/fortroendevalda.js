import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getContentData } from "../utils/contents";
import { board, committees, trustees, associations } from "../constants/committees-data";

// Komponenter
import CommitteeInfo from "../components/CommitteeInfo";
import CustomHead from "../components/CustomHead";

import styles from "../styles/fortroendevalda.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Fortroendevalda({ descriptions, contacts }) {
  // Descriptions - Objekt med alla nämndbeskrivningar
  // Contacts - Objekt med alla namn och mail till förtroendevalda

  const router = useRouter();
  const [selectedCommittee, setSelectedCommittee] = useState("ctyrelsen");

  // När sidan laddats in så sätter vi selectedCommittee till det angivna i url:en
  useEffect(() => {
    const urlSelect = router.asPath.split("#")[1] || "ctyrelsen";
    setSelectedCommittee(urlSelect);
    document.getElementById(styles.fortroendevaldaContent).scrollIntoView();
  }, [router.asPath]);

  // När en användare väljer en nämnd uppdateras url:en och vilken nämnd som visas
  const stateUpdater = (committee) => {
    router.replace("#" + committee);
    document.getElementById(styles.fortroendevaldaContent).scrollIntoView();
    setSelectedCommittee(committee);
  };

  // Nav Tab för varje nämnd/post i menyvalet
  const NavTab = ({ data }) => {
    return (
      <li
        // id={data.id}
        className={selectedCommittee === data.id ? styles.active : ""}
        onClick={() => stateUpdater(data.id)}>
        <FontAwesomeIcon icon={data.icon} /> {data.name}
      </li>
    );
  };

  return (
    <>
      <CustomHead
        metaTitle={`Förtroendevalda | Sektionen för Civilingenjör och Lärare`}
        description={"Här hittar du kontaktuppgifter till styrelsen och övriga förtroendevalda."}
        url={"https://www.cl-sektionen.se/fortroendevalda"}
      />
      <div id="contentbody">
        <div className={styles.fortroendevaldaWrapper}>
          <nav className={styles.committeeNav}>
            <ul>
              <NavTab data={board} />

              <h2>Nämnder</h2>
              {committees.map((committee, idx) => {
                return <NavTab data={committee} key={idx} />;
              })}
              <br />

              <h2>Övriga förtroendevalda</h2>
              {trustees.map((trustee, idx) => {
                return <NavTab data={trustee} key={idx} />;
              })}
              <br />

              <h2>Sektionsföreningar</h2>
              {associations.map((association, idx) => {
                return <NavTab data={association} key={idx} />;
              })}
            </ul>
          </nav>
          <div id={styles.fortroendevaldaContent}>
            <CommitteeInfo
              committee={selectedCommittee}
              description={descriptions[selectedCommittee]}
              contact={contacts[selectedCommittee]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const descriptions = getContentData("fortroendevalda");
  const contacts = csvTOJSON(getContentData("data")["fortroendevalda"]);

  return {
    props: {
      descriptions,
      contacts,
    },
  };
}

function csvTOJSON(csvStream) {
  csvStream += "\n"; // Lägger till ett blanksteg/ny rad i slutet

  let rows = csvStream.split(/\r?\n/); // Plockar ut alla rader

  let committees = [];
  let lastBreak = 0; // Senaste tomma raden = ',,,,'
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    // Alla nämner är avskilda med en tom rad kolla även om det är slut på listan
    if (row == ",,,," || i == rows.length - 1) {
      committees.push(rows.slice(lastBreak + 1, i)); // +1 för att ta bort rubrikraden och den tomma raden
      lastBreak = i;
    }
  }

  let contactsData = {};
  committees.forEach((committee) => {
    const committeeData = committee[0].split(","); // Nämnd informationen
    const committeeId = committeeData[0].toLowerCase(); // Id som används i komponenten
    contactsData[committeeId] = { mail: committeeData[1], period: committeeData[4] };

    // Skapa lista med alla poster för nämnden
    let trustees = [];
    const trusteesRows = committee.splice(1); // Raderna med förtroendevalda
    trusteesRows.forEach((trustee) => {
      const trusteeData = trustee.split(",");
      trustees.push({
        position: trusteeData[0],
        mail: trusteeData[1],
        name: trusteeData[2],
        year: trusteeData[3],
      });
    });

    // Lägger till de förtroendevalda i nämnd objektet
    contactsData[committeeId]["trustees"] = trustees;
  });
  return contactsData;
}
