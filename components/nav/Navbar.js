import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import NavItem from "./NavItem";
import NavSubItem from "./NavSubItem";
import Image from "next/image";
import NavLogo from "../../public/media/grafik/CL-Logo_NAV_White.png";
import { useRouter } from "next/router";

//Att lägga till nya sidor:
// 1. Se till att skapa sidan (se guide)

// 2a. skapa ett nytt objekt i listan på formatet:
//      {text: "<sidans namn>"", href: "/<sid dokumentets namn (länk)>"}

// 2b. skapa dropdown meny genom att lägga till en tredje 'property' och kalla den för 'submenu'
//     definiera den som en lista [] och dropdown item på samma format som 2a.

//Notera att dropdowns i dropdowns inte stödjs
const MENU_LIST = [
  {
    text: "Aktuellt",
    submenu: [
      { text: "Info & Event", href: "/aktuellt" },
      { text: "Kalender", href: "/kalender" },
    ],
  },
  {
    text: "Sektionen",
    submenu: [
      { text: "Om oss", href: "/om-oss" },
      { text: "Förtroendevalda", href: "/fortroendevalda" },
      { text: "Engagera dig", href: "/engagera-dig" },
      { text: "Hedersutmärkelser", href: "/hedersutmarkelser" },
      { text: "Hjälp vid illabehandling", href: "/hjalp-vid-illabehandling" },
    ],
  },
  {
    text: "Utbildning",
    submenu: [
      { text: "VFU", href: "/vfu" },
      { text: "Alumniblogg", href: "/alumniblogg" },
      { text: "Reseberättelser", href: "/reseberattelser" },
      // { text: "Studiebevakning", href: "/studiebevakning" },
      // { text: "Valbara kurser", href: "/valbara-kurser" },
    ],
  },
  {
    text: "Resurser",
    submenu: [
      { text: "Sångbok", href: "/sangbok" },
      { text: "Dokument", href: "/dokument" },
      { text: "Ordboken", href: "/ordbok"}
      // { text: "Bildarkiv", href: "/bildarkiv" },
    ],
  },
  {
    text: "Näringsliv",
    submenu: [
      { text: "För företag", href: "/for-foretag" },
      { text: "Samarbeten", href: "/samarbeten" },
    ],
  },
];

const MENU_STATES = ["fa-solid fa-bars", "fas fa-times"];

//förord: läs på egen risk --Armin
export default function Navbar() {
  const [activeIdx, setActiveIdx] = useState(-1); //för att markera aktiv menytab
  const [activeSubIdx, setActiveSubIdx] = useState(-1); // för att markera aktiv submeny
  const [navBurgirOpen, setNavBurgirOpen] = useState(false); //för att öppna och stänga hamburgarmeny
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const [currentPageTitle, setCurrentPageTitle] = useState("");

  useEffect(() => {
    const path = router.asPath.split("#")[0];
    if (path === "/") {
      setCurrentPageTitle("");
      return;
    }

    for (const menu of MENU_LIST) {
      for (const sub of menu.submenu) {
        if (sub.href === path) {
          setCurrentPageTitle(sub.text);
          break;
        }
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 50 ? setScrolled(true) : setScrolled(false);
    });
  });

  useEffect(() => {
    window.scrollY > 50 ? setScrolled(true) : setScrolled(false);
  }, []);

  const burgirToggle = () => {
    document.querySelector("#topnav").classList.toggle("topnav-active", !navBurgirOpen);
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
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  });
  //-------------------------------------------------------------------------

  const HomeButton = () => {
    return (
      <div
        onClick={() => {
          setActiveIdx(-1);
          setActiveSubIdx(-1);
        }}>
        <Link href="/">
          <Image src={NavLogo} alt="CL logo, navigation" id="navlogo" className="nav__item" />
        </Link>
      </div>
    );
  };

  const BurgerMenuButton = () => {
    return (
      <div id="navburgirmenu">
        <button
          onClick={burgirToggle}
          className={`nav__item ${navBurgirOpen ? MENU_STATES[1] : MENU_STATES[0]}`}></button>
      </div>
    );
  };

  const BurgerMenu = () => {
    return (
      <div ref={menuref}>
        {navBurgirOpen ? (
          <div className="burgir__menu-list">
            {MENU_LIST.map((menu, idx) => (
              <div
                key={menu.text}
                className={`submenu_wrapper ${activeIdx === idx ? "active" : ""}`}>
                <div
                  className="navitem_wrapper"
                  onClick={() => {
                    activeIdx === idx ? setActiveIdx(-1) : setActiveIdx(idx);
                    setActiveSubIdx(-1);
                  }}>
                  <NavItem active={activeIdx === idx} {...menu} />
                </div>
                {menu.submenu?.map((sb, s_idx) => (
                  <div
                    key={sb.text}
                    onClick={() => {
                      if (idx === activeIdx) {
                        setActiveIdx(idx);
                        setActiveSubIdx(s_idx);
                        setNavBurgirOpen(false);
                      }
                    }}>
                    <NavSubItem active={activeIdx === idx && activeSubIdx === s_idx} {...sb} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const WideScreenMenu = () => {
    return (
      <div className="nav__menu-list">
        {MENU_LIST.map((menu, idx) => (
          <div key={menu.text} className="submenu_wrapper">
            <div className="navitem_wrapper">
              <NavItem active={activeIdx === idx} {...menu} />
            </div>
            {menu.submenu?.map((sb, s_idx) => (
              <div
                key={sb.text}
                onClick={() => {
                  setActiveIdx(idx);
                  setActiveSubIdx(s_idx);
                }}>
                <NavSubItem active={activeIdx === idx && activeSubIdx === s_idx} {...sb} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <header>
      <nav>
        {/* Om man har scrollat på startsidan eller är på en annan sida är top nav röd */}
        <div id="topnav" className={scrolled || router.pathname !== "/" ? "nav_scrolled" : ""}>
          <div id="navmain">
            <div className="homebutton-wrapper">
              <HomeButton />
              <div className="current-Page">{currentPageTitle}</div>
            </div>
            <BurgerMenuButton />
            <WideScreenMenu />
          </div>
        </div>
        <BurgerMenu />
      </nav>
    </header>
  );
}
