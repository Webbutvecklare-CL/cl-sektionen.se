import Link from "next/link";
import React, { useState } from "react";
import NavItem from "./NavItem";
import NavSubItem from "./NavSubItem";
import Image from 'next/image';
import NavLogo from "../public/media/grafik/CL-Logo_NAV_White.png";


const MENU_LIST = [
    { text: "Kalender", href: "/Kalender" },
    { text: "Aktuellt", href: "/Aktuellt"},
    { text: "Verksamhet", href: "/Verksamhet",
        submenu: [
            {text: "Förtroendevalda", href: "/Fortroendevalda"},
            {text: "Sångbok", href: "/Sangbok"},
        ]
    },
    { text: "Student", href: "/Student",
        submenu: [
            {text: "Alumniblogg", href: "/Alumniblogg"},
            {text: "Reseberättelser", href: "/Reseberattelser"},
            {text: "VFU", href: "/VFU"},
            {text: "Studiebevakning", href: "/Studiebevakning"},
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
                        <div className="submenu_wrapper">
                            <div className="navitem_wrapper" onClick={() => {
                                setActiveIdx(idx);
                            }}
                            key={menu.text}>
                            <NavItem active={activeIdx === idx} {...menu} />
                            </div>

                            {menu.submenu?.map((sb, s_idx) => (
                                <div key={sb.text} onClick={() => {
                                    setActiveIdx(idx);
                                    setActiveSubIdx(s_idx);
                                    setNavBurgirOpen(false);
                                }}>
                                <NavSubItem active={activeSubIdx === s_idx} {...sb} />
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
                <div className="submenu_wrapper">
                    <div className="navitem_wrapper" onClick={() => {
                        setActiveIdx(idx);
                    }}
                    key={menu.text}>                    
                    <NavItem active={activeIdx === idx} {...menu} />
                    </div>

                    {menu.submenu?.map((sb, s_idx) => ( 
                        <div key={sb.text}  onClick={() => {
                            setActiveIdx(idx);
                            setActiveSubIdx(s_idx);
                            setNavBurgirOpen(false);
                        }}>
                        <NavSubItem active={activeIdx === idx & activeSubIdx === s_idx} {...sb} />
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

