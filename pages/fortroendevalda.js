import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getContentData } from "../utils/contents";
import { getValues } from "../utils/sheetsUtils";
import { board, committees, trustees, associations } from "../constants/committees-data";

// Komponenter
import CommitteeInfo from "../components/CommitteeInfo";
import CustomHead from "../components/CustomHead";

import styles from "../styles/fortroendevalda.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Fortroendevalda({ descriptions, contactsList }) {
  /**
   * För att uppdatera listan på förtroendevalda följ instruktionerna
   * du hittar här: https://github.com/Webbutvecklare-CL/cl-sektionen.se/wiki/F%C3%B6rtroendevalda
   */

  // Descriptions - Objekt med alla nämndbeskrivningar
  // contactsList - Objekt med alla namn och mail till förtroendevalda

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
      <div id="contentbody" className="wideContent">
        <div className={styles.fortroendevaldaWrapper}>
          {/* Nav hämtar data från /constants/committees-data.json uppdatera
           denna om en nämnd ska ändras, läggas till eller tas bort */}
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
              contact={contactsList[selectedCommittee]}
            />
          </div>
        </div>
        <span className="lastUpdated">Senast uppdaterad: 2023-10-17</span>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const descriptions = getContentData("fortroendevalda");

  let contactsList = {};
  try {
    // Hämtar all data från ett google spreadsheet
    // https://docs.google.com/spreadsheets/d/15vKkR2bmo36amKvxoGEwhiALw0sj1ZSPUCXxzYvMDh0/
    const data = await getValues(process.env.COMMITTEES_SHEET_ID, "A2:E91");

    // Strukturera data och skapa objekt för varje nämnd
    contactsList = getContactsList(data);
  } catch (error) {
    console.error("Något fel skedde vid hämtningen av data från google spreadsheet!");
    console.error(error);
  }

  return {
    props: {
      descriptions,
      contactsList,
    },
  };
}

function getContactsList(data) {
  let contactsList = {}; // Objekt med alla nämnder en nämnd ser ut på följande sätt:
  // 'namnd-id': {id: namnd-id, mail: '', period: '', trustees: [/*Nämndens förtroendevalda*/]}

  let committeeHolder = null;
  let i = 0;
  while (i < data.length) {
    let row = data[i];
    i++;
    if (row.length < 1) {
      // Mellan varje nämnd finns en tom rad dvs raden(listan) kommer vara tom
      contactsList[committeeHolder.id] = committeeHolder; // Lägger till den föregående nämnden
      committeeHolder = null; // Rensar holder objektet
    } else if (!committeeHolder) {
      // Om holder objektet är tomt så blev det precis resnat
      // Då är nästa rad informations raden för den nämnden
      // || null för att det vissa celler inte har värden och
      // blir knas med JSON.parse annars
      committeeHolder = {
        id: row[0].toLowerCase(),
        mail: row[1] || null,
        period: row[4] || null,
        trustees: [],
      };
    } else {
      // Om inget av ovanstående så är det en rad med en förtroendevald
      // Spara varje person i en lista för nämndens förtroendevalda
      committeeHolder.trustees.push({
        position: row[0] || null,
        mail: row[1] || null,
        name: row[2] || null,
        year: row[3] || null,
      });
    }
  }

  // Lägger till sista nämnden i listan
  contactsList[committeeHolder.id] = committeeHolder;

  return contactsList;
}
