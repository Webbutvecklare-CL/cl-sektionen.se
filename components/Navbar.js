import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import NavItem from "./NavItem";
import NavSubItem from "./NavSubItem";
import Image from "next/image";
import NavLogo from "../public/media/grafik/CL-Logo_NAV_White.png";

//Att lägga till nya sidor:
// 1. Se till att skapa sidan (se guide)

// 2a. skapa ett nytt objekt i listan på formatet:
//      {text: "<sidans namn>"", href: "/<sid dokumentets namn (länk)>"}

// 2b. skapa dropdown meny genom att lägga till en tredje 'property' och kalla den för 'submenu'
//     definiera den som en lista [] och dropdown item på samma format som 2a.

//Notera att dropdowns i dropdowns stöds inte
const MENU_LIST = [
  {
    text: "Verksamhet",
    href: "",
    submenu: [
      { text: "Aktuellt", href: "/aktuellt" },
      { text: "Kalender", href: "/kalender" },
      { text: "Sångbok", href: "/sangbok" },
    ],
  },
  {
    text: "Organisation",
    href: "",
    submenu: [
      { text: "Dokument", href: "/dokument" },
      { text: "Förtroendevalda", href: "/fortroendevalda" },
      { text: "Hedersmedlemmar", href: "/hedersmedlemmar" },
    ],
  },
  {
    text: "Studier",
    href: "",
    submenu: [
      { text: "Alumniblogg", href: "/alumniblogg" },
      { text: "Reseberättelser", href: "/reseberattelser" },
      { text: "VFU", href: "/vfu" },
      { text: "Studiebevakning", href: "/studiebevakning" },
      { text: "Illabehandling", href: "/hjalp-vid-illabehandling" },
    ],
  },
  {
    text: "Näringsliv",
    href: "",
    submenu: [
      { text: "För företag", href: "" },
      { text: "Samarbeten", href: "" },
    ],
  },
];

const MENU_STATES = ["fa-solid fa-bars", "fas fa-times"];

//förord: läs på egen risk --Armin
const Navbar = () => {
  const [activeIdx, setActiveIdx] = useState(-1); //för att markera aktiv menytab
  const [activeSubIdx, setActiveSubIdx] = useState(-1); // för att markera aktiv submeny
  const [navBurgirOpen, setNavBurgirOpen] = useState(false); //för att öppna och stänga hamburgarmeny

  //egentligen onödig, ska rensas senare (kan alltid kallas med setNavBurgirOpen(!navBurgirOpen) istället)
  const burgirToggle = () => {
    setNavBurgirOpen(!navBurgirOpen);
  };

  //för att stänga hamburgarmenyn om man klickar utanför---------------------
  let menuref = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuref.current.contains(e.target) && e.target.className != "nav__item fas fa-times") {
        setNavBurgirOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  //-------------------------------------------------------------------------

  return (
    <header>
      <nav>
        <div id="topnav">
          <div id="navmain">
            {/* Denna div är för CL-loggan som leder till index-page */}
            <div
              onClick={() => {
                setActiveIdx(-1);
                setActiveSubIdx(-1);
              }}
            >
              <Link href="/">
                <Image
                  src={NavLogo}
                  alt="CL logo, navigation"
                  id="navlogo"
                  className="nav__item"
                />
              </Link>
            </div>

            {/* För hamburgarmeny knappen, syns endast för mobila/små enheter */}
            <div id="navburgirmenu">
              <button
                onClick={burgirToggle}
                className={`nav__item ${navBurgirOpen ? MENU_STATES[1] : MENU_STATES[0]}`}
              ></button>
            </div>

            {/* Den normala menyn, se separat guide för genomgång av kod */}
            <div className="nav__menu-list">
              {MENU_LIST.map((menu, idx) => (
                <div
                  key={menu.text}
                  className="submenu_wrapper"
                >
                  <div
                    className="navitem_wrapper"
                    onClick={() => {}}
                  >
                    <NavItem
                      active={activeIdx === idx}
                      {...menu}
                    />
                  </div>

                  {menu.submenu?.map((sb, s_idx) => (
                    <div
                      key={sb.text}
                      onClick={() => {
                        setActiveIdx(idx);
                        setActiveSubIdx(s_idx);
                      }}
                    >
                      <NavSubItem
                        active={activeIdx === idx && activeSubIdx === s_idx}
                        {...sb}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* hamburgarmenyn, se separat guide för genomgång av kod */}
        <div ref={menuref}>
          {navBurgirOpen ? (
            <div className="burgir__menu-list">
              {MENU_LIST.map((menu, idx) => (
                <div
                  key={menu.text}
                  className={`submenu_wrapper ${activeIdx === idx ? "active" : ""}`}
                >
                  <div
                    className="navitem_wrapper"
                    onClick={() => {
                      activeIdx === idx ? setActiveIdx(-1) : setActiveIdx(idx);
                      setActiveSubIdx(-1);
                    }}
                  >
                    <NavItem
                      active={activeIdx === idx}
                      {...menu}
                    />
                  </div>

                  {menu.submenu?.map((sb, s_idx) => (
                    <div
                      key={sb.text}
                      onClick={() => {
                        if (idx === activeIdx) {
                          setActiveIdx(idx);
                          setActiveSubIdx(s_idx);
                        }
                      }}
                    >
                      <NavSubItem
                        active={activeIdx === idx && activeSubIdx === s_idx}
                        {...sb}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
