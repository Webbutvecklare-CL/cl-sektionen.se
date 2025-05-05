import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getContentData } from "@/utils/contents";

import CustomHead from "@/components/CustomHead";
import DubbelspexetInfo from "@/components/DubbelspexetInfo";

import {
	abouts,
	all_rubrics,
	all_rubrics_ids,
	contact,
	inProgress,
	interest,
	welcome,
} from "@/constants/dubbelspexet-rubrics";

import { fortroendevaldaList } from "@/constants/fortroendevaldaData";

import styles from "@/styles/dubbelspexet.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Rubrics({ descriptions }) {
	const router = useRouter();
	const [selectedRubric, setselectedRubric] = useState("valkommen");

	console.log("selectedRubric:", selectedRubric);
	console.log("Markdown for selected rubric:", descriptions[selectedRubric]);

	// När sidan laddats in så sätter vi selectedRubric till det angivna i url:en
	useEffect(() => {
		const urlSelect = router.asPath.split("#")[1] || "valkommen";
		setselectedRubric(urlSelect);
		const element = document.getElementById("dubbelspexetContent");
		//element.scrollIntoView({ behavior: "smooth" });
	}, [router.asPath]);

	// När en användare väljer en nämnd uppdateras url:en och vilken nämnd som visas
	const stateUpdater = (rubric) => {
		//console.log("Rubrik " + rubric)

		router.replace(`#${rubric}`);
		const element = document.getElementById("dubbelspexetContent");
		setselectedRubric(rubric);
	};

	// Nav Tab för varje nämnd/post i menyvalet
	const NavTab = ({ data, idx }) => {
		return (
			<li
				key={idx}
				className={selectedRubric === data.id ? styles.active : ""}
				onClick={() => stateUpdater(data.id)}
				onKeyDown={() => stateUpdater(data.id)}
			>
				{data.name}
			</li>
		);
	};

	// finds the data with the correct id in the list

	const getInfo = (rubric) => {
		for (let i = 0; i < all_rubrics.length; i++) {
			if (all_rubrics[i].id === rubric) {
				return all_rubrics[i];
			}
		}
		return null;
	};

	return (
		<>
			<CustomHead
				metaTitle={"Dubbelspexet | Sektionen för Civilingenjör och Lärare"}
				description={
					"Detta är Dubbelspexets hemsida, det är en underkategori på CL-sektionens hemsida"
				}
				url={"https://www.cl-sektionen.se/dubbelspexet"}
			/>
			<div id="contentbody" className="wideContent">
				<img
					src="../../media/dubbelspexet/Logga-RättFärg.png"
					alt="Dubbelspexet"
					className={styles.logo}
				/>

				<div className={styles.dubbelspexetWrapper}>
					<nav className={styles.dubbelspexetNav}>
						<ul>
							<NavTab data={welcome} />

							<NavTab data={inProgress} />

							<NavTab data={interest} />

							<NavTab data={contact} />

							<h2>Om</h2>
							{abouts.map((about, idx) => {
								return <NavTab data={about} key={idx} />;
							})}
							<br />
						</ul>
					</nav>
					<div id="dubbelspexetContent" className={styles.dubbelspexetContent}>
						<DubbelspexetInfo
							rubric={selectedRubric}
							descriptions={descriptions[selectedRubric]}
							//{console.log(info)}
							//groupData={getInfo(selectedRubric)}
						/>
					</div>
				</div>
				<span className="lastUpdated">Senast uppdaterad: 2025-29-04</span>
			</div>
		</>
	);
}
export async function getStaticProps() {
	// get text from markdown for all pages
	const descriptions = getContentData("dubbelspexet");
	console.log("Descriptions som skickas till sidan:", descriptions);
	return {
		props: {
			descriptions,
		},
	};
}
