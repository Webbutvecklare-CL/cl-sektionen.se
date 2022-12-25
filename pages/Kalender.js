function Kalender(){
    return (
        <div id="contentbody">
            <h1>kalender</h1>
            <p>
                Här kan du se både vad som händer i Gråttan och event som sektionen anordnar. 
                Du kan även klicka dig in på eventen för att se detaljer kring det. 
                Om du är intresserad av att boka sektionslokalen kan du enkelt göra detta genom att maila lokalansvarig på:
                <br/><strong>lokalnamnden@cl-sektionen.se</strong>
            </p>
            <h2>psst!!</h2>
            <p>Du kan också exportera sektionskalendern till din egna för att komma åt den enklare. <a href="https://calendar.google.com/calendar/embed?src=c_5sqhb0om2kmti770g06qqknfik%40group.calendar.google.com&ctz=Europe%2FBerlin">Tryck här för att komma till kalendersidan där det finns en knapp för att exportera sektionskalendern.</a> </p>
            <div id="tabs">
                <input id="tab1" type="radio" name="tabs" value="tab1" checked="checked"/>
                <label for="tab1" id="tab-knapp" onclick="openTab('sektionskal')"><h1>Sektionskalendern</h1></label>
                <input id="tab2" type="radio" name="tabs" value="tab2"/>
                <label for="tab2" id="tab-knapp" onclick="openTab('gråttkal')"><h1>Gråttans kalender</h1></label>
            </div>
            <div id="sektionskal" class="kalenderTab">
            <iframe id="open-web-calendar" 
                style={{background: "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat;"}}
                src="https://open-web-calendar.hosted.quelltext.eu/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fc_5sqhb0om2kmti770g06qqknfik%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;title=Sektionskalendern&amp;language=sv&amp;tab=week"
                sandbox="allow-scripts allow-same-origin allow-top-navigation"
                allowTransparency="true" scrolling="no" 
                frameborder="0" height="600px" width="100%">
            </iframe>
            </div>
            <div id="gråttkal" class="kalenderTab" style={{display: "none"}}>
                <iframe class="open-web-calendar" onload="this.contentWindow.document.documentElement.scrollTop=100"
                        src="https://open-web-calendar.herokuapp.com/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2F008gpl3s787te6jhipk5729c6g%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&amp;title=Gr%C3%A5ttan&amp;language=sv&amp;css=.event%2C%20.dhx_cal_tab.active%2C%20.dhx_cal_tab.active%3Ahover%20%7Bbackground-color%3A%20%23c63022%3B%7D%20.dhx_month_head%2C%20.dhx_cal_tab%2C%20.dhx_cal_today_button%20%7Bcolor%3A%20%23c63022%3B%7D%20.dhx_cal_tab%2C%20.dhx_cal_tab.active%20%7Bborder-color%3A%20%23c63022%3B%7D%0A&amp;target=_blank&amp;tab=month"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        allowTransparency="true" scrolling="no" 
                        frameborder="0" width="100%">
                </iframe>
            </div>
        </div>
    )
}
export default Kalender