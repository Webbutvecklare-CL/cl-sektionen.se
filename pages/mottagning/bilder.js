import CustomHead from "../../components/CustomHead";
import BackButton from "../../components/BackButton";
import Card from "../../components/Card";
import styles from "../../styles/mottagning/mottagning.module.css";
import { regular, image } from "../../styles/fontawesome.module.css";

export default function Bilder() {
  return (
    <>
      <CustomHead
        metaTitle={`Mottagningsbilder | Sektionen för Civilingenjör och Lärare`}
        description={"Här finns alla bilder tagna under mottagningen."}
        url={"https://www.cl-sektionen.se/mottagning/bilder"}
      />
      <div id="contentbody">
        <article>
          <BackButton page="mottagning">Mottagningssidan</BackButton>
          <div>
            <br />
            <p>
              Här hittar du länkar till Google Photos album som innehåller alla mottagningsbilder.
              Tänk på att inte dela bilder på andra utan tillåtelse.
              <br />
              Kontakta <strong>knäppis</strong> om du inte vill synas på bild.
            </p>
            <h2>Första veckan v.33</h2>
            <div className={styles.cardList}>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Måndag, 2023-08-14
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Tisdag, 2023-08-15
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Onsdag, 2023-08-16
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Torsdag, 2023-08-17
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Fredag, 2023-08-18
              </Card>
            </div>
            <h2>Andra veckan v.34</h2>
            <div className={styles.cardList}>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Måndag, 2023-08-21
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Tisdag, 2023-08-22
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Onsdag, 2023-08-23
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Torsdag, 2023-08-24
              </Card>
              <Card link={""}>
                <i className={`${regular} ${image}`} /> Fredag, 2023-08-25
              </Card>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
