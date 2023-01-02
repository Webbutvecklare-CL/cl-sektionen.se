import React, { useState } from "react";

function Kalender(){
    const [show, setShow] = useState(true);
    function toggleKalender(knapp){
        setShow(!show);
        knapp.innerHTML = show? "Visa Sektionskalendern" : "Visa Gråttkalendern";
    }

    return (
        <div id="contentbody">
            <h1>Kalender</h1>
            <p>
                Här kan du se både vad som händer i Gråttan och event som sektionen anordnar. 
                Du kan även klicka dig in på eventen för att se detaljer kring det. 
                Om du är intresserad av att boka sektionslokalen kan du enkelt göra detta genom att maila lokalansvarig på:
                <br/><strong>lokalnamnden@cl-sektionen.se</strong>
            </p>
            <div className="controlls_tab">
                <p>
                    <b>Psst!!</b>  Du kan exportera sektionens kalendrar för att komma åt dem enklare.<br/>
                    <a href="https://calendar.google.com/calendar/embed?src=c_5sqhb0om2kmti770g06qqknfik%40group.calendar.google.com&ctz=Europe%2FBerlin">
                        Tryck här</a>
                    &nbsp;för att exportera <strong>sektionskalendern</strong>.<br/>
                    <a href="https://calendar.google.com/calendar/u/0/embed?height=700&wkst=2&bgcolor=%23616161&ctz=Europe/Stockholm&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=MONTH&src=MDA4Z3BsM3M3ODd0ZTZqaGlwazU3MjljNmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=a29uc3VtY2x3QGdtYWlsLmNvbQ&color=%237CB342&color=%23AD1457&pli=1">
                        Tryck här</a>
                    &nbsp;för att exportera <strong>gråttkalendern</strong>.
                </p>
                <button className="kal_knapp" onClick={(e) => {toggleKalender(e.target);}}>Visa Gråttkalendern</button>
            </div>
            
            <div id="sektionskal" className="kalender_tab" style={{display: show? "block":"none"}}>
                <h1 className="kal_titel">Sektionskalendern</h1>
                <iframe id="open-web-calendar" 
                    style={{background: "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat"}}
                    src="https://open-web-calendar-master-tsa2cnoe3a-lz.a.run.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fc_5sqhb0om2kmti770g06qqknfik%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv"
                    sandbox="allow-scripts allow-same-origin allow-top-navigation" scrolling="no" 
                    frameBorder="0" height="750px" width="100%">
                </iframe>
            </div>
            <div id="gråttkal" className="kalender_tab" style={{display: show? "none":"block"}}>
                <h1 className="kal_titel">Gråttans kalender</h1>
                <iframe id="open-web-calendar" 
                    style={{background: "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat"}}
                    src="https://open-web-calendar-master-tsa2cnoe3a-lz.a.run.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&amp;language=sv"
                    sandbox="allow-scripts allow-same-origin allow-top-navigation" scrolling="no" 
                    frameBorder="0" height="750px" width="100%">
                </iframe>
            </div>
        </div>
    )
}
export default Kalender