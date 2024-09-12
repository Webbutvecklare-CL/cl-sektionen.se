import styles from "@/styles/shop-card.module.css";

export default function ShopCard({ item }) {
	return (
		<li key={item.id} className={styles.itemCard}>
			<img
				src={`/media/shopping/${item.id}.webp`}
				alt={item.name}
				className={styles.itemImage}
			/>
			<div>
				<p className={styles.itemTitle}>{item.name}</p>
				<p className={styles.itemDescription}>{item.description || " "}</p>
				<p className={styles.itemPrice}>{item.price} :-</p>
			</div>
		</li>
	);
}
