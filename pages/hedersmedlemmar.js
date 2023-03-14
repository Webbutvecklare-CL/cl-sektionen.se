import Image from "next/image";
import JanScheffel from "../public/media/img/hedersmedlemmar/Jan_Scheffel_2013.jpg";
import HansThunberg from "../public/media/img/hedersmedlemmar/thunberg.jpg";
import MikaelCronhjort from "../public/media/img/hedersmedlemmar/Mikael-Cronhjort.jpg";
import LindaKann from "../public/media/img/hedersmedlemmar/lk.jpg";

function Hedersmedlemmar() {
  return (
    <div id="contentbody">
      <h1>Hedersmedlemmar</h1>
      <div className="hedersmedlemmar">
        <div className="hedersmedlem">
          <div className="imgdiv">
            <Image
              src={JanScheffel}
              alt="Jan Scheffel"
            />
          </div>
          <h2>Jan Scheffel</h2>
          <h3>20xx</h3>
        </div>
        <div className="hedersmedlem">
          <div className="imgdiv">
            <Image
              src={HansThunberg}
              alt="Hans Thunberg"
            />
          </div>
          <h2>Hans Thunberg</h2>
          <h3>20xx</h3>
        </div>
        <div className="hedersmedlem">
          <div className="imgdiv">
            <Image
              src={MikaelCronhjort}
              alt="Mikael Cronhjort"
            />
          </div>
          <h2>Mikael Cronhjort</h2>
          <h3>2020</h3>
        </div>
        <div className="hedersmedlem">
          <div className="imgdiv">
            <Image
              src={LindaKann}
              alt="Linda Kann"
            />
          </div>
          <h2>Linda Kann</h2>
          <h3>2022</h3>
        </div>
      </div>
      <h1>Hedersorden - platina</h1>
      <ul>
        <li>Charley Jönsson</li>
        <li>Veronica Vilbern</li>
        <li>Ida Fantenberh</li>
        <li>Felicia Rosenberg</li>
        <li>Niklas Karlsson</li>
      </ul>
    </div>
  );
}

export default Hedersmedlemmar;
