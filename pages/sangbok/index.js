import { readFileSync } from "node:fs";
import CustomHead from "@/components/CustomHead";
import TextHighlighter from "@/components/Highlighter";
import { logEvent } from "firebase/analytics";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import filterStyles from "@/styles/filter-panel.module.css";
import styles from "@/styles/sangbok.module.css";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//göm majjelåtar mellan månad 6 och 9
function HideDate(currentMonth) {
	if (currentMonth < 5 || currentMonth > 8) {
		return false;
	}
	return true;
}

// 2023-08-04, Tar bort alternativet för fulltext-search då jag inte har hunnit göra klart det. -Armin

export default function Sangbok({ sånger, index }) {
	const [sortedSongs, setSortedSongs] = useState(
		[...sånger].sort(
			(a, b) => Number.parseInt(a.sida, 10) - Number.parseInt(b.sida, 10),
		),
	);

	const [searchResults, setSearchResults] = useState([]);
	const [search, setSearch] = useState("");
	const currentMonth = new Date().getMonth();

	const [sort, setSort] = useState("pageNr");
	const sortBy = (e) => {
		setSort(e.target.value);
	};

	useEffect(() => {
		if (sort === "category") {
			setSortedSongs(
				[...sånger].sort((a, b) => a.kategori.localeCompare(b.kategori, "sv")),
			);
		} else if (sort === "pageNr") {
			setSortedSongs(
				[...sånger].sort(
					(a, b) => Number.parseInt(a.sida, 10) - Number.parseInt(b.sida, 10),
				),
			);
		} else {
			setSortedSongs(
				[...sånger].sort((a, b) => a.title.localeCompare(b.title, "sv")),
			);
		}
	}, [sort, sånger]);

	const [filterPanelOpen, setFilterPanelOpen] = useState(false);
	const [fokusSearchBar, setFokusSearchBar] = useState(false);

	useEffect(() => {
		const focusSearchHandler = (e) => {
			if (!fokusSearchBar && e.target.className === "searchbar") {
				setFokusSearchBar(true);
			} else if (fokusSearchBar && e.target.className !== "searchbar") {
				setFokusSearchBar(false);
			}
		};

		document.addEventListener("mousedown", focusSearchHandler);
		return () => {
			document.removeEventListener("mousedown", focusSearchHandler);
		};
	});

	const panelRef = useRef();
	//Stänger filterpanelen om man trycker utanför
	useEffect(() => {
		const panelCloseHandler = (e) => {
			const clickOnPanel = e.composedPath().includes(panelRef.current);
			if (!clickOnPanel) {
				setFilterPanelOpen(false);
			}
		};

		document.addEventListener("mousedown", panelCloseHandler);
		return () => {
			document.removeEventListener("mousedown", panelCloseHandler);
		};
	});

	// Search handler
	useEffect(() => {
		if (!search.trim()) {
			setSearchResults([...sortedSongs]);
			return;
		}

		// Dynamic import of search function
		import("@/utils/songSearch").then(({ rankSearchResult }) => {
			const results = sortedSongs
				.map((song) => ({
					...song,
					score: rankSearchResult(song, search, index),
				}))
				.filter((song) => song.score > 0)
				.sort((a, b) => b.score - a.score)
				.map(({ score, ...song }) => song);

			setSearchResults(results);
		});
	}, [search, sortedSongs, index]);

	const SångLänk = ({ sång }) => {
		// Döljer bla majjelåtar under vår/sommar
		if (sång.hemlig && HideDate(currentMonth)) {
			return "";
		}
		return (
			<Link
				href={`/sangbok${sång.href}`}
				className={styles.songLink}
				referrerPolicy="hej"
			>
				<div>
					<span className={styles.songTitle}>
						<TextHighlighter search={search} text={sång.title} />
					</span>
					<span className={styles.songPage}>&nbsp; s.{sång.sida}</span>
				</div>
				<div className={styles.songCategory}>&nbsp; {sång.kategori}</div>
			</Link>
		);
	};

	return (
		<>
			<CustomHead
				metaTitle={"Sångbok | Sektionen för Civilingenjör och Lärare"}
				description={"Sektionens digitala sångbok."}
				url={"https://www.cl-sektionen.se/sangbok"}
			/>
			<div id="contentbody">
				<div className="small-header">
					<h1 id="page-title">Sångbok</h1>
					<p>
						Nedan finner du samtliga sånger från sektionens officiella sångbok
						som trycktes inför sektionens 20-årsjubileum. Fysisk kopia av
						sångboken finns att köpa för 130 kr. Prata med försäljningsansvarig!
					</p>
				</div>

				<div className={styles.songbookWrapper}>
					<div className={filterStyles.panelWrapper} ref={panelRef}>
						<div className={`inputfält ${fokusSearchBar ? "active" : ""}`}>
							<input
								type="text"
								placeholder="Sök efter inlägg..."
								onChange={(e) => {
									setSearch(e.target.value);
								}}
								onBlur={async () => {
									// När användaren lämnar sökrutan
									const { getAnalytics } = await import(
										"../../firebase/clientApp"
									);
									const analytics = await getAnalytics();
									if (analytics) {
										logEvent(analytics, "search", { search_term: search });
									}
								}}
								className="searchbar"
							/>
							<button
								type="button"
								className={`${filterStyles.filterOpen} ${
									filterPanelOpen ? filterStyles.active : ""
								}`}
								onClick={() => {
									setFilterPanelOpen(!filterPanelOpen);
								}}
							>
								<FontAwesomeIcon icon={faEllipsis} />
							</button>
						</div>

						<section
							className={`${filterStyles.panel} ${
								filterPanelOpen ? filterStyles.open : filterStyles.collapsed
							}`}
						>
							<div className={filterStyles.innerWrapper}>
								<label>
									<input
										type="radio"
										name="filters"
										value="pageNr"
										checked={sort === "pageNr"}
										onChange={(e) => sortBy(e)}
										className={filterStyles.filterInput}
									/>
									<span className={filterStyles.filterOption}>
										Sortera på sidnummer
									</span>
								</label>
								<label>
									<input
										type="radio"
										name="filters"
										value="alphabetical"
										checked={sort === "alphabetical"}
										onChange={(e) => sortBy(e)}
										className={filterStyles.filterInput}
									/>
									<span className={filterStyles.filterOption}>
										Sortera alfabetiskt
									</span>
								</label>
								<label>
									<input
										type="radio"
										name="filters"
										value="category"
										checked={sort === "category"}
										onChange={(e) => sortBy(e)}
										className={filterStyles.filterInput}
									/>
									<span className={filterStyles.filterOption}>
										Sortera på kategori
									</span>
								</label>
							</div>
						</section>
					</div>

					<div>
						{searchResults.map((sång) => (
							<SångLänk key={sång.href} sång={sång} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export async function getStaticProps() {
	const sånger = JSON.parse(readFileSync("content/data/sangbok-index.json"));

	// Only load basic index data initially
	const basicIndex = JSON.parse(
		readFileSync("content/data/sangbok-content-index.json"),
	);

	return {
		props: {
			sånger,
			// Only include most common search terms in initial load
			index: Object.fromEntries(Object.entries(basicIndex).slice(0, 100)),
		},
	};
}
