import MarkdownRender from "./MarkdownRender";

export default function CommitteeInfo({ committee, description, contact }) {
  const mandatperioder = {
    "ctyrelsen": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "studienamnden": [
      "Mandatperiod 2023.01.01 - 2023.12.31",
      "Utbytesansvarig 2022.05.01 - 2023.04.30",
    ],
    "naringslivsnamnden": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "mottagningsnamnden": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "jml-namnden": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "aktivitetsnamnden": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "lokalnamnden": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "clw": ["Mandatperiod 2022.05.01 - 2023.04.30"],
    "valberedningen": ["Mandatperiod 2022.05.01 - 2023.04.30"],
    "revisorer": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "fanborg": ["Mandatperiod 2023.02.01 - 2023.01.31"],
    "kf": ["Mandatperiod 2022.07.01 - 2023.06.31"],
    "enskilda": ["Mandatperiod 2023.01.01 - 2023.12.31"],
    "clek": [],
    "dubbelspexet": [],
    "clak": [],
  };

  return (
    <div>
      <MarkdownRender mdData={description} />
      {mandatperioder[committee].map((period, idx) => {
        return (
          <span className="mandat_period" key={idx}>
            {period}
          </span>
        );
      })}
      <br />
      <section className="nämnd_namnochkontakt">
        <div className="poster">
          <MarkdownRender mdData={contact} />
        </div>
      </section>
    </div>
  );
}
