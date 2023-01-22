import Link from 'next/link';
function Reseberattelser() {
    return (
        <div id="contentbody">
            <h1>Reseberättelser</h1>
            <h2>Nordamerika</h2>
            <ul>
                <li>
                    <Link href="/reseberattelser/caroline-stejmar-kanada">
                        Caroline Stejmar - Kanada
                    </Link>
                </li>
                <li>
                    <Link href="/reseberattelser/astrid-häggström-usa">
                        Astrid Häggström - USA
                    </Link>
                </li>
            </ul>
        </div>
    );
}
export default Reseberattelser;
