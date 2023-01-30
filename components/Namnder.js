import Mail from "./mail";

const CtyreLsen = () => {
    return(
        <div>
            <h1>CtyreLsen <i className="fa-solid fa-gavel"/></h1>
            <p className="nämnd_beskrivning">
                Sektionsstyrelsen, eller CtyreLsen, har ett övergripande ansvar för att 
                vidareutveckla sektionens verksamhet. Styrelsen består av Ordförande, 
                Vice ordförande tillika Sekreterare, Kassör och ledamöter. Ledamöternas 
                har delat upp arbetet mellan sig i ansvarsområdena Näringsliv, Studiesocialt 
                och Utbildningsfrågor. 
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Gustav Heldt, <b>Ordförande </b><br/>
                    <Mail mailadress="ordf@cl-sektionen.se"/><br/><br/>

                    Andrea Donné, <b>Vice ordförande tillika sekreterare </b><br/>
                    <Mail mailadress="vordf@cl-sektionen.se"/><br/><br/>

                    Matilda Algotsson, <b>Kassör</b><br/>
                    <Mail mailadress="ekonomi@cl-sektionen.se"/><br/><br/>

                    Alexander Jansson, <b>Ledamot för utbildningsfrågor</b><br/>
                    <Mail mailadress="utbildning@cl-sektionen.se"/><br/><br/>

                    Fanny Enocksson, <b>Ledamot för studiesociala- och JML-frågor</b><br/>
                    <Mail mailadress="studiesocialt@cl-sektionen.se"/><br/><br/>

                    Emelie Selinder, <b>Ledamot för näringslivsfrågor och kommunikation</b><br/>
                    <Mail mailadress="naringsliv@cl-sektionen.se"/><br/><br/>
                    
                </div>
            </section>
        </div>
    )
};


