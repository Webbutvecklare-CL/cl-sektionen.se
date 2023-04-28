import Image from "next/image";
import JanScheffel from "../public/media/img/hedersmedlemmar/Jan_Scheffel_2013.jpg";
import HansThunberg from "../public/media/img/hedersmedlemmar/thunberg.jpg";
import MikaelCronhjort from "../public/media/img/hedersmedlemmar/Mikael-Cronhjort.jpg";
import LindaKann from "../public/media/img/hedersmedlemmar/lk.jpg";

import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";
import { useState } from "react";

export default function Hedersmedlemmar({ contents, hedersorden }) {
  const [selectedMember, setSelectedMember] = useState();
  const stateUpdater = (member) => {
    let rootNode = document.getElementById("hedersmedlemmar-shelf");
    setSelectedMember(member);

    for (let hedersmedlem of rootNode.childNodes) {
      hedersmedlem.className = hedersmedlem.id === member ? "hedersmedlem active" : "hedersmedlem";
    }
  };

  const NameTag = ({ name, year }) => {
    return (
      <li className="name-tag">
        {name}
        <span> - {year}</span>
      </li>
    );
  };

  const NameList = ({ year, names }) => {
    return (
      <>
        <h3 id={`platina-${year}`} className="year-header">
          {year}
        </h3>
        {names.map((name, idx) => {
          return <NameTag name={name} year={year} key={idx} />;
        })}
      </>
    );
  };

  return (
    <div id="contentbody">
      <div className="hedersmedlemmar">
        <h1>Hedersmedlemmar</h1>
        <MarkdownRender mdData={contents["hedersmedlemmar-info"]} />
        <div id="hedersmedlemmar-shelf">
          <div
            id="Jan-Scheffel"
            className="hedersmedlem"
            onClick={() => stateUpdater("Jan-Scheffel")}>
            <div className="imgdiv">
              <Image src={JanScheffel} alt="Jan Scheffel" />
            </div>
            <h2>Jan Scheffel</h2>
            <h3>2014</h3>
          </div>
          <div
            id="Hans-Thunberg"
            className="hedersmedlem"
            onClick={() => stateUpdater("Hans-Thunberg")}>
            <div className="imgdiv">
              <Image src={HansThunberg} alt="Hans Thunberg" />
            </div>
            <h2>Hans Thunberg</h2>
            <h3>2014</h3>
          </div>
          <div
            id="Mikael-Cronhjort"
            className="hedersmedlem"
            onClick={(e) => stateUpdater("Mikael-Cronhjort")}>
            <div className="imgdiv">
              <Image src={MikaelCronhjort} alt="Mikael Cronhjort" />
            </div>
            <h2>Mikael Cronhjort</h2>
            <h3>2020</h3>
          </div>
          <div id="Linda-Kann" className="hedersmedlem" onClick={() => stateUpdater("Linda-Kann")}>
            <div className="imgdiv">
              <Image src={LindaKann} alt="Linda Kann" />
            </div>
            <h2>Linda Kann</h2>
            <h3>2022</h3>
          </div>
        </div>
        <div>
          {selectedMember && (
            <div className="motivering">
              <h2>Motivering för {selectedMember.replace("-", " ")}</h2>
              <MarkdownRender mdData={contents[selectedMember]} />
            </div>
          )}
        </div>
      </div>

      <div className="hedersorden">
        <br />
        <h1>Hedersorden</h1>
        <h2>Platina</h2>
        <ul id={"platina"} className="category">
          {/* Reverse för att åren ska hamna i fallande ordning */}
          {Object.keys(hedersorden.Platina)
            .reverse()
            .map((year) => {
              return <NameList year={year} names={hedersorden.Platina[year]} key={year} />;
            })}
        </ul>
        <h2>Guld</h2>
        <ul id={"guld"} className="category">
          {Object.keys(hedersorden.Guld)
            .reverse()
            .map((year) => {
              return <NameList year={year} names={hedersorden.Guld[year]} key={year} />;
            })}
        </ul>
        <h2>Silver</h2>
        <ul id={"silver"} className="category">
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
  const contents = getContentData("hedersmedlemmar");
  const hedersordenText = getContentData("data")["hedersorden"];

  // Gör om md/text-filen hedersorden till JSON
  let hedersorden = {};
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
    }, // will be passed to the page component as props
  };
}
