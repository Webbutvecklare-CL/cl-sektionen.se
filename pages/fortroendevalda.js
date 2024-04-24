import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getContentData } from "@/utils/contents";

import NewCommitteeInfo from "@/components/CommitteeInfo";
import CustomHead from "@/components/CustomHead";

import {
	associations,
	board,
	committees,
	trustees,
} from "../constants/committees-data";

import { fortroendevaldaList } from "../constants/fortroendevaldaData";

import styles from "@/styles/fortroendevalda.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Fortroendevalda({ descriptions }) {
	const router = useRouter();
	const [selectedCommittee, setSelectedCommittee] = useState("ctyrelsen");

	// När sidan laddats in så sätter vi selectedCommittee till det angivna i url:en
	useEffect(() => {
		const urlSelect = router.asPath.split("#")[1] || "ctyrelsen";
		setSelectedCommittee(urlSelect);
		window.scrollTo(0, 0);
	}, [router.asPath]);

	// När en användare väljer en nämnd uppdateras url:en och vilken nämnd som visas
	const stateUpdater = (committee) => {
		router.replace(`#${committee}`);
		window.scrollTo(0, 0);
		setSelectedCommittee(committee);
	};

	// Nav Tab för varje nämnd/post i menyvalet
	const NavTab = ({ data, idx }) => {
		return (
			<li
				key={idx}
				className={selectedCommittee === data.id ? styles.active : ""}
				onClick={() => stateUpdater(data.id)}
				onKeyDown={() => stateUpdater(data.id)}
			>
				<FontAwesomeIcon icon={data.icon} /> {data.name}
			</li>
		);
	};

	// finds the data with the correct id in the list
	const getCommitteeInfo = (committee) => {
		for (let i = 0; i < fortroendevaldaList.length; i++) {
			if (fortroendevaldaList[i].id === committee) {
				return fortroendevaldaList[i];
			}
		}
		return null;
	};

	return (
		<>
			<CustomHead
				metaTitle={"Förtroendevalda | Sektionen för Civilingenjör och Lärare"}
				description={
					"Här hittar du kontaktuppgifter till styrelsen och övriga förtroendevalda."
				}
				url={"https://www.cl-sektionen.se/fortroendevalda"}
			/>
			<div id="contentbody" className="wideContent">
				<h1 id={"page-title"}>Förtroendevalda och nämndbeskrivningar</h1>
				<div className={styles.fortroendevaldaWrapper}>
					<nav className={styles.committeeNav}>
						<ul>
							<NavTab data={board} />

							<h2>Nämnder</h2>
							{committees.map((committee, idx) => {
								return <NavTab data={committee} key={idx} />;
							})}
							<br />

							<h2>Övriga förtroendevalda</h2>
							{trustees.map((trustee, idx) => {
								return <NavTab data={trustee} key={idx} />;
							})}
							<br />

							<h2>Sektionsföreningar</h2>
							{associations.map((association, idx) => {
								return <NavTab data={association} key={idx} />;
							})}
						</ul>
					</nav>
					<div id={styles.fortroendevaldaContent}>
						<NewCommitteeInfo
							committee={selectedCommittee}
							description={descriptions[selectedCommittee]}
							groupData={getCommitteeInfo(selectedCommittee)}
						/>
					</div>
				</div>
				<span className="lastUpdated">Senast uppdaterad: 2024-04-24</span>
			</div>
		</>
	);
}
export async function getStaticProps() {
	// get text from markdown for all pages
	const descriptions = getContentData("fortroendevalda");

	return {
		props: {
			descriptions,
		},
	};
}
