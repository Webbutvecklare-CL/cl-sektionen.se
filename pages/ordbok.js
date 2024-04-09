import { readFileSync } from "node:fs";
import { useEffect, useRef, useState } from "react";
import TextHighlighter from "../components/Highlighter";

import filterStyles from "../styles/filter-panel.module.css";
import styles from "../styles/ordbok.module.css";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Ordbok({ ordbok }) {
	const [sortedOrdbok, setSortedOrdbok] = useState(
		[...ordbok].sort((a, b) => a.begrepp.localeCompare(b.begrepp, "sv")),
	);

	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("alphabetical");

	const [filterPanelOpen, setFilterPanelOpen] = useState(false);
	const [fokusSearchBar, setFokusSearchBar] = useState(false);

	const sortBy = (e) => {
		setSort(e.target.value);
	};

	useEffect(() => {
		if (sort === "category") {
			setSortedOrdbok(
				[...ordbok]
					.sort((a, b) => a.begrepp.localeCompare(b.begrepp, "sv"))
					.sort((a, b) => a.kategori.localeCompare(b.kategori, "sv")),
			);
		} else {
			setSortedOrdbok(
				[...ordbok].sort((a, b) => a.begrepp.localeCompare(b.begrepp, "sv")),
			);
		}
	}, [ordbok, sort]);

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
	}, [fokusSearchBar]);

	const Ord = ({ ord }) => {
		return (
			<div className={styles.ord}>
				<div>
					<span lang="sv" className={styles.begrepp}>
						<TextHighlighter search={search} text={ord.begrepp} />
					</span>
					<br />
					<span className={styles.kategori}>{ord.kategori}</span>
				</div>
				<p className={styles.betydelse}>
					<TextHighlighter search={search} text={ord.betydelse} />
				</p>
			</div>
		);
	};

	return (
		<div id="contentbody">
			<div className="small-header">
				<h1 id="page-title">Ordbok</h1>
				<p>
					Följande är en lista över krångliga begrepp och förkortningar som kan
					dyka upp på SM eller andra sammanhang på sektionen.
				</p>
			</div>
			<div className={styles.ordbokWrapper}>
				<div className={filterStyles.panelWrapper} ref={panelRef}>
					<div className={`inputfält ${fokusSearchBar ? "active" : ""}`}>
						<input
							type="text"
							placeholder="Sök efter inlägg..."
							onChange={(e) => {
								setSearch(e.target.value);
							}}
							onBlur={() => {
								// När användaren lämnar sökrutan
							}}
							className="searchbar"
						/>
						<button
							type="button"
							className={`${filterStyles.filterOpen} ${
								filterPanelOpen ? filterStyles.active : ""
							}`}
							onClick={() => setFilterPanelOpen(!filterPanelOpen)}
						>
							<FontAwesomeIcon icon={faEllipsis} className="buttonIcon" />
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

				{sortedOrdbok
					.filter(
						(ord) =>
							search === "" ||
							ord.begrepp.toLowerCase().includes(search.toLowerCase()) ||
							ord.betydelse.toLowerCase().includes(search.toLowerCase()) ||
							ord.kategori.toLowerCase().includes(search.toLowerCase()),
					)
					.map((ord) => {
						return <Ord key={ord.begrepp} ord={ord} />;
					})}
			</div>
		</div>
	);
}
export default Ordbok;

export async function getStaticProps() {
	const ordbok = JSON.parse(readFileSync("content/data/ordbok.json"));

	return {
		props: { ordbok },
	};
}
