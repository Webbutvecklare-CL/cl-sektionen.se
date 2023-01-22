import Link from 'next/link';
function Alumniblogg() {
    return (
        <div id="contentbody">
            <h1>Alumniblogg</h1>
            <p>
                På denna blogg hittar du inlägg från gamla CL studenter som
                tagit examen, alumner, och nu är ute i arbetslivet. De berättar
                om sin KTH tid, hur de fick sitt första jobb, vad de jobbar med
                och hur det är på deras arbetsplats, vad de gör på fritiden
                idag, och om livet i allmänhet.
            </p>
            <ul>
                <li>
                    <Link href="/alumniblogg/mollie-wejdenstolpe">
                        Mollie Wejdenstolpe
                    </Link>
                </li>
                <li>
                    <Link href="/alumniblogg/malin-engquist">
                        Malin Engquist - bästa examensarbetet 2018 (intervju)
                    </Link>
                </li>
            </ul>
        </div>
    );
}
export default Alumniblogg;
