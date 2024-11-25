import CustomHead from "@/components/CustomHead";
import ShopCard from "@/components/ShopCard";
import { fortroendevaldaList } from "@/constants/fortroendevaldaData";
import { patchData, shoppingData } from "@/constants/shoppingData";

import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "@/styles/cl-shop.module.css";
import { useState } from "react";

import Link from "next/link";

/**
 * Hämtar namnet till försäljningsansvarig med formatet "Namn (CL-år)".
 *
 * @returns {string} Namnet på försäljningsansvarig, eller en tom sträng om inte hittad.
 */
function getSalesResponsibleName() {
	const enskildaData = fortroendevaldaList.find(
		(item) => item.id === "enskilda",
	);
	const salesResponsible = enskildaData?.people.find((person) =>
		person.role.startsWith("Försälj"),
	);
	return `${salesResponsible?.name} (${salesResponsible?.year})` || "";
}

export default function CL_shop() {
	const [isDrawerOpen, setIsDrawerOpen] = useState({
		shopping: true,
		patches: true,
	});

	const toggleDrawer = (section) => {
		setIsDrawerOpen((prevState) => ({
			...prevState,
			[section]: !prevState[section],
		}));
	};

	return (
		<>
			<CustomHead
				metaTitle={"CL-shop | Sektionen för Civilingenjör och Lärare"}
				description={
					"Här hittar du vad som finns att köpa hos Försäljningsansvarig."
				}
				url={"https://www.cl-sektionen.se/cl-shop"}
			/>
			<div id="contentbody">
				<h1 id="page-title">CL-shop</h1>
				<p>
					För att beställa behöver du kontakta sektionens Försäljningsansvarig,
					som för närvarande är {getSalesResponsibleName()}.
				</p>
				<p>
					Försäljningsansvarig finns oftast tillgänglig på sektionsmöten, eller
					så kan du mejla till{" "}
					<Link
						className={styles.email}
						href="mailto:forsaljning@cl-sektionen.se"
					>
						forsaljning@cl-sektionen.se
					</Link>
					.
				</p>
				<p>
					Du betalar genom att swisha sektionen på numret:{" "}
					<span className={styles.phoneNumber}>123-29 38 108</span>
				</p>

				<div className={styles.drawerSection}>
					<button
						type="button"
						onClick={() => toggleDrawer("shopping")}
						className={styles.drawerToggle}
					>
						Sektions-prylar
						<FontAwesomeIcon
							icon={isDrawerOpen.shopping ? faAngleUp : faAngleDown}
							className={styles.drawerIcon}
						/>
					</button>
					<div
						className={`${styles.drawerContent} ${isDrawerOpen.shopping ? styles.open : styles.closed}`}
					>
						<ul className={styles.itemList}>
							{shoppingData.items.map((item) => (
								<ShopCard key={item.id} item={item} />
							))}
						</ul>
					</div>
				</div>

				<div className={styles.drawerSection}>
					<button
						type="button"
						onClick={() => toggleDrawer("patches")}
						className={styles.drawerToggle}
					>
						Märken
						<FontAwesomeIcon
							icon={isDrawerOpen.patches ? faAngleUp : faAngleDown}
							className={styles.drawerIcon}
						/>
					</button>
					<div
						className={`${styles.drawerContent} ${isDrawerOpen.patches ? styles.open : styles.closed}`}
					>
						<ul className={styles.itemList}>
							{patchData.items.map((item) => (
								<ShopCard key={item.id} item={item} />
							))}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
