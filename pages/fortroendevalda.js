import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CommitteeInfo from "../components/CommitteeInfo";
import { getContentData } from "../utils/contents";

export default function Fortroendevalda({ descriptions, committeesData, contacts }) {
  // Descriptions - Objekt med alla nämndbeskrivningar
  // Contacts - Objekt med alla namn och mail till förtroendevalda
  // CommitteeData - namn, icon och id till varje nämnd - används i menyn

  const router = useRouter();
  const [selectedCommittee, setSelectedCommittee] = useState("ctyrelsen");

  // När sidan laddats in så sätter vi selectedCommittee till det angivna i url:en
  useEffect(() => {
    const urlSelect = router.asPath.split("#")[1] || "ctyrelsen";
    setSelectedCommittee(urlSelect);
    document.getElementById("förtroendevalda_content").scrollIntoView();
  }, []);

  // När en användare väljer en nämnd uppdateras url:en och vilken nämnd som visas
  const stateUpdater = (committee) => {
    router.replace("#" + committee);
    document.getElementById("förtroendevalda_content").scrollIntoView();
    setSelectedCommittee(committee);
  };

  // Nav Tab för varje nämnd/post i menyvalet
  const NavTab = ({ data }) => {
    return (
      <li
        // id={data.id}
        className={selectedCommittee === data.id ? "active" : ""}
        onClick={() => stateUpdater(data.id)}>
        <i className={data.icon} /> {data.name}
      </li>
    );
  };

  return (
    <div id="contentbody">
      <div className="förtroendevalda_wrapper">
        <nav className="nämnder_nav">
          <ul id="nämnder_nav_ul">
            <NavTab data={committeesData.board} />

            <h2>Nämnder</h2>
            {committeesData.committees.map((committee, idx) => {
              return <NavTab data={committee} key={idx} />;
            })}
            <br />

            <h2>Övriga förtroendevalda</h2>
            {committeesData.trustees.map((trustee, idx) => {
              return <NavTab data={trustee} key={idx} />;
            })}
            <br />

            <h2>Sektionsföreningar</h2>
            {committeesData.associations.map((association, idx) => {
              return <NavTab data={association} key={idx} />;
            })}
          </ul>
        </nav>
        <div id="förtroendevalda_content">
          <CommitteeInfo
            committee={selectedCommittee}
            description={descriptions[selectedCommittee]}
            contact={contacts[selectedCommittee]}
          />
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const descriptions = getContentData("fortroendevalda");
  const committeesData = JSON.parse(getContentData("data")["committees-data"]);
  const contacts = csvTOJSON(getContentData("data")["fortroendevalda"]);

  return {
    props: {
      descriptions,
      committeesData,
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
    if (row == ",,,,") {
      committees.push(rows.slice(lastBreak + 1, i)); // +1 för att ta bort rubrikraden och den tomma raden
      lastBreak = i;
    }
  }

  let contactsData = {};
  committees.forEach((committee) => {
    const committeeData = committee[0].split(","); // Nämnd informationen
    const committeeId = committeeData[0]; // Id som används i komponenten
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
