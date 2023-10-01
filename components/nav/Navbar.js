import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import NavItem from "./NavItem";

import NavSubItem from "./NavSubItem";
import NavLogo from "../../public/media/grafik/CL-Logo_Nav_White.webp";

import styles from "../../styles/nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

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
      { text: "Mottagning", href: "/mottagning" },
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
      { text: "Studiebevakning", href: "/studiebevakning" },
      { text: "Valbara kurser", href: "/valbara-kurser" },
    ],
  },
  {
    text: "Resurser",
    submenu: [
      { text: "Sångbok", href: "/sangbok" },
      { text: "Dokument", href: "/dokument" },
      { text: "Ordboken", href: "/ordbok" },
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

//förord: läs på egen risk --Armin
export default function Navbar() {
  const [activeIdx, setActiveIdx] = useState(-1); //för att markera aktiv menytab
  const [activeSubIdx, setActiveSubIdx] = useState(-1); // för att markera aktiv submenu
  const [navBurgerOpen, setNavBurgerOpen] = useState(false); //för att öppna och stänga hamburgarmeny
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

  const burgerToggle = () => {
    setNavBurgerOpen(!navBurgerOpen);
  };

  //för att stänga hamburgarmenyn om man klickar utanför---------------------
  let navbarRef = useRef();
  let burgerMenuRef = useRef();
  useEffect(() => {
    let handler = (e) => {

      // Kollar om elementet som användaren tryckte på finns i navbar eller burgerMenu
      const pressOnNavBar = navbarRef.current.contains(e.target);
      const pressOnBurgerMenu = burgerMenuRef.current.contains(e.target);

      if (!pressOnBurgerMenu && !pressOnNavBar) {
        setNavBurgerOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.ontouchend = handler;

    return () => {
      document.removeEventListener("mousedown", handler);
      document.ontouchend = null;
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
          <Image
            src={NavLogo}
            width={48}
            height={48}
            alt="CL logo, navigation"
            id={styles.navLogo}
            className={styles.navItem}
          />
        </Link>
      </div>
    );
  };

  const BurgerMenuButton = () => {
    return (
      <div id={styles.navBurgerMenu}>
        <button
          onClick={burgerToggle}
          aria-label={`${navBurgerOpen ? "Stäng" : "Öppna"} navigationsmenyn`}
          className={`${styles.navItem} menuButton`}>
          <FontAwesomeIcon icon={navBurgerOpen ? faTimes : faBars} />
        </button>
      </div>
    );
  };

  const BurgerMenu = () => {
    return (
      <div ref={burgerMenuRef}>
        {navBurgerOpen ? (
          <div className={styles.burgerMenuList}>
            {MENU_LIST.map((menu, idx) => (
              <div
                key={menu.text}
                className={`${styles.submenuWrapper} ${activeIdx === idx ? styles.active : ""}`}>
                <div
                  className={styles.navItemWrapper}
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
                        setNavBurgerOpen(false);
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
      <div className={styles.navMenuList}>
        {MENU_LIST.map((menu, idx) => (
          <div key={menu.text} className={styles.submenuWrapper}>
            <div className={styles.navItemWrapper}>
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
        {/* Om man har scrollat på startsidan, är på en annan sida eller öppnat menyn är top nav röd */}
        <div
          ref={navbarRef}
          id={styles.topNav}
          className={
            scrolled || router.pathname !== "/" || navBurgerOpen ? styles.navBarFilled : ""
          }>
          <div id={styles.navMain}>
            <div className={styles.homeButtonWrapper}>
              <HomeButton />
              <div className={styles.currentPage}>{currentPageTitle}</div>
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
