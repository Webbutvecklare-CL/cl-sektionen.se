import Image from 'next/image'
import Link from 'next/link'
import Sidhuvud from "../public/media/grafik/Sidhuvud.png"
import Sidhuvud_inv from "../public/media/grafik/sidhuvud_inv.png";
import React, { useState } from "react"
import MarkdownRender from '../components/MarkdownRender'

function Index() {
    const [open, setOpen] = useState(false);
    const toggleOm = (e) => {
        //Scrollar upp igen så man kommer till toppen
        if (open) {
            document.querySelectorAll('header')[0].scrollIntoView();
        } else {
            document.querySelectorAll('#om-cl')[0].scrollIntoView();
        }
        setOpen(!open);
    };

  return (
    <div>
    <div className="index_bg">
      <Image
        src = {Sidhuvud_inv}
        alt = 'sektionslogga, sidhuvud vitt'
        className='sektionslogga_vitt'
      />
    </div>
    <div className='bg_bottom_cover'></div>
    <div id="contentbody" className="index_content">
      <header>
        <h1>
            Sektionen för Civilingenjör &amp; Lärare
        </h1>
        <h2>
            Dubbel examen, dubbel kompetens
        </h2>
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
              &quot;<span style={{color: "var(--clr5)", fontWeight: "600"}}>C</span>tyre<span style={{color: "var(--clr5)", fontWeight: "600"}}>L</span>sen&quot;
              samt ett antal nämnder och övriga förtroendevalda. Läs mer om sektionens nämnder och förtroendevalda på&nbsp;
              <Link href="/fortroendevalda">Denna sida</Link>.
            </p>
            <Image 
                src = {Sidhuvud}
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
            <ul style={{marginTop: "-1rem"}}>
                <li>Matematik och fysik, <strong>(MAFY)</strong></li>
                <li>Matematik och kemi, <strong>(MAKE)</strong></li>
                <li>Matematik och teknik med specialisering mot energi och miljö, <strong>(TEMI)</strong></li>
                <li>Matematik och teknik med specialisering mot datateknik, <strong>(TEDA)</strong></li>
            </ul>
          </section>
        </section>
      </div>
      <hr/>
      <div className='visa_om_knapp_div'>
        <button className="visa_om_knapp" onClick={toggleOm}>
            Om CL {open? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}
        </button>
      </div>
      <section className="mini_aktuellt_o_kalender">
        <div className='event_o_aktuellt'>
          <div className='mini_aktuellt'>
            <div className='aktuellt_innehåll'>
              <h1>Aktuellt</h1>
              Här<br/>
              kommer<br/>
              aktuella<br/>
              inlägg<br/>
              senare...<br/>
            </div>
          </div>
          <div className='mini_event'>
            <div className='event_innehåll'>
              <h1>Event</h1>
              Här<br/>
              kommer<br/>
              event<br/>
              senare...<br/>
            </div>
          </div>
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
        <div>
          <h1>Hjälp vid illabehandling</h1>
          <p>
            Det finns stöd för dig som du blir utsatt för diskriminering, trakasserier eller annan illabehandling av en annan student, en lärare eller övrig personal på KTH.
            Sektionens skyddsombud har tystnadsplikt och kan hjälpa dig om något inträffat. Du kan också alltid vända dig till JML-nämndens ordförande eller Ledamot för 
            studiesociala- och JML-frågor i sektionsstyrelsen. Då får du stöd och hjälp att anmäla incidenten till KTH eller annan relevant instans.
          </p>
          <p>
            Du kan både anmäla sådant som du själv utsatts för och sådant som andra utsatts för och du kan självklart välja att vara anonym. Ingen incident är för liten, 
            utan det är jätteviktigt att allt lyfts så att det kan åtgärdas!
          </p>
          <p>
            Följande länk leder till ett formulär där anmälan om illabehandling kan göras till sektionens skyddsombud.
            <br/><Link href={"https://forms.gle/28p5Y6c4ToNe4K9t6"}> Anmälningsformulär<i className="fa-solid fa-arrow-up-right-from-square"/></Link>
            <br/><Link className='illabehandling_knapp' href={"/hjalp-vid-illabehandling"}>            
              <button >
                Mer information
              </button>
            </Link>
          </p>
        </div>
        <div>
          <h1>Ny student</h1>
          <MarkdownRender
            source={`../content/ny-student.md`}
          />
        </div>
      </section>
      {/*
      <hr/>
      <section className="företag">
        <h1>För företag</h1>
      </section>
      */}
    </div>
  </div>
  )
}
export default Index;
