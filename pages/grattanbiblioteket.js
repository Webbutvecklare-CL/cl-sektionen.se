import { useEffect, useRef, useState } from "react";
import TextHighlighter from "../components/Highlighter";
import { readFileSync } from "node:fs";

import styles from "../styles/ordbok.module.css";
import filterStyles from "../styles/filter-panel.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export default function Gråttanbiblioteket({ booklist }) {
	const [sortedBooklist, setSortedBooklist] = useState(
		[...booklist].sort((a, b) => a.title.localeCompare(b.title, "sv")),
	);

	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("title");

	const [filterPanelOpen, setFilterPanelOpen] = useState(false);
	const [fokusSearchBar, setFokusSearchBar] = useState(false);

	const sortBy = (e) => {
		setSort(e.target.value);
	};

	useEffect(() => {
		if (sort === "title") {
			setSortedBooklist(
				[...booklist]
					.sort((a, b) => a.title.localeCompare(b.title, "sv"))
					.sort((a, b) => a.author.localeCompare(b.author, "sv")),
			);
		} else if (sort === "author") {
			setSortedBooklist(
				[...booklist].sort((a, b) => a.author.localeCompare(b.author, "sv")),
			);
		}
	}, [booklist, sort]);

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

	const Book = ({ book }) => {
		console.log(book);
		return (
			<div className={styles.ord}>
				<div>
					<span lang="sv" className={styles.begrepp}>
						<TextHighlighter search={search} text={book.title} />
					</span>
					<br />
					<span className={styles.kategori}>{book.iban}</span>
				</div>
				<p className={styles.betydelse}>
					<TextHighlighter search={search} text={book.author} />
				</p>
			</div>
		);
	};

	return (
		<div id="contentbody">
			<div className="small-header">
				<h1 id="page-title">Gråttanbiblioteket</h1>
				<p>
					Här kan du se vilka böcker som finns i gråttanbiblioteket. Observera
					att det kan finnas fler böcker än de som r med i listan. Saknar du en
					bok, hör av dig till studienämnden och önska bok.
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
									value="author"
									checked={sort === "författare"}
									onChange={(e) => sortBy(e)}
									className={filterStyles.filterInput}
								/>
								<span className={filterStyles.filterOption}>
									Sortera efter författare
								</span>
							</label>
							<label>
								<input
									type="radio"
									name="filters"
									value="title"
									checked={sort === "titel"}
									onChange={(e) => sortBy(e)}
									className={filterStyles.filterInput}
								/>
								<span className={filterStyles.filterOption}>
									Sortera efter titel
								</span>
							</label>
						</div>
					</section>
				</div>

				{sortedBooklist
					.filter(
						(book) =>
							search === "" ||
							book.title.toLowerCase().includes(search.toLowerCase()) ||
							book.iban.toLowerCase().includes(search.toLowerCase()) ||
							book.författare.toLowerCase().includes(search.toLowerCase()),
					)
					.map((book) => {
						return <Book key={book.iban} book={book} />;
					})}
			</div>
		</div>
	);
}

export async function getStaticProps() {
	const booklist = JSON.parse(
		readFileSync("content/data/grattanbiblioteket.json"),
	);

	return {
		props: { booklist },
	};
}
