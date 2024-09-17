import CustomHead from "@/components/CustomHead";
import ShopCard from "@/components/ShopCard";
import { patchData, shoppingData } from "@/constants/shoppingData";

import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "@/styles/cl-shop.module.css";
import { useState } from "react";

import Link from "next/link";

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
					För att beställa behöver du kontakta sektionens Försäljningsansvarig.
				</p>
				<p>
					Personen finns oftast tillgänglig på sektionsmöten, eller så kan du
					mejla till{" "}
					<Link
						className={styles.email}
						href="mailto:forsaljning@cl-sektionen.se"
					>
						forsaljning@cl-sektionen.se
					</Link>
					. På <Link href={"/fortroendevalda"}>sidan för förtroendevalda</Link>{" "}
					kan du se vem som är nuvarande Försäljningsansvarig. .
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
