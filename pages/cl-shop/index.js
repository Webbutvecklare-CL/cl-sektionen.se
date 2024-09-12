import CustomHead from "@/components/CustomHead";
import ShopCard from "@/components/ShopCard";
import { patchData, shoppingData } from "@/constants/shoppingData";
import styles from "@/styles/cl-shop.module.css";

export default function CL_shop() {
	return (
		<>
			<CustomHead
				metaTitle={"CL-shop | Sektionen för Civilingenjör och Lärare"}
				description={
					"Här hittar du vad som finns att köpa hos Försäljningsansvarig."
				}
				url={"https://www.cl-sektionen.se/webbshopp"}
			/>
			<div id="contentbody">
				<h1 id={"page-title"}>CL-shop</h1>
				<p>
					För att beställa behöver du kontakta sektionens Försäljningsansvarig.
					Du betalar genom att swisha sektionen på numret:{" "}
					<span>123-29 38 108</span>
				</p>
				<h2>Sektions-prylar</h2>
				<ul className={styles.itemList}>
					{shoppingData.items.map((item) => (
						<ShopCard key={item.id} item={item} />
					))}
				</ul>
				<h2>Märken</h2>
				<ul className={styles.itemList}>
					{patchData.items.map((item) => (
						<ShopCard key={item.id} item={item} />
					))}
				</ul>
			</div>
		</>
	);
}
