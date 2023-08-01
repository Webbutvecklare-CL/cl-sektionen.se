import Link from "next/link";
import Image from "next/image";
import CustomHead from "../../components/CustomHead";
import BackButton from "../../components/BackButton";

import statshusetBild from "../../public/media/img/Stockholms_stadshus.webp";

export default function Info() {
  return (
    <>
      <CustomHead
        metaTitle={`Mottagningsinfo | Sektionen för Civilingenjör och Lärare`}
        description={
          "Här finns viktig information och tips till dig som ska börja på programmet Civilingenjör och lärare."
        }
        url={"https://www.cl-sektionen.se/mottagning/schema"}
      />
      <div id="contentbody">
        <article>
          <BackButton page="mottagning">Mottagningssidan</BackButton>
          <div>
            <h1>Info-dumpen</h1>
            <strong>
              Här finns relevanta tips och resurser för dig som ska börja plugga på CL!
            </strong>
            <hr />
            <br />

            <div>
              <h2>Ny på KTH</h2>
              <p>
                Mycket av informationen på denna sida har hämtats från KTHs resurssida &quot;Ny på
                KTH&quot;. Du bör besöka sidan och bekanta dig med dess innehåll. Sidan är framtagen
                för att du som nyantagen ska enkelt kunna hitta viktiga resurser inför studiestarten
                och under din första tid på KTH.
                <br />
                <Link href="https://www.kth.se/student/studier/nypakth">Ny på KTH</Link>
              </p>
            </div>

            <div>
              <h2>Ställ dig i bostadskön och bli kårmedlem</h2>
              <p>
                Även om du bor i Stockholm är det en bra idé att ställa dig i bostadskön hos{" "}
                <Link href="https://sssb.se/">SSSB</Link>. Det är helt gratis ställa sig i kön och
                det enda kravet är att du är kårmedlem. På THS hemsida kan du läsa om alla förmåner
                som kårmedlemmar har. <br />
                <Link href="https://ths.kth.se/sv/membership">Läs mer om THS-medlemskap</Link>
              </p>
            </div>

            <div>
              <h2>Anmäl dig till rektorsmottagningen</h2>
              <Image
                alt="Statshuset"
                style={{ width: "100%", height: "auto" }}
                src={statshusetBild}
              />
              <p>
                Den 25 augusti håller KTH en ceremoni i statshuset för att välkommna nya studenter.
                Det finns begränsade platser och först till kvarn gäller.
                <br />
                <Link href="https://www.kth.se/student/studier/nypakth/rektors-mottagning-i-stockholms-stadshus-25-augusti-1.326539">
                  Du kan anmäla dig här!
                </Link>
              </p>
            </div>

            <div>
              <h2>Delta på Kårens Dag & Campus Fair</h2>
              <p>MER INFO KOMMER</p>
            </div>

            <div>
              <h2>FUNKA - Stöd för dig med funktionsnedsättning</h2>
              <p>
                Studenter med dokumenterad, varaktig funktionsnedsättning kan få kompensatoriskt
                stöd i sina studier vid KTH. Gruppen som samordnar stöden heter Funka. Det är dock
                viktigt att ansöka om FUNKA-stöd så tidigt som möjligt då hanläggningstiden kan vara
                upp till 3 veckor. På KTHs hemsida hittar du info om vilken typ av stöd som FUNKA
                erbjuder.
                <br />
                <Link href="https://www.kth.se/student/stod/studier/funktionsnedsattning">
                  Läs mer och ansök om FUNKA-stöd
                </Link>
              </p>
            </div>

            <div>
              <h2>Checklista inför studiestart</h2>
              <p>Se till att bocka av följande under mottagningen:</p>
              <ul>
                <li>
                  <Link href="https://www.kth.se/student/it/kth-account/kth-account-1.1162941">
                    <b>Aktivera ditt KTH-konto</b>
                  </Link>
                </li>
                <p>
                  Ett KTH-konto behövs för att kunna utnyttja KTH:s resurser.
                  <br />
                </p>
                <li>
                  <Link href="https://www.kth.se/student/studier/kurs/kursregistrering/kursregistrering-1.317058">
                    <b>Registrera dig på dina kurser</b>
                  </Link>
                </li>
                <p>
                  I samband med kursstart ska du kursregistrera dig på de kurser som du ska läsa,
                  annars riskerar du att förlora din plats.
                </p>
                <li>
                  <Link href="https://www.kth.se/student/it/studenttjanster/personligamenyn/koppla-mitt-schema">
                    <b>Exportera ditt schema</b>
                  </Link>
                </li>
                <p>
                  Du bör göra detta för att enkelt hitta till dina föreläsningar och övningar efter
                  mottagningen.
                </p>
                <li>
                  <b>Skaffa dig kurslitteraturen!</b>
                </li>
                <p>
                  Du kan köpa nästan all kurslitteratur på Kårbokhandeln i Nymble. Men du sparar
                  pengar om du köper i andra hand från äldre studenter. De har satt ihop ett
                  kalkylark där du enkelt kan se vilka som har böcker till salu. [LÄNK TILL ARKET]
                </p>
              </ul>
            </div>

            <div>
              <h2>Studie- och karriärvägledning (SYV)</h2>
              <p>
                KTH erbjuder alla studenter studie- och karriärvägledning, för att du ska utveckla
                effektiva studiestrategier och göra välgrundade val i din studiesituation.
                <br />
                <Link href="https://www.kth.se/social/program/clgym/page/kontakt-34/">
                  Läs mer om och kontakta CL:s studievägledare
                </Link>
              </p>
            </div>

            <div>
              <h2>Föreläsningssildes</h2>
              <p>
                Nedan finns slides, formulär och andra länkar som du har sett under mottagningens
                infopass.
              </p>
              <p>[MER INFO KOMMER]</p>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
