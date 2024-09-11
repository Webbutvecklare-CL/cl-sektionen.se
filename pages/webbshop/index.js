import CustomHead from "@/components/CustomHead";
import { shoppingData } from "@/constants/shoppingData";
import styles from "@/styles/webbshop.module.css";

export default function Webbshop() {
	return (
		<>
			<CustomHead
				metaTitle={"Webbshop | Sektionen för Civilingenjör och Lärare"}
				description={
					"Här hittar du vad som finns att köpa hos Försäljningsansvarig."
				}
				url={"https://www.cl-sektionen.se/webbshopp"}
			/>
			<div id="contentbody">
				<h1 id={"page-title"}>Webbshop</h1>
				<ul className={styles.itemList}>
					{shoppingData.items.map((item) => (
						<li key={item.id} className={styles.itemCard}>
							<img
								src={`/media/shopping/${item.id}.webp`}
								alt={item.name}
								className={styles.itemImage}
							/>
							<div>
								<p className={styles.itemTitle}>{item.name}</p>
								<p className={styles.itemDescription}>
									{item.description ? item.description : "Beskrivning saknas"}
								</p>
								<p className={styles.itemPrice}>{item.price} :-</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
