import styles from "@/styles/shop-card.module.css";

import Image from "next/image";

import { useState } from "react";

export default function ShopCard({ item }) {
	const shopImgPath = `/media/shopping/${item.id}.webp`;

	const AltImageBox = (props) => {
		const [usingAltImage, useAltImage] = useState(false);

		return !usingAltImage ? (
			<Image
				{...props}
				onError={() => {
					useAltImage(true);
				}}
			/>
		) : (
			<Image {...props} src="/media/shopping/placeholder.webp" />
		);
	};

	return (
		<li key={item.id} className={styles.itemCard}>
			<AltImageBox
				src={shopImgPath}
				alt={item.name}
				className={styles.itemImage}
				width={150}
				height={150}
			/>
			<div>
				<p className={styles.itemTitle}>{item.name}</p>
				<p className={styles.itemDescription}>{item.description || " "}</p>
				<p className={styles.itemPrice}>{item.price}:-</p>
			</div>
		</li>
	);
}
