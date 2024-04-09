import styles from "../styles/modal.module.css";

export default function Modal({ children, onClose }) {
	const outsideClick = (e) => {
		if (e.target.id === "backdrop") {
			onClose();
		}
	};

	window.scrollTo(0, 0);

	return (
		<div
			id="backdrop"
			className={styles.modal}
			onClick={outsideClick}
			onKeyDown={outsideClick}
		>
			<div className={styles.modalContent}>{children}</div>
		</div>
	);
}
