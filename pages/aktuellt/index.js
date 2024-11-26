import { app } from "@/firebase/clientApp";
import { logEvent } from "firebase/analytics";
import {
	collection,
	getDocs,
	getFirestore,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
const firestore = getFirestore(app);

import { convertDate } from "@/utils/convertDate";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import FeedPreview from "@/components/FeedPreview";

import { all_committees } from "@/constants/committees-data";
//Ändra dessa för att lägga till och ta bort tags
import { COMMONTAGS, EVENTSTAGS, INFOTAGS } from "@/constants/tags";

import styles from "@/styles/aktuellt.module.css";
import feed from "@/styles/feed-preview.module.css";
import filterStyles from "@/styles/filter-panel.module.css";

import NotificationBell from "@/components/NotificationBell";
import {
	faArrowDownWideShort,
	faCalendarDays,
	faEllipsis,
	faFilter,
	faPen,
	faTags,
	faList,
	faGrip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Aktuellt({ postList }) {
	const router = useRouter();
	const { replace, query } = router;

	const [currentpage, setcurrentPage] = useState(1);
	const itemsperpage = 6;

	const [filterPanelOpen, setFilterPanelOpen] = useState(false);

	const [search, setSearch] = useState("");
	const [type, setType] = useState({
		information: true,
		event: true,
	});

	const [sortNewestFirst, setSortNewestFirst] = useState(true);
	const [isGridLayout, setIsGridLayout] = useState(false);

	// Load layout preference from localStorage on mount
	useEffect(() => {
		const savedLayout = localStorage.getItem('aktuelltLayout');
		if (savedLayout) {
			setIsGridLayout(savedLayout === 'grid');
		}
	}, []);

	// Save layout preference to localStorage
	useEffect(() => {
		localStorage.setItem('aktuelltLayout', isGridLayout ? 'grid' : 'list');
	}, [isGridLayout]);

	const toggleSort = () => {
		setSortNewestFirst(!sortNewestFirst);
		postList.reverse();
	};

	const [filterTags, setFilterTags] = useState({});
	const [publisher, setPublisher] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState(new Date().toDateString());

	// tar bort filter kategori of den redan finns, lägger annars till den
	const handleTagClick = (e) => {
		if (e) {
			e.preventDefault();
		}
		const tag = e.target.innerHTML;
		const selected = e.target.classList.contains(filterStyles.selected);

		// Kopiera förra statet och skriver över värdet på den valda tagen
		setFilterTags((filterTags) => ({ ...filterTags, ...{ [tag]: !selected } }));
	};

	const handleSetType = (e, tag) => {
		const selected = e.target.classList.contains(filterStyles.selected);

		setType((t) => ({ ...t, ...{ [tag]: !selected } }));
	};

	//Hanterar tags när man filtrerar bort antingen Event eller Information
	// biome-ignore lint/correctness/useExhaustiveDependencies: migrate fix from eslint
	useEffect(() => {
		const infoTags = {};
		for (const tag of INFOTAGS) {
			infoTags[tag] = !!filterTags[tag];
		}

		const eventTags = {};
		for (const tag of EVENTSTAGS) {
			eventTags[tag] = !!filterTags[tag];
		}

		const commonTags = {};
		for (const tag of COMMONTAGS) {
			commonTags[tag] = !!filterTags[tag];
		}

		if (type.information && type.event) {
			setFilterTags({ ...commonTags, ...infoTags, ...eventTags });
		} else if (type.information) {
			setFilterTags({ ...commonTags, ...infoTags });
		} else if (type.event) {
			setFilterTags({ ...commonTags, ...eventTags });
		} else {
			setFilterTags({});
		}
		// Lägg inte till filterTags som dependency
	}, [type]);

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

	//outline runt sökfältet om man klickar innuti, detta för att firefox inte stödjer css 'has()' selector
	const [fokusSearchBar, setfokusSearchBar] = useState(false);
	useEffect(() => {
		const focusSearchHandler = (e) => {
			if (!fokusSearchBar && e.target.className === "searchbar") {
				setfokusSearchBar(true);
			} else if (fokusSearchBar && e.target.className !== "searchbar") {
				setfokusSearchBar(false);
			}
		};

		document.addEventListener("mousedown", focusSearchHandler);
		return () => {
			document.removeEventListener("mousedown", focusSearchHandler);
		};
	});

	// Filter via länkar
	// Uppdatera objektet som sparas i query params
	const queryParams = useMemo(() => {
		const newQueryParams = {};

		// Skapar en sträng med alla tags
		let tags = "";
		for (const tag in filterTags) {
			if (filterTags[tag]) {
				tags += `${tag}-`;
			}
		}

		// Tar bort sista minustecknet
		tags = tags.slice(0, -1);

		// Tar bara med de som inte är sitt standard-värde
		if (!type.information) newQueryParams.info = "false";
		if (!type.event) newQueryParams.event = "false";
		if (!sortNewestFirst) newQueryParams.newest = "false";

		// Dessa är från början false eller null
		const filters = {
			s: search,
			tags: tags,
			pub: publisher,
			start: startDate,
		};

		for (const key in filters) {
			const value = filters[key];
			if (value) {
				newQueryParams[key] = value;
			}
		}

		if (endDate && endDate !== new Date().toDateString()) {
			newQueryParams.end = endDate;
		}

		return newQueryParams;
	}, [
		search,
		type,
		filterTags,
		sortNewestFirst,
		publisher,
		startDate,
		endDate,
	]);

	// Sätter filtret vid inladdning från query params
	// biome-ignore lint/correctness/useExhaustiveDependencies: migrate fix from eslint
	useEffect(() => {
		// Kör bara om det faktiskt finns en query
		if (!router.isReady) {
			return;
		}

		// Tar bara med de som inte är sitt standard-värde
		if (query.info === "false") setType({ ...type, information: false });
		if (query.event === "false") setType({ ...type, event: false });
		if (query.newest === "false") {
			setSortNewestFirst(false);
			postList.reverse();
		}

		const queryTags = query.tags?.split("-") || [];
		const tags = {};
		for (const tag of queryTags) {
			tags[tag] = true;
		}

		setFilterTags((filterTags) => ({ ...filterTags, ...tags }));

		if (query.s) setSearch(query.s);
		if (query.pub) setPublisher(query.pub);
		if (query.start) setStartDate(query.start);
		if (query.end) setEndDate(query.end);
	}, [router.isReady]); // Is ready för att den inte ska uppdateras när filtret uppdateras

	// Uppdaterar länken när filtret ändras
	// biome-ignore lint/correctness/useExhaustiveDependencies: migrate fix from eslint
	useEffect(() => {
		// Hindrar att den ändrar query innan query laddats in
		if (!router.isReady) {
			return;
		}

		// Uppdatera bara om det finns något att uppdatera - hindrar att den rensar vid inladdning
		if (Object.keys(queryParams).length > 0 || Object.keys(query).length > 0) {
			// Körs två gånger av någon anledning men det funkar - oftast när det är typ som ändras
			replace({ query: queryParams }, undefined, { shallow: true });
		}
	}, [queryParams]);

	//HTML för filterpaneler
	const TypPanel = () => {
		return (
			<div>
				<h3>
					<FontAwesomeIcon icon={faFilter} /> Inläggstyp
				</h3>
				<div className={filterStyles.buttonMenu}>
					<button
						type="button"
						className={`${type.information ? filterStyles.selected : ""}`}
						onClick={(e) => {
							handleSetType(e, "information");
						}}
					>
						Information
					</button>
					<button
						type="button"
						className={`${type.event ? filterStyles.selected : ""}`}
						onClick={(e) => {
							handleSetType(e, "event");
						}}
					>
						Event
					</button>
				</div>
			</div>
		);
	};

	const SortPanel = () => {
		return (
			<div>
				<h3>
					<FontAwesomeIcon icon={faArrowDownWideShort} /> Sortera
				</h3>
				<div className={filterStyles.buttonMenu}>
					<button
						type="button"
						className={sortNewestFirst ? filterStyles.selected : ""}
						onClick={() => toggleSort()}
					>
						Nyast först
					</button>
				</div>
			</div>
		);
	};

	const CommitteesPanel = () => {
		return (
			<div>
				<h3>
					<FontAwesomeIcon icon={faPen} /> Publicerad av
				</h3>
				<select
					name="committeePicker"
					className={filterStyles.committeePicker}
					value={publisher}
					onChange={(e) => {
						setPublisher(e.target.value);
					}}
				>
					<option value={""}>Alla</option>
					{all_committees.map((committee) => {
						return (
							<option key={committee.id} value={committee.id}>
								{committee.name}
							</option>
						);
					})}
				</select>
			</div>
		);
	};

	const TagPanel = () => {
		return (
			<div>
				<h3>
					<FontAwesomeIcon icon={faTags} /> Kategorier
				</h3>
				<div className={filterStyles.buttonMenu}>
					{Object.keys(filterTags).map((tag, index) => {
						return (
							<button
								type="button"
								className={`tag ${
									filterTags[tag] ? filterStyles.selected : ""
								}`}
								name={tag}
								key={index}
								onClick={handleTagClick}
							>
								{tag}
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	const DatumPanel = () => {
		return (
			<div className={filterStyles.publishDateWrapper}>
				<h3>
					<FontAwesomeIcon icon={faCalendarDays} /> Publiceringsdatum
				</h3>
				<strong>Från&nbsp;</strong>
				<input
					type="date"
					className={filterStyles.datePicker}
					required
					value={convertDate(new Date(Date.parse(startDate)))}
					onChange={(e) => setStartDate(new Date(e.target.value))}
					max={endDate}
				/>
				<br />
				<br />
				<strong>Till &nbsp;&nbsp;</strong>
				<input
					type="date"
					className={filterStyles.datePicker}
					required
					value={convertDate(new Date(Date.parse(endDate)))}
					onChange={(e) => setEndDate(new Date(e.target.value))}
				/>
			</div>
		);
	};

	// Någon useEffect kanske om användaren laddar in fler inlägg
	// eller vill söka som bara lägger till de nya i newsList/eventList
	return (
		<div id="contentbody" className="wideContent">
			<div className={styles.header}>
				<h1>Sök bland alla Nyheter</h1>
				<NotificationBell />
			</div>
			<div className={styles.aktuelltWrapper}>
				{/*filterpanel för widescreen*/}
				<section className={`${filterStyles.panel} ${filterStyles.wide}`}>
					<h2>Filtrera inlägg</h2>
					<TypPanel />
					<SortPanel />
					<TagPanel />
					<CommitteesPanel />
					<DatumPanel />
				</section>

				<div>
					<div
						className={`${filterStyles.panelWrapper} ${filterStyles.smallPanel}`}
						ref={panelRef}
					>
						<div className={`inputfält ${fokusSearchBar ? "active" : ""}`}>
							<input
								type="text"
								name="searchbar"
								className="searchbar"
								placeholder="Sök efter inlägg..."
								value={search}
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
							<button
								type="button"
								className={styles.layoutToggle}
								onClick={() => setIsGridLayout(!isGridLayout)}
								title={isGridLayout ? "Visa som lista" : "Visa som rutnät"}
							>
								<FontAwesomeIcon icon={isGridLayout ? faList : faGrip} />
							</button>
						</div>

						<section
							className={` ${filterStyles.panel} ${
								filterPanelOpen ? filterStyles.open : filterStyles.collapsed
							}`}
						>
							<div className={filterStyles.subPanels}>
								<div>
									<TypPanel />
									<SortPanel />
								</div>
								<div>
									<TagPanel />
								</div>
								<div>
									<DatumPanel />
									<CommitteesPanel />
								</div>
							</div>
						</section>
					</div>

					{/* Alla inlägg */}
					<div className={isGridLayout ? styles.postGrid : styles.posts}>
						<FeedPreview
							posts={postList
								.filter((post) => {
									return (
										(publisher === "" || post.committee === publisher) &&
										(search === "" ||
											post.title
												.toLowerCase()
												.includes(search.toLowerCase())) &&
										type[post.type]
									);
								})
								.filter((post) => {
									//Om alla filters är avstända eller påslagna, returnera allt
									if (Object.keys(filterTags).every((k) => filterTags[k])) {
										return true;
									}
									if (Object.keys(filterTags).every((k) => !filterTags[k])) {
										return true;
									}
									return post.tags.some((tag) => filterTags[tag]);
								})
								.filter((post) => {
									let res = true;
									const publishDate = new Date(
										post.publishDate.seconds * 1000,
									);

									if (endDate && publishDate > endDate) {
										res = false;
									}
									if (startDate && publishDate < startDate) {
										res = false;
									}
									return res;
								})
								.slice(0, currentpage * itemsperpage)}
							goBack={true}
							isGridLayout={isGridLayout}
						/>
					</div>
					<button
						type="button"
						className={`${styles.loadMore} ${
							currentpage * itemsperpage >= postList.length && styles.nope
						}`}
						onClick={
							currentpage * itemsperpage < postList.length
								? () => setcurrentPage(currentpage + 1)
								: () => {}
						}
					>
						{currentpage * itemsperpage < postList.length
							? "Ladda fler inlägg"
							: "Inga fler inlägg att hämta"}
					</button>
				</div>
			</div>
		</div>
	);
}

export async function getStaticProps() {
	const postList = [];

	// Aktuellt
	const postRef = collection(firestore, "posts");

	// Skapar en query - vilka inlägg som ska hämtas
	const postQuery = query(
		postRef,
		where("visibility", "in", ["public", "hidden"]),
		orderBy("publishDate", "desc"),
		limit(60),
	);

	// Hämtar inläggen från firestore
	let postDocs = [];
	try {
		postDocs = await getDocs(postQuery);
	} catch (error) {
		console.error("Det gick inte att ladda inläggen: ", error.toString());
	}

	// Plockar ut data och lägger till id i post data
	postDocs.forEach((doc) => {
		const data = doc.data();
		data.id = doc.id;
		postList.push(data);
	});

	// Postlist är listan med de senaste inläggen
	// stringify gör om listan till en sträng parse gör sedan om till objekt
	return {
		props: {
			postList: JSON.parse(JSON.stringify(postList)),
		},
		revalidate: 60 * 60 * 12, // Som oftast var 12:e timme - utöver de som kommer in när inlägg uppdateras
	};
}
