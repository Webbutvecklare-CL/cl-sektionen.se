import Image from "next/image";

import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";
import { useEffect, useState, useRef } from "react";

import styles from "../styles/hedersutmarkelser.module.css";

export default function Hedersmedlemmar({ contents, hedersorden }) {
  const [selectedMember, setSelectedMember] = useState();
  const membersShelfRef = useRef();

  // useEffect(() => {
  //   document.body.onclick = (e) => {
  //     console.log(e.target);
  //     console.log(membersShelfRef.current);
  //     console.log(membersShelfRef.current.contains(e.target));
  //     if (membersShelfRef.current.contains(e.target)) {
  //       return;
  //     }
  //     setSelectedMember("");
  //   };
  // }, []);

  const NameTag = ({ name, year }) => {
    return (
      <li className={styles.nameTag}>
        {name}
        <span> - {year}</span>
      </li>
    );
  };

  const NameList = ({ year, names }) => {
    return (
      <>
        <h3 id={`platina-${year}`} className={styles.yearHeader}>
          {year}
        </h3>
        {names.map((name, idx) => {
          return <NameTag name={name} year={year} key={idx} />;
        })}
      </>
    );
  };

  const Hedersmedlem = ({ nameId, year }) => {
    const name = nameId.replace("_", " ");
    const selected = selectedMember === nameId;
    return (
      <div
        id={nameId}
        className={`${styles.hedersmedlem} ${selected ? styles.selected : ""}`}
        onClick={() => setSelectedMember(selected ? null : nameId)}
        onKeyDown={() => setSelectedMember(selected ? null : nameId)}>
        <div className={styles.imgdiv}>
          <Image
            src={`/media/img/hedersmedlemmar/${nameId}.webp`}
            width={200}
            height={200}
            alt={`Bild på hedersmedlem ${name}`}
          />
        </div>
        <h2>{name}</h2>
        <h3>{year}</h3>
      </div>
    );
  };

  return (
    <div id="contentbody">
      <div className={styles.hedersmedlemmar}>
        <h1>Hedersmedlemmar</h1>
        <MarkdownRender mdData={contents["hedersmedlemmar-info"]} />
        <div id={styles.hedersmedlemmarShelf} ref={membersShelfRef}>
          <Hedersmedlem nameId={"Jan_Scheffel"} year={2014} />
          <Hedersmedlem nameId={"Hans_Thunberg"} year={2014} />
          <Hedersmedlem nameId={"Mikael_Cronhjort"} year={2020} />
          <Hedersmedlem nameId={"Linda_Kann"} year={2022} />
        </div>
        <div>
          {selectedMember && (
            <div className={styles.motivering}>
              <h2>Motivering för {selectedMember.replace("_", " ")}</h2>
              <MarkdownRender mdData={contents[selectedMember]} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.hedersorden}>
        <br />
        <h1>Hedersorden</h1>
        <h2>Platina</h2>
        <ul id={`${styles.platina}`} className={styles.category}>
          {/* Reverse för att åren ska hamna i fallande ordning */}
          {Object.keys(hedersorden.Platina)
            .reverse()
            .map((year) => {
              return <NameList year={year} names={hedersorden.Platina[year]} key={year} />;
            })}
        </ul>
        <h2>Guld</h2>
        <ul id={"guld"} className={styles.category}>
          {Object.keys(hedersorden.Guld)
            .reverse()
            .map((year) => {
              return <NameList year={year} names={hedersorden.Guld[year]} key={year} />;
            })}
        </ul>
        <h2>Silver</h2>
        <ul id={"silver"} className={styles.category}>
          {Object.keys(hedersorden.Silver)
            .reverse()
            .map((year) => {
              return <NameList year={year} names={hedersorden.Silver[year]} key={year} />;
            })}
        </ul>

        <br />
        <MarkdownRender mdData={contents["hedersorden-info"]} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("hedersutmarkelser");
  const hedersordenText = getContentData("data").hedersorden;

  // Gör om md/text-filen hedersorden till JSON
  const hedersorden = {};
  const rows = hedersordenText.split(/\r?\n/); // Plockar ut alla rader
  let title = "";
  let year = "2002";
  for (let i = 0; i < hedersordenText.length; i++) {
    const row = rows[i];
    if (!row) {
      // Hoppar över tomma rader
      continue;
    }
    if (row.match(/^# /)) {
      // Kollar om det är rubrikrad dvs #
      title = row.substring(2);
      hedersorden[title] = {};
    } else if (row.match(/^## /)) {
      // Kollar om det är underrubrikrad dvs ##
      year = row.substring(3);
      hedersorden[title][year] = [];
    } else {
      hedersorden[title][year].push(row);
    }
  }

  return {
    props: {
      contents,
      hedersorden,
    },
  };
}
