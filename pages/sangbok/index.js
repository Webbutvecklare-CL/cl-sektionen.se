import Link from "next/link";
import { useState } from "react";

function Sangbok() {
    const [search, setSearch] = useState("")
    
    return (
        <div id="contentbody">
            <h1>Sångbok</h1>
            <p>Nedan finner du samtliga sånger från sektionens officiella sångbok. Fysisk kopia av 
                sångboken finns att köpa för 130 kr. Prata med försäljningsansvarig! Samtliga 
                illustrationer är skapade av Rebecka Ingram CL18.</p>

            <input 
                type="text" 
                placeholder="Sök efter sång..."
                onChange={(e) => setSearch(e.target.value)}
                className="searchbar"
            ></input>
            <br></br>

            {sånger.filter((sång) => {
                return search.toLowerCase() === "" ? 
                    sång : 
                    sång.title.toLowerCase().includes(search.toLowerCase());
            }).map((sång) =>
                <div className="sånglänk">
                    <Link href={`sangbok${sång.href}`}>
                        {sång.title}
                    </Link>
                    <span className="sångsida">
                        &nbsp; s.{sång.sida}
                    </span>
                </div>
            )}
        </div>
    );
} export default Sangbok;

const sånger = [
    { "title": "800 rader", "href": "/800_rader", "sida":"86"},
    { "title": "Alla sorters punsch", "href": "/alla_sorters_punsch", "sida":"71" },
    { "title": "Bordeaux, Bordeaux", "href": "/bordeaux_bordeaux", "sida":"51" },
    { "title": "Byssan full", "href": "/byssan_full", "sida":"60" },
    { "title": "CL i mitt hjärta", "href": "/cl_i_mitt_hjarta", "sida":"93" },
    { "title": "Crassus vinsång", "href": "/crassus_vinsang", "sida":"54" },
    { "title": "Danse Macabre", "href": "/danse_macabre", "sida":"39" },
    { "title": "Den som spar hen har", "href": "/den_som_spar_hen_har", "sida":"65" },
    { "title": "Den vingklippta måsen", "href": "/den_vingklippta_masen", "sida":"59" },
    { "title": "Denna thaft", "href": "/denna_thaft", "sida":"68" },
    { "title": "Det regnar ner i dalen", "href": "/det_regnar_ner_i_dalen", "sida":"36" },
    { "title": "Djungelpunsch", "href": "/djungelpunsch", "sida":"72" },
    { "title": "Dominoeffekten", "href": "/dominoeffekten", "sida":"43" },
    { "title": "Du gamla, du fria", "href": "/du_gamla_du_fria", "sida":"26" },
    { "title": "Du gamla vin", "href": "/du_gamla_vin", "sida":"56" },
    { "title": "Du ska få mitt gamla snapsglas", "href": "/du_ska_fa_mitt_gamla_snapsglas", "sida":"60" },
    { "title": "Emojivisan", "href": "/emojivisan", "sida":"79" },
    { "title": "En gång i månan", "href": "/en_gang_i_manen", "sida":"61" },
    { "title": "En kan dricka vatten", "href": "/en_kan_dricka_vatten", "sida":"38" },
    { "title": "En liten blå förgätmigej", "href": "/en_liten_bla_forgatmigej", "sida":"21" },
    { "title": "En liten teknolog", "href": "/en_liten_teknolog", "sida":"83" },
    { "title": "En matematiker", "href": "/en_matematiker", "sida":"88" },
    { "title": "En pilsnerdrickare", "href": "/en_pilsnerdrickare", "sida":"49" },
    { "title": "Enhetsvisan (Système International)", "href": "/enhetsvisan", "sida":"78" },
    { "title": "Femton fransyskor", "href": "/femton_fransyskor", "sida":"52" },
    { "title": "Festen ska börjas", "href": "/festen_ska_borjas", "sida":"32" },
    { "title": "FESTU:s punschvisa", "href": "/festus_punschvisa", "sida":"73" },
    { "title": "Finland är Finland", "href": "/finland_ar_finland", "sida":"46" },
    { "title": "Fiskarna", "href": "/fiskarna", "sida":"62" },
    { "title": "Fkåne faft", "href": "/fkane_faft", "sida":"68" },
    { "title": "Försvarstal för broder Tuck", "href": "/forsvarstal_for_broder_tuck", "sida":"44" },
    { "title": "Fredmans sång nummer 21", "href": "/fredmans_sang_nr_21", "sida":"30" },
    { "title": "Full är bäst", "href": "/full_ar_bast", "sida":"38" },
    { "title": "Gråttans sång", "href": "/grattans_sang", "sida":"96" },
    { "title": "Gräv ur den skandinaviska tundran", "href": "/grav_ur_skandinaviska_tundran", "sida":"67" },
    { "title": "Gräv ur tundran", "href": "/grav_ur_tundran", "sida":"67" },
    { "title": "Gums visa", "href": "/gums_visa", "sida":"63" },
    { "title": "Hallen lutar", "href": "/hallen_lutar", "sida":"40" },
    { "title": "Hej tomtegubbar", "href": "/hej_tomtegubbar", "sida":"63" },
    { "title": "Hell and Gore", "href": "/hell_and_gore", "sida":"68" },
    { "title": "Humlorna", "href": "/humlorna", "sida":"62" },
    { "title": "I Californien", "href": "/i_californien", "sida":"42" },
    { "title": "Identitetskris", "href": "/identitetskris", "sida":"90" },
    { "title": "Imperial punsch", "href": "/imperial_punsch", "sida":"74" },
    { "title": "Imperial system", "href": "/imperial_system", "sida":"78" },
    { "title": "Integrera", "href": "/integrera", "sida":"85" },
    { "title": "Jag har aldrig var\’t på snusen (m.m.)", "href": "/jag_har_aldrig", "sida":"98" },
    { "title": "Jag ska festa", "href": "/jag_ska_festa", "sida":"33" },
    { "title": "JASen", "href": "/jasen", "sida":"59" },
    { "title": "Kalmarevisan", "href": "/kalmare_visan", "sida":"34" },
    { "title": "Kasta supen", "href": "/kastasupen", "sida":"61" },
    { "title": "Kemisången", "href": "/kemisangen", "sida":"78" },
    { "title": "Kungssången", "href": "/kungssangen", "sida":"23" },
    { "title": "Livet i Gråttan", "href": "/livet_i_grattan", "sida":"92" },
    { "title": "Livsmusik", "href": "/livsmusik", "sida":"29" },
    { "title": "Lyft ditt välförsedda glas", "href": "/lyft_ditt_valforsedda_glas", "sida":"43" },
    { "title": "Magistratets makt", "href": "/magistratets_makt", "sida":"94" },
    { "title": "Matlab", "href": "/matlab", "sida":"82" },
    { "title": "Mellansup", "href": "/mellansup", "sida":"32" },
    { "title": "Moosen", "href": "/moosen", "sida":"58" },
    { "title": "Musen", "href": "/musen", "sida":"59" },
    { "title": "Måsen", "href": "/masen", "sida":"58" },
    { "title": "När kaffet är serverat", "href": "/nar_kaffet_ar_serverat", "sida":"74" },
    { "title": "O gamla klang och jubeltid", "href": "/o_gamla_klang_och_jubeltid", "sida":"24" },
    { "title": "O hemska labb", "href": "/o_hemska_labb", "sida":"84" },
    { "title": "Ode till skon", "href": "/ode_till_skon", "sida":"49" },
    { "title": "Osqviksägen", "href": "/osqviksagen", "sida":"91" },
    { "title": "Planksaft", "href": "/planksaft", "sida":"66" },
    { "title": "Porthos visa", "href": "/porthos_visa", "sida":"20" },
    { "title": "Punsch, punsch", "href": "/punsch_punsch", "sida":"71" },
    { "title": "Punschen kommer (kall)", "href": "/punschen_kommer_kall", "sida":"70" },
    { "title": "Punschen kommer (varm)", "href": "/punschen_kommer_varm", "sida":"70" },
    { "title": "Punschen! Punschen!", "href": "/punschen_punschen", "sida":"75" },
    { "title": "Punschens lov", "href": "/punschens_lov", "sida":"73" },
    { "title": "Siffervisan", "href": "/siffervisan", "sida":"83" },
    { "title": "Sista punschvisan", "href": "/sista_punschvisan", "sida":"76" },
    { "title": "Snapsens ABC", "href": "/snapsens_abc", "sida":"61" },
    { "title": "Spegelvisan", "href": "/spegelvisan", "sida":"56" },
    { "title": "Spritbolaget", "href": "/spritbolaget", "sida":"31" },
    { "title": "Strejk på Pripps", "href": "/strejk_pa_pripps", "sida":"48" },
    { "title": "Studentsången", "href": "/studentsangen", "sida":"26" },
    { "title": "Supen", "href": "/supen", "sida":"31" },
    { "title": "Sveriges arraktionalhymn", "href": "/sveriges_arraktionalhymn", "sida":"75" },
    { "title": "Svåra ord", "href": "/svara_ord", "sida":"28" },
    { "title": "Sång om tentor", "href": "/sang_om_tentor", "sida":"88" },
    { "title": "Sädesfälten", "href": "/sadesfalten", "sida":"64" },
    { "title": "Tacksången", "href": "/tack_sangen", "sida":"21" },
    { "title": "Teknogoghymnen", "href": "/teknogoghymnen", "sida":"22" },
    { "title": "Toj hemtegubbar", "href": "/toj_hemtegubbar", "sida":"63" },
    { "title": "Tänk om jag hade lilla nubben", "href": "/tank_om_jag_hade_lilla_nubben", "sida":"64" },
    { "title": "Tänk om jag inte var så tråkig", "href": "/tank_om_jag_inte_var_sa_trakig", "sida":"64" },
    { "title": "Vårvinets lov", "href": "/varvinets_lov", "sida":"51" },
    { "title": "Vem sade ordet skål?", "href": "/vem_sade_ordet_skal", "sida":"60" },
    { "title": "Vi älskar öl", "href": "/vi_alskar_ol", "sida":"50" },
    { "title": "Vi dricka, vi dricka", "href": "/vi_dricka_vi_dricka", "sida":"32" },
    { "title": "Vi kan visa en värld", "href": "/vi_kan_visa_en_varld", "sida":"95" },
    { "title": "Vi ska supa", "href": "/vi_ska_supa", "sida":"39" },
    { "title": "Vikingen", "href": "/vikingen", "sida":"65" },
    { "title": "Vinet skänker", "href": "/vinet_skanker", "sida":"55" },
    { "title": "Änglarna", "href": "/anglarna", "sida":"62" },
    { "title": "Öl, öl, öl i glas", "href": "/ol_ol_ol_i_glas", "sida":"48" },
]