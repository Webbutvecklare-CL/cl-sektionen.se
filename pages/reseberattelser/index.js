import Link from 'next/link';
function Reseberattelser() {
    return (
        <div id="contentbody">
            <h1>Reseberättelser</h1>
            <p>
                Här kan du läsa om andra CL-studenters erfarenheter under sina
                utbytesstudievistelser. Listan av reseberättelser är för
                tillfället inte särskilt lång, men vi hoppas att den kommer växa
                så småning om! Förutom att läsa CL studenters reseberättelser
                rekommenderar vi även att du kikar på de som publicerats på KTHs
                hemsida av studenter från andra program.
            </p>
            <div>
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
                    <li>
                        <Link href="/reseberattelser/ida-marie-freden-usa">
                            Ida-Marie Fréden - USA
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/sabina-permats-usa">
                            Sabina Permats - USA
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <h2>Europa</h2>
                <ul>
                    <li>
                        <Link href="/reseberattelser/camilla-björn-irland">
                            Camilla Björn - Irland
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/camilla-björn-tyskland">
                            Camilla Björn - Tyskland
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/ida-fantenberg-niklasson-irland">
                            Ida Fantenberg Niklasson - Irland
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/julia-engström-italien">
                            Julia Engström - Italien
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/ewa-Hörnlund-tjeckien">
                            Ewa Hörnlund - Tjeckien
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/philip-gullberg-tjeckien">
                            Philip Gullberg - Tjeckien
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/furkan-kocak-turkiet">
                            Furkan Kocak - Turkiet
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <h2>Asien</h2>
                <ul>
                    <li>
                        <Link href="/reseberattelser/william-friefeldt-taiwan">
                            William Friefeldt - Taiwan
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <h2>Oceanien</h2>
                <ul>
                    <li>
                        <Link href="/reseberattelser/anna-stolpe-australien">
                            Anna Stolpe - Australien
                        </Link>
                    </li>
                    <li>
                        <Link href="/reseberattelser/emelie-selinder-australien">
                            Emelie Selinder - Australien
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default Reseberattelser;
