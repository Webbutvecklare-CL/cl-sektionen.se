import Image from "next/image";
import JanScheffel from "../public/media/img/hedersmedlemmar/Jan_Scheffel_2013.jpg";
import HansThunberg from "../public/media/img/hedersmedlemmar/thunberg.jpg";
import MikaelCronhjort from "../public/media/img/hedersmedlemmar/Mikael-Cronhjort.jpg";
import LindaKann from "../public/media/img/hedersmedlemmar/lk.jpg";

import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";
import { useState } from "react";

export default function Hedersmedlemmar({ contents }) {
  const [selectedMember, setSelectedMember] = useState();
  const stateUpdater = (member) => {
    let rootNode = document.getElementById("hedersmedlemmar-shelf");
    setSelectedMember(member);

    for (let hedersmedlem of rootNode.childNodes){
      hedersmedlem.className = 
      (hedersmedlem.id === member)? 
      "hedersmedlem active" : "hedersmedlem";
    }

  }
  return (
    <div id="contentbody">
      <div className="hedersmedlemmar">
        <h1>Hedersmedlemmar</h1>
        <MarkdownRender mdData={contents["hedersmedlemmar-info"]} />
        <div id="hedersmedlemmar-shelf">
          <div id="Jan-Scheffel" className="hedersmedlem" onClick={() => stateUpdater("Jan-Scheffel")}>
            <div className="imgdiv">
              <Image src={JanScheffel} alt="Jan Scheffel" />
            </div>
            <h2>Jan Scheffel</h2>
            <h3>2014</h3>
          </div>
          <div id="Hans-Thunberg" className="hedersmedlem" onClick={() => stateUpdater("Hans-Thunberg")}>
            <div className="imgdiv">
              <Image src={HansThunberg} alt="Hans Thunberg" />
            </div>
            <h2>Hans Thunberg</h2>
            <h3>2014</h3>
          </div>
          <div id="Mikael-Cronhjort" className="hedersmedlem" onClick={(e) => stateUpdater("Mikael-Cronhjort")}>
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
        <br/>
        <h1>Hedersorden</h1>
        <h2>Platina</h2>
        <ul id={"platina"}>
          <li>Felicia Rosenberg - 2022</li>
          <li>Veronica Vilbern - 2021</li>
          <li>Niklas Karlsson - 2021</li>
          <li>Ida Fantenberg - 2020</li>
          <li>Joakim Wassinge - 2019</li>
          <li>Charley Jönsson - 2019</li>
          <li>Evelina Bergman Laurén - 2019</li>
          <li>Diana Diez - 2018</li>
          <li>Victor Dahlberg - 2018</li>
          <li>Mollie Wejdenstolpe - 2018</li>
          <li>Alexander Koski - 2017</li>
          <li>Elisabet Lövkvist - 2017</li>
          <li>Niclas Lund - 2017</li>
        </ul>
        <h2>Guld</h2>
        <ul id={"gold"}>
          <li>Nima Mehrabadi - 2022</li>
          <li>Alexander Jansson - 2022</li>
          <li>Armin Baymani - 2022</li>
          <li>Erik Åman - 2022</li>
          <li>Nicole Polis - 2022</li>
          <li>Christoffer Nilsson - 2022</li>
          <li>Mikael Lundqvist - 2022</li>
          <li>Oscar Rohde Dahlberg - 2021</li>
          <li>Victor Hultén Mattsson - 2021</li>
          <li>Nelly Wannberg - 2021</li>
          <li>Jarl Wallheden - 2021</li>
          <li>Sabina Permats - 2021</li>
          <li>Maja Rosén - 2021</li>
          <li>Anna-Natalia Moustakas - 2020</li>
          <li>Carl Housten - 2020</li>
          <li>Felicia Rosenberg - 2020</li>
          <li>Felix Alin - 2020</li>
          <li>Josefin Kumlin - 2020</li>
          <li>Linda Frithiof - 2020</li>
          <li>Rebecka Ingram - 2020</li>
          <li>Veronica Vilbern - 2020</li>
          <li>Alexandra Jevring - 2019</li>
          <li>Emilia Kaufeldt - 2019</li>
          <li>Rickard Trollsås - 2019</li>
          <li>Evelina Bergman Laurén - 2018</li>
          <li>Joakim Wassinge - 2018</li>
          <li>Holly Lindkvist - 2018</li>
          <li>Helin Akgül - 2017</li>
          <li>Love Berzell - 2017</li>
          <li>Jonas Johansson - 2017</li>
          <li>Johanna Eng - 2017</li>
          <li>Felix Wahlgren - 2017</li>
          <li>Ellen Lennahl - 2017</li>
          <li>Victor Dahlberg - 2017</li>
          <li>Herman Högman Ording - 2017</li>
          <li>Johan Myrsmeden - 2016</li>
          <li>Elisabet Lövkvist - 2016</li>
          <li>Ellinor Olsson - 2016</li>
          <li>Axel Hill Eriksson - 2016</li>
          <li>Isabelle Wahlund - 2016</li>
          <li>Robin Aldenholt - 2016</li>
          <li>Eleonora Strand - 2016</li>
          <li>Mollie Wejdenstolpe - 2016</li>
          <li>Carl Lindén - 2016</li>
          <li>William Friefeldt - 2016</li>
          <li>David Wadelius - 2015</li>
          <li>Malin Engquist - 2015</li>
          <li>Mikael Ståhl - 2015</li>
          <li>Malin Lindell - 2015</li>
          <li>Alexandra Johansson - 2015</li>
          <li>Niclas Lund - 2015</li>
          <li>Malin Seller - 2015</li>
          <li>Anna Land - 2015</li>
          <li>Veine Haglund - 2015</li>
          <li>Sara Kristoffersson - 2015</li>
          <li>Robin Bramsäte - 2011</li>
          <li>Per-Viktor Bryntesson - 2011</li>
          <li>Petter Axén - 2011</li>
          <li>Joel Holmberg - 2011</li>
          <li>Jennifer Minnhagen - 2011</li>
          <li>Robert Westin - 2011</li>
          <li>Emelie Ernstsson - 2011</li>
          <li>Alexandra Sparrenlöv - 2011</li>
          <li>Sara Karlsson - 2011</li>
          <li>Gabriella David - 2011</li>
          <li>Anna Johansson - 2011</li>
          <li>Martin Pettersson - 2011</li>
        </ul>
        <h2>Silver</h2>
        <ul id={"silver"}>
          <li>Rafael Quick - 2022</li>
          <li>Nima Mehrabadi - 2022</li>
          <li>Felicia Rosenberg - 2021</li>
          <li>Linda Frithiof - 2021</li>
          <li>Sabina Permats - 2021</li>
          <li>Petra Lindeborg - 2021</li>
          <li>Felix Alin - 2020</li>
          <li>Ida Fantenberg Niklasson - 2020</li>
          <li>Oscar Rohde Dahlberg - 2019</li>
          <li>Niklas Karlsson - 2019</li>
          <li>Camilla Björn - 2019</li>
          <li>Veronica Vilbern - 2019</li>
          <li>Josefin Kumlin - 2019</li>
          <li>Diana Diez - 2018</li>
          <li>Victor Dahlberg - 2018</li>
          <li>Joakim Wassinge - 2018</li>
          <li>Evelina Bergman Laurén - 2018</li>
          <li>Charley Jönsson - 2018</li>
          <li>Gabriel Klingofström - 2018</li>
          <li>Ellen Lennahl - 2018</li>
          <li>Anna Björkman - 2018</li>
          <li>Alexander Koski - 2017</li>
          <li>Emilia Kaufeldt - 2017</li>
          <li>Hampus Eriksson - 2017</li>
          <li>Herman Högman Ording - 2017</li>
          <li>Johanna Kuniholm - 2017</li>
        </ul>

        <br />
        <MarkdownRender mdData={contents["hedersorden-info"]} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let contents = getContentData("hedersmedlemmar");
  return {
    props: {
      contents,
    }, // will be passed to the page component as props
  };
}
