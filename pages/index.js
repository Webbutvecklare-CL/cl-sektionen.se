import Image from 'next/image'
import Link from 'next/link'
import bg from '../public/media/img/KTHcover.jpg'
import CL_logo_stor from "../public/media/grafik/sidhuvud_inv.png"
import React, { useState } from "react"

function Index() {
  const [open, setOpen] = useState(false);
  const toggleOm = () => {setOpen(!open)};

  return (
    <div>
      <div className="index_bg">
        <Image
          src={bg}
          alt="Bakgrundsbild KTH"
          fill
        />
      </div>
    <div className='bg_bottom_cover'></div>
    <div id="contentbody" className="index_content">
      <header className='title_grid'>
        <div>
          <h1>
              Sektionen för Civilingenjör &amp; Lärare
          </h1>
          <h2>
              Dubbel examen, dubbel kompetens
          </h2>
        </div>
        <button className="visa_om_knapp" onClick={toggleOm}>
          Tryck här för att läsa om CL
          <br/>
          {open? <i className="fa-solid fa-arrow-up"></i> : <i className="fa-solid fa-arrow-down"></i>}
        </button>
      </header>
      
      <div className={open? "open" : "collapsed"}>
        <hr/>
        <section className="om">
          <section>
            <h2>Om sektionen</h2>
            <p>
              <b>Sektionen</b> för Civilingenjör & Lärare är en ideell studentsektion under Tekniska Högskolan 
              och företräder alla som studerar på Programmet för Civilingenjör och lärare på KTH.
            </p>
            <p>
              Sektionens syfte är att värna om alla programstuderande under dess studietid. Detta strävar vi efter genom 
              att bedriva utbildningsbevakning, näringslivsverksamhet och studiesocial verksamhet. Ansvaret för sektionens 
              arbete är uppdelad mellan sektionsstyrelsen 
              &quot;<span style={{color: "var(--djuprod)", fontWeight: "600"}}>C</span>tyre<span style={{color: "var(--djuprod)", fontWeight: "600"}}>L</span>sen&quot;
              samt ett antal nämnder och övriga förtroendevalda. Läs mer om sektionens nämnder och förtroendevalda på&nbsp;
              <Link href="/Fortroendevalda">Denna sida</Link>.
            </p>
            <Image 
                src = {CL_logo_stor}
                alt = "sektionslogga, sidhuvud"
                className="sektionslogga"
            />
          </section>
          <section>
            <h2>Om programmet</h2>
            <p>
              <b>Programmet</b> Civilingenjör och lärare 300 hp (förkortas CL) är ett högskoleprogram som sedan 2002 erbjuds på KTH. 
              Utbildningen leder till dubbla yrkesexamina, en fullständig civilingenjörsexamen samt en komplett lärarutbildning med behörighet 
              för undervisning i gymnasieskolan och den senare delen av grundskolan. Båda examen ges av KTH, men större delen av 
              undervisningen i pedagogik ges av Stockholms Universitet.
            </p>
            <p>
              Sedan 2011 finns fyra inriktningar på programmet. De olika inriktningarna samläser med motsvarande civilingenjörsutbildning 
              och ger behörighet för undervisning i olika gymansiekurser. De fyra inriktningarna är:
            </p>
            <ul>
                <li>Matematik och fysik, <strong>(MAFY)</strong></li>
                <li>Matematik och kemi, <strong>(MAKE)</strong></li>
                <li>Matematik och teknik med specialisering mot energi och miljö, <strong>(TEMI)</strong></li>
                <li>Matematik och teknik med specialisering mot datateknik, <strong>(TEDA)</strong></li>
            </ul>
          </section>
        </section>
      </div>
      <hr/>
      <section className="mini_aktuellt_o_kalender">
        <div className='mini_aktuellt'>
          <h1>Aktuellt</h1>
          Här<br/>
          kommer<br/>
          aktuella<br/>
          inlägg<br/>
          senare...<br/>
        </div>
        <div className='mini_kalender kalender_tab'>
          <h1 className="kal_titel">Sektionskalendern idag</h1>
          <iframe id="open-web-calendar" 
            style={{background: "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat"}}
            src="https://open-web-calendar-master-tsa2cnoe3a-lz.a.run.app/calendar.html?specification_url=https://gist.githubusercontent.com/Webbutvecklare-CL/092a7b69c4b1052101b8ca240bbc91d8/raw/b7ebc57157208cd681d8ac18437992a6b1e1c847/SektionskalendernDayview.json"
            sandbox="allow-scripts allow-same-origin allow-top-navigation" scrolling="no" 
            frameBorder="0" height="600px" width="100%">
          </iframe>
        </div>
      </section>
      <hr/>
      <section className="resurser">
        <h1>Resurser</h1>
        <h2>Hjälp vid illabehandling</h2>
        <h2>Ny student</h2>
        <h2>Studiebevakning</h2>
      </section>
      <hr/>
      <section className="företag">
        <h1>För företag</h1>
      </section>
    </div>
  </div>
  )
}
export default Index