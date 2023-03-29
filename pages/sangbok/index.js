import Link from "next/link";
import { useState } from "react";

function Sangbok() {
    const [search, setSearch] = useState("")
    console.log(search)
    return (
        <div id="contentbody">
            <h1>Sångbok</h1>
            <p>Nedan finner du samtliga sånger från sektionens officiella sångbok. Fysisk kopia finns att köpa för 130 kr. Prata med försäljningsansvarig! </p>

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
                <Link 
                    href={`sangbok${sång.href}`}
                    className="sånglänk"
                >
                    {sång.title}<br></br>
                </Link>
            )}
        </div>
    );
} export default Sangbok;

const sånger = [
    { "title": "800 rader", "href": "/800_rader" },
    { "title": "Alla sorters punsch", "href": "/alla_sorters_punsch" },
    { "title": "Änglarna", "href": "/anglarna" },
    { "title": "Bordeaux, Bordeaux", "href": "/bordeaux_bordeaux" },
    { "title": "Byssan full", "href": "/byssan_full" },
    { "title": "Crassus vinsång", "href": "/crassus_vinsang" },
    { "title": "Danse Macabre", "href": "/danse_macabre" },
    { "title": "Den som spar hen har", "href": "/den_som_spar_hen_har" },
    { "title": "Denna thaft", "href": "/denna_thaft" },
    { "title": "Det regnar ner i dalen", "href": "/det_regnar_ner_i_dalen" },
    { "title": "Djungelpunsch", "href": "/djungelpunsch" },
    { "title": "Dominoeffekten", "href": "/dominoeffekten" },
    { "title": "Du gamla, du fria", "href": "/du_gamla_du_fria" },
    { "title": "Du gamla vin", "href": "/du_gamla_vin" },
    { "title": "Du ska få mitt gamla snapsglas", "href": "/du_ska_fa_mitt_gamla_snapsglas" },
    { "title": "Emojivisan", "href": "/emojivisan" },
    { "title": "En gång i månan", "href": "/en_gang_i_manen" },
    { "title": "En kan dricka vatten", "href": "/en_kan_dricka_vatten" },
    { "title": "En liten blå förgätmigej", "href": "/en_liten_bla_forgatmigej" },
    { "title": "En liten teknolog", "href": "/en_liten_teknolog" },
    { "title": "En matematiker", "href": "/en_matematiker" },
    { "title": "En pilsnerdrickare", "href": "/en_pilsnerdrickare" },
    { "title": "Enhetsvisan (Système International)", "href": "/enhetsvisan" },
    { "title": "Femton fransyskor", "href": "/femton_fransyskor" },
    { "title": "Festen ska börjas", "href": "/festen_ska_borjas" },
    { "title": "FESTU:s punschvisa", "href": "/festus_punschvisa" },
    { "title": "Finland är Finland", "href": "/finland_ar_finland" },
    { "title": "Fiskarna", "href": "/fiskarna" },
    { "title": "Fkåne faft", "href": "/fkane_faft" },
    { "title": "Försvarstal för broder Tuck", "href": "/forsvarstal_for_broder_tuck" },
    { "title": "Fredmans sång nummer 21", "href": "/fredmans_sang_nr_21" },
    { "title": "Full är bäst", "href": "/full_ar_bast" },
    { "title": "Gräv ur den skandinaviska tundran", "href": "/grav_ur_skandinaviska_tundran" },
    { "title": "Gräv ur tundran", "href": "/grav_ur_tundran" },
    { "title": "Gums visa", "href": "/gums_visa" },
    { "title": "Hallen lutar", "href": "/hallen_lutar" },
    { "title": "Hej tomtegubbar", "href": "/hej_tomtegubbar" },
    { "title": "Hell and Gore", "href": "/hell_and_gore" },
    { "title": "Humlorna", "href": "/humlorna" },
    { "title": "I Californien", "href": "/i_californien" },
    { "title": "Imperial punsch", "href": "/imperial_punsch" },
    { "title": "Imperial system", "href": "/imperial_system" },
    { "title": "Integrera", "href": "/integrera" },
    { "title": "Jag ska festa", "href": "/jag_ska_festa" },
    { "title": "JASen", "href": "/jasen" },
    { "title": "Kalmarevisan", "href": "/kalmare_visan" },
    { "title": "Kasta supen", "href": "/kastasupen" },
    { "title": "Kemisången", "href": "/kemisangen" },
    { "title": "Kungssången", "href": "/kungssangen" },
    { "title": "Livsmusik", "href": "/livsmusik" },
    { "title": "Lyft ditt välförsedda glas", "href": "/lyft_ditt_valforsedda_glas" },
    { "title": "Matlab", "href": "/matlab" },
    { "title": "Måsen", "href": "/masen" },
    { "title": "Mellansup", "href": "/mellansup" },
    { "title": "Moosen", "href": "/moosen" },
    { "title": "Musen", "href": "/musen" },
    { "title": "När kaffet är serverat", "href": "/nar_kaffet_ar_serverat" },
    { "title": "O gamla klang och jubeltid", "href": "/o_gamla_klang_och_jubeltid" },
    { "title": "O hemska labb", "href": "/o_hemska_labb" },
    { "title": "Ode till skon", "href": "/ode_till_skon" },
    { "title": "Öl, öl, öl i glas", "href": "/ol_ol_ol_i_glas" },
    { "title": "Planksaft", "href": "/planksaft" },
    { "title": "Porthos visa", "href": "/porthos_visa" },
    { "title": "Punsch, punsch", "href": "/punsch_punsch" },
    { "title": "Punschen kommer (kall)", "href": "/punschen_kommer_kall" },
    { "title": "Punschen kommer (varm)", "href": "/punschen_kommer_varm" },
    { "title": "Punschen! Punschen!", "href": "/punschen_punschen" },
    { "title": "Punschens lov", "href": "/punschens_lov" },
    { "title": "Siffervisan", "href": "/siffervisan" },
    { "title": "Sista punschvisan", "href": "/sista_punschvisan" },
    { "title": "Snapsens ABC", "href": "/snapsens_abc" },
    { "title": "Spegelvisan", "href": "/spegelvisan" },
    { "title": "Spritbolaget", "href": "/spritbolaget" },
    { "title": "Strejk på Pripps", "href": "/strejk_pa_pripps" },
    { "title": "Studentsången", "href": "/studentsangen" },
    { "title": "Supen", "href": "/supen" },
    { "title": "Svåra ord", "href": "/svara_ord" },
    { "title": "Sveriges arraktionalhymn", "href": "/sveriges_arraktionalhymn" },
    { "title": "Sång om tentor", "href": "/sang_om_tentor" },
    { "title": "Sädesfälten", "href": "/sadesfalten" },
    { "title": "Tacksången", "href": "/tack_sangen" },
    { "title": "Tänk om jag hade lilla nubben", "href": "/tank_om_jag_hade_lilla_nubben" },
    { "title": "Tänk om jag inte var så tråkig", "href": "/tank_om_jag_inte_var_sa_trakig" },
    { "title": "Teknogoghymnen", "href": "/teknogoghymnen" },
    { "title": "Toj hemtegubbar", "href": "/toj_hemtegubbar" },
    { "title": "Vårvinets lov", "href": "/varvinets_lov" },
    { "title": "Vem sade ordet skål?", "href": "/vem_sade_ordet_skal" },
    { "title": "Vi älskar öl", "href": "/vi_alskar_ol" },
    { "title": "Vi dricka, vi dricka", "href": "/vi_dricka_vi_dricka" },
    { "title": "Vi ska supa", "href": "/vi_ska_supa" },
    { "title": "Vikingen", "href": "/vikingen" },
    { "title": "Vinet skänker", "href": "/vinet_skanker" },
]