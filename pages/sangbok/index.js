import Link from "next/link";

function Sangbok() {
    return (
        <div id="contentbody">
            <h1>Sångbok</h1>
            <p>Här kommer hända saker snart!</p>

            {/*(test)*/}
            <Link href="/sangbok/porthos_visa">Porthos visa</Link><br>
            <Link href="/sangbok/bordeaux_bordeaux">bordeaux bordeaux</Link>
        </div>
    );
}

export default Sangbok;