import Link from "next/link";
import React, { useState } from "react";
import NavItem from "./NavItem";
import NavSubItem from "./NavSubItem";
import Image from 'next/image';
import NavLogo from "../public/media/grafik/CL-Logo_NAV_White.png";


const MENU_LIST = [
    { text: "Kalender", href: "/kalender" },
    { text: "Aktuellt", href: "/aktuellt"},
    { text: "Verksamhet", href: "/verksamhet",
        submenu: [
            {text: "Förtroendevalda", href: "/fortroendevalda"},
            {text: "Hedersmedlemmar", href: "/hedersmedlemmar"},
            {text: "Sångbok", href: "/sangbok"},
        ]
    },
    { text: "Student", href: "/student",
        submenu: [
            {text: "Alumniblogg", href: "/alumniblogg"},
            {text: "Reseberättelser", href: "/reseberattelser"},
            {text: "VFU", href: "/vfu"},
            {text: "Studiebevakning", href: "/studiebevakning"},
        ]
    }
];

const MENU_STATES = [
    "fa-solid fa-bars",
    "fas fa-times"
]


const Navbar = () => {
    const [activeIdx, setActiveIdx] = useState(-1);
    const [activeSubIdx, setActiveSubIdx] = useState(-1);
    const [navBurgirOpen, setNavBurgirOpen] = useState(false)
    const burgirToggle = () => {
        setNavBurgirOpen(!navBurgirOpen)
    }
    
    return(
        <header>
        <nav>
            <div id="topnav">
                <div id="navmain">
                    <div onClick={() => {
                        setActiveIdx(-1);
                        setNavBurgirOpen(false);
                        setActiveSubIdx(-1)
                        }}>
                        <Link href="/" >
                            <Image
                                src={NavLogo}
                                alt="CL logo, navigation"
                                id="navlogo"
                                className="nav__item"
                            />
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
                        <div key={menu.text} className="submenu_wrapper">
                            <div className="navitem_wrapper" onClick={() => {
                                setActiveIdx(idx);
                                setActiveSubIdx(-1);
                            }}>
                            <NavItem active={activeIdx === idx} {...menu} />
                            </div>

                            {menu.submenu?.map((sb, s_idx) => (
                                <div key={sb.text} onClick={() => {
                                    setActiveIdx(idx);
                                    setActiveSubIdx(s_idx);
                                    setNavBurgirOpen(false);
                                }}>
                                <NavSubItem active={activeIdx === idx && activeSubIdx === s_idx} {...sb} />
                                </div>
                            ))}
                        </div>
                        ))}
                    </div>  
                </div>
            </div>
            {navBurgirOpen ? 
            <div className="burgir__menu-list">
                {MENU_LIST.map((menu, idx) => (
                <div key={menu.text} className={`submenu_wrapper ${(activeIdx === idx)? "active" : ""}`}>
                    <div className="navitem_wrapper" onClick={() => {
                        (activeIdx === idx)? setActiveIdx(-1) : setActiveIdx(idx);
                        setActiveSubIdx(-1);
                    }}>                    
                    <NavItem active={activeIdx === idx} {...menu} />
                    </div>

                    {menu.submenu?.map((sb, s_idx) => ( 
                        <div key={sb.text} onClick={() => {
                            if (idx === activeIdx){
                                setActiveIdx(idx);
                                setActiveSubIdx(s_idx);
                            }
                        }}>
                        <NavSubItem active={activeIdx === idx && activeSubIdx === s_idx} {...sb} />
                        </div>
                    ))}
                    
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