const Studienamnden = () => {
    return(
        <div>
            <h1>Studienämnden <i className="fa-solid fa-book"/></h1>
            <p className="nämnd_beskrivning">
                Studienämnden består av flera personer vars uppgift är att bevaka 
                studierna på KTH; att kursernas mål uppfylls och att utformningen är 
                optimal. Personerna ska också följa utvecklingen av kända 
                ”problemkurser” och arbeta aktivt för att öka sektionens inflytande 
                i studierna på KTH. Nämnden består av ordförande, programansvarig 
                student och utbildningsbevakare. Förutom studiebevakning anordnar 
                nämnden även studiefrämjande event, såsom studiefrukost med W-sektionen. 
                Om du har klagomål eller åsikter om en kurs är det till Studienämnden du 
                vänder dig! 
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Moa Wettby, <b>Studienämndens Ordförande </b><br/>
                    <Mail mailadress="sno@cl-sektionen.se"/><br/><br/>

                    Viktor Hallberg, <b>Programansvarig Student </b><br/>
                    <Mail mailadress="pas@cl-sektionen.se"/><br/><br/>

                    Svante Holgersson, <b>Utbildningsbevakare</b><br/>
                    <Mail mailadress="ubbe@cl-sektionen.se"/><br/><br/>

                    Aron Johansson, <b>Utbytesansvarig</b><br/>
                    <Mail mailadress="?????"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Naringslivsnamnden = () => {
    return(
        <div>
            <h1>Näringslivsnämnden <i class="fa-solid fa-sack-dollar"/></h1>
            <p className="nämnd_beskrivning">
                Näringslivsnämnden har ansvar för kontakten med näringslivet och sektionens sponsorer 
                samt sektionens ansikte utåt i form av webbsidan och sociala medier. Näringslivsnämnden 
                anordnar evenemang som CV-workshops, LinkedIn-workshops och lunchföreläsningar. Nämnden 
                representerar sektionen vid THS Näringslivsråd. 
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Fabian Olesen, <b>Näringslivsnämndens Ordförande </b><br/>
                    <Mail mailadress="ordf.naringsliv@cl-sektionen.se"/><br/><br/>

                    Viktor Uhlgren, <b>Arbetsmarknadsansvarig </b><br/>
                    <Mail mailadress="arbetsmarknad@cl-sektionen.se"/><br/><br/>

                    Jesper Svensson, <b>Webbunderhållare </b><br/>
                    <Mail mailadress="webmaster@cl-sektionen.se"/><br/><br/>

                    Armin Baymani, <b>Webbutvecklare</b><br/>
                    <Mail mailadress="webbutvecklare@cl-sektionen.se"/><br/><br/>

                    Tuva Egman, <b>PR-ansvarig</b><br/>
                    <Mail mailadress="pransvarig@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Mottagningsnamnden = () => {
    return(
        <div>
            <h1>Mottagningsnämnden <i className="fa-solid fa-heart"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Oscar Ekström, <b>Mottagningsansvarig</b><br/>
                    <Mail mailadress="mottagningen@cl-sektionen.se"/><br/><br/>

                    Emma Östling, <b>Vice Mottagningsansvarig</b><br/>
                    <Mail mailadress="vice.mottagningen@cl-sektionen.se"/><br/><br/>

                    Joar Söderman, <b>Ekonomiskt ansvarig för mottagningen</b><br/>
                    <Mail mailadress="ekonomi.mottagningen@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const JMLnamnden = () => {
    return(
        <div>
            <h1>JML-nämnden <i className="fa-solid fa-apple-whole"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Maja Jansson, <b>Ordförande</b><br/>
                    <Mail mailadress="jml@cl-sektionen.se"/><br/><br/>
                    Gabriella Hajto, <b>Vice Ordförande tillika Studerandeskyddsombud</b><br/>
                    <Mail mailadress="skyddsombud@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Aktivitetsnamnden = () => {
    return(
        <div>
            <h1>Aktivitetsnämnden <i className="fa-solid fa-person-running"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Rasmus Harders, <b>Aktivitetsnämndens ordförande</b><br/>
                    <Mail mailadress="aktivitetsnamnden@cl-sektionen.se"/><br/><br/>

                    Aron Johansson, <b>Aktivitetsnämndens vice ordförande</b><br/>
                    <Mail mailadress="vice.aktivitetsnamnden@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Lokalnamnden = () => {
    return(
        <div>
            <h1>Lokalnämnden <i className="fa-solid fa-house"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Anders Wallenthin, <b>Ordförande</b><br/>
                    <Mail mailadress="lokalnamnden@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const CLubWasteriet = () => {
    return(
        <div>
            <h1>CLubWästeriet <i className="fa-solid fa-wine-glass"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2021.04.30 - 2022.04.30</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Frida Andersson, <b>Klubbmästare - CL</b><br/>
                    <Mail mailadress="clw@cl-sektionen.se"/><br/><br/>
                
                    Hampus Lind, <b>Klubbmästare - W</b><br/>
                    <Mail mailadress="clw@cl-sektionen.se"/><br/><br/>

                    Maria Kolte, <b>Vice Klubbmästare tillika Ekonomiskt ansvarig</b><br/>
                    <Mail mailadress="clw@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Valberedningen = () => {
    return(
        <div>
            <h1>Valberedningen <i class="fa-solid fa-fish-fins"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2022.04.30 - 2023.4.30</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    David Böhrens Radö, <b>Femmans representant</b><br/>
                    <Mail mailadress="val@cl-sektionen.se"/><br/><br/>

                    Sander Söderberg, <b>Fyrans representant</b><br/>
                    <Mail mailadress="val@cl-sektionen.se"/><br/><br/>

                    Lea Martinelle, <b>Treans representant (sammankallande)</b><br/>
                    <Mail mailadress="val@cl-sektionen.se"/><br/><br/>

                    Matilda Algotsson, <b>Tvåans representant</b><br/>
                    <Mail mailadress="val@cl-sektionen.se"/><br/><br/>

                    Fabian Olesen, <b>Ettans representant</b><br/>
                    <Mail mailadress="val@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Revisorer = () => {
    return(
        <div>
            <h1>Revisorer <i class="fa-solid fa-scale-balanced"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Erik Åman, <b>Revisor</b><br/>
                    <Mail mailadress="revisor@cl-sektionen.se"/><br/><br/>
                
                    Emil Rapp, <b>Revisor</b><br/>
                    <Mail mailadress="revisor@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Fanborg = () => {
    return(
        <div>
            <h1>Fonborg <i class="fa-solid fa-flag"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2022.01.01 - 2023.01.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Felicia Rosenberg, <b>Fanbärare</b><br/>
                    <Mail mailadress="fanborg@cl-sektionen.se"/><br/><br/>

                    Felix Alin, <b>Vice Fanbärare</b><br/>
                    <Mail mailadress="fanborg@cl-sektionen.se"/><br/><br/>

                    Anna-Natalia Moustakas, <b>Fanbärare Suppleant</b><br/>
                    <Mail mailadress="fanborg@cl-sektionen.se"/><br/><br/>

                    Christoffer Nilsson, <b>Fanbärare Suppleant</b><br/>
                    <Mail mailadress="fanborg@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Kf = () => {
    return(
        <div>
            <h1>Kårfullmäktigedelegation <i class="fa-solid fa-section"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2022.07.01 - 2023.6.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Moa Wettby, <b>Kårfullmäktigedelegation</b><br/>
                    <Mail mailadress="kf@cl-sektionen.se"/><br/><br/>
                    Samuel Molin, <b>Kårfullmäktigedelegation Suppleant</b><br/>
                    <Mail mailadress="kf@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Enskilda = () => {
    return(
        <div>
            <h1>Enkilda poster <i class="fa-solid fa-otter"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/>
            <span className="mandat_period">Mandatperiod 2023.01.01 - 2023.12.31</span>
            <br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Veronica Vilbern, <b>Talman</b> <i class="fa-solid fa-comments"/><br/><br/>
                    
                    Mikael &quot;Moppe&quot; Lundkvist, <b>Försäljningsansvarig</b> <i class="fa-solid fa-store"/><br/>
                    <Mail mailadress="forsaljning@cl-sektionen.se"/><br/><br/>
                    
                    Astrid Joseph, <b>Idrottsansvarig </b><i class="fa-solid fa-basketball"/><br/>
                    <Mail mailadress="idrott@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const CLek = () => {
    return(
        <div>
            <h1>CLek <i class="fa-solid fa-dice"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/><br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Vera Roos, <b>Ordförande</b><br/>
                    <Mail mailadress="clek@cl-sektionen.se"/><br/><br/>

                    Tuva Egman, <b>Vice Ordförande</b><br/>
                    <Mail mailadress="clek@cl-sektionen.se"/><br/><br/>

                    Saraa Engström, <b>Ekonomiskt Ansvarig</b><br/>
                    <Mail mailadress="clek@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const Dubbelspexet = () => {
    return(
        <div>
            <h1>Dubbelspexet <i class="fa-solid fa-masks-theater"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/><br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Holly Lindqvist, <b>DireKTHréce</b><br/>
                    <Mail mailadress="dubbelspexet@cl-sektionen.se"/><br/><br/>

                    Mollie Wejdenstolpe, <b>Ekonomiskt Ansvarig</b><br/>
                    <Mail mailadress="dubbelspexet@cl-sektionen.se"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const CLak = () => {
    return(
        <div>
            <h1>CLak <i class="fa-solid fa-arrow-trend-up"/></h1>
            <p className="nämnd_beskrivning">
            </p>
            <hr/><br/>
            <section className="nämnd_namnochkontakt">
                <div className="poster">
                    Lucas Bensson, <b>Ordförande</b><br/>
                    <Mail mailadress="??"/><br/><br/>
                </div>
            </section>
        </div>
    )
};

const namnder = {
    "CtyreLsen" : <CtyreLsen/>, 
    "Studienämnden": <Studienamnden/>, 
    "Näringslivsnämnden": <Naringslivsnamnden/>, 
    "Mottagningsnämnden": <Mottagningsnamnden/>, 
    "JML-nämnden": <JMLnamnden/>, 
    "Aktivitetsnämnden": <Aktivitetsnamnden/>, 
    "Lokalnämnden": <Lokalnamnden/>, 
    "CLubWästeriet": <CLubWasteriet/>, 
    "Valberedningen": <Valberedningen/>, 
    "Revisorer": <Revisorer/>, 
    "Fanborg": <Fanborg/>, 
    "Kårfullmäktigedelegation": <Kf/>, 
    "Enskilda": <Enskilda/>, 
    "CLek": <CLek/>, 
    "Dubbelspexet": <Dubbelspexet/>, 
    "CLak": <CLak/>
};

export default namnder;