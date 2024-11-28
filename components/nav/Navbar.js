import NavItem from "@/components/nav/NavItem";
import NavSubItem from "@/components/nav/NavSubItem";
import NavLogo from "@/media/grafik/CL-Logo_Nav_White.webp";
import styles from "@/styles/nav.module.css";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

const MENU_LIST = [
	{
		text: "Aktuellt",
		submenu: [
			{ text: "Info & Event", href: "/aktuellt" },
			{ text: "Kalender", href: "/kalender" },
			{ text: "Mottagning", href: "/mottagning" },
			{ text: "Hjälp vid illabehandling", href: "/hjalp-vid-illabehandling" },
		],
	},
	{
		text: "Sektionen",
		submenu: [
			{ text: "Om oss", href: "/om-oss" },
			{ text: "Förtroendevalda", href: "/fortroendevalda" },
			{ text: "Engagera dig", href: "/engagera-dig" },
			{ text: "Hedersutmärkelser", href: "/hedersutmarkelser" },
			{ text: "Valens äventyr", href: "/valen" },
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
			{ text: "CL-shop", href: "/cl-shop" },
			{ text: "Dokument", href: "/dokument" },
			{ text: "Ordboken", href: "/ordbok" },
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

export default function Navbar() {
	const [activeIdx, setActiveIdx] = useState(-1);
	const [activeSubIdx, setActiveSubIdx] = useState(-1);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [currentPageTitle, setCurrentPageTitle] = useState("");
	const [activeMainSection, setActiveMainSection] = useState(null);
	const [expandedItems, setExpandedItems] = useState(new Set());
	const [isMobile, setIsMobile] = useState(false);
	const [isAtTop, setIsAtTop] = useState(true);
	const navRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		const handleScroll = () => {
			setIsAtTop(window.scrollY === 0 && router.pathname === "/");
		};

		checkMobile();
		handleScroll();
		window.addEventListener("resize", checkMobile);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("resize", checkMobile);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [router.pathname]);

	const handleClickOutside = useCallback((event) => {
		if (navRef.current && !navRef.current.contains(event.target)) {
			setIsMenuOpen(false);
			setActiveIdx(-1);
			setActiveSubIdx(-1);
		}
	}, []);

	const updateCurrentPage = useCallback(() => {
		const path = router.asPath.split("#")[0];
		if (path === "/") {
			setCurrentPageTitle("");
			setActiveMainSection(null);
			return;
		}

		for (const menu of MENU_LIST) {
			const subItem = menu.submenu?.find((sub) => sub.href === path);
			if (subItem) {
				setCurrentPageTitle(subItem.text);
				setActiveMainSection(menu.text);
				break;
			}
		}
	}, [router.asPath]);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		updateCurrentPage();

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside, updateCurrentPage]);

	const handleItemClick = (idx) => {
		if (isMobile) {
			setExpandedItems((prev) => {
				const newSet = new Set(prev);
				if (newSet.has(idx)) {
					newSet.delete(idx);
				} else {
					newSet.add(idx);
				}
				return newSet;
			});
		} else {
			setActiveIdx(idx === activeIdx ? -1 : idx);
		}
		setActiveSubIdx(-1);
	};

	const handleSubItemClick = (idx) => {
		setActiveSubIdx(idx);
		setIsMenuOpen(false);
		setExpandedItems(new Set());
	};

	const isItemExpanded = (idx) => {
		if (isMobile) {
			return expandedItems.has(idx);
		}
		return idx === activeIdx;
	};

	return (
		<nav
			ref={navRef}
			className={`${styles.topNav} ${isAtTop ? styles.transparent : ""}`}
			onMouseLeave={() => {
				if (!isMenuOpen && !isMobile) {
					setActiveIdx(-1);
				}
			}}
			aria-label="Main navigation"
		>
			<div className={styles.navMain}>
				<Link href="/" aria-label="Home">
					<Image
						src={NavLogo}
						alt="CL Logo"
						className={styles.navLogo}
						priority
					/>
				</Link>

				<div className={styles.currentPage}>{currentPageTitle}</div>

				<button
					type="button"
					className={styles.menuButton}
					onClick={() => {
						setIsMenuOpen(!isMenuOpen);
						setExpandedItems(new Set());
					}}
					aria-expanded={isMenuOpen}
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				>
					<FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
				</button>

				<div
					className={`${styles.navMenuList} ${isMenuOpen ? styles.menuOpen : ""}`}
				>
					{MENU_LIST.map((menu, idx) => (
						<div
							key={menu.text}
							className={styles.submenuWrapper}
							onMouseEnter={() =>
								!isMenuOpen && !isMobile && handleItemClick(idx)
							}
							onMouseLeave={() => !isMenuOpen && !isMobile && setActiveIdx(-1)}
						>
							<NavItem
								text={menu.text}
								active={menu.text === activeMainSection}
								expanded={isItemExpanded(idx)}
								submenu={menu.submenu}
								onClick={() => handleItemClick(idx)}
							/>
							{menu.submenu && isItemExpanded(idx) && (
								<div className={styles.submenuContainer}>
									{menu.submenu.map((subItem, subIdx) => (
										<NavSubItem
											key={subItem.href}
											{...subItem}
											active={router.asPath === subItem.href}
											onClick={() => handleSubItemClick(subIdx)}
										/>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</nav>
	);
}
