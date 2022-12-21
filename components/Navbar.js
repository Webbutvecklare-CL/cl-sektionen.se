import React from "react";
import Link from "next/link";

export default function Navbar(){
    return(
        <header>
        <nav id="topnav">
            <Link href="/">
                <img src="/media/grafik/CL-Logo_NAV_White.png"></img>
            </Link>
            <Link href="/Kalender">Kalender</Link>
            <Link href="/Aktuellt">Aktuellt</Link>
            <Link href="/Verksamhet">Verksamhet</Link>
            <Link href="/Foretag">Företag</Link>
            <Link href="/Karriar">Karriär</Link>              
        </nav>
        </header>
    )
}