import Link from "next/link";
import React, { useState } from "react";
import NavItem from "./NavItem";

const MENU_LIST = [
    { text: "Kalender", href: "/Kalender" },
    { text: "Aktuellt", href: "/Aktuellt" },
    { text: "Verksamhet", href: "/Verksamhet" },
    { text: "Företag", href: "/Foretag" },
    { text: "Karriär", href: "/Karriar" },
];

const MENU_STATES = [
    "fa-solid fa-bars",
    "fas fa-times"
]


const Navbar = () => {
    const [navActive, setNavActive] = useState(null);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [navBurgirOpen, setNavBurgirOpen] = useState(false)
    const burgirToggle = () => {
        setNavBurgirOpen(!navBurgirOpen)
    }
    

    return(
        <header>
        <nav>
            <div id="topnav">
                <div id="navmain">
                    <div onClick={() => {setNavActive(null); setActiveIdx(-1); setNavBurgirOpen(false)}}>
                    <Link href="/" >
                        <img id="navlogo" className="nav__item" src="/media/grafik/CL-Logo_NAV_White.png"></img>
                    </Link>
                    </div>

                    <div id="navburgirmenu">
                        <button 
                            onClick={burgirToggle} 
                            className={`nav__item ${navBurgirOpen? MENU_STATES[1] : MENU_STATES[0]}`}
                        >
                        </button>
                    </div>

                    <div className="nav__menu-list">
                        {MENU_LIST.map((menu, idx) => (
                            <div onClick={() => {
                                setActiveIdx(idx);
                                setNavActive(false);
                            }}
                            key={menu.text}>
                            <NavItem active={activeIdx === idx} {...menu} />
                            </div>
                        ))}
                    </div>  
                </div>
            </div>
            {navBurgirOpen ? 
            <div className="burgir__menu-list">
                {MENU_LIST.map((menu, idx) => (
                    <div onClick={() => {
                        setActiveIdx(idx);
                        setNavActive(false);
                        setNavBurgirOpen(false);
                    }}
                    key={menu.text}>                    
                    <NavItem active={activeIdx === idx} {...menu} />
                    </div>
                ))}
            </div>  
            : ""
        }
        </nav>
        </header>
    );
};

export default Navbar;

