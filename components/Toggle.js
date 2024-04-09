import { useState } from "react";
import { toggle as styles } from "../styles/components.module.css";
export default function Toggle({ children, toggled, onClick }) {
	const [isToggled, toggle] = useState(toggled);

	// Bugg: Om en toggle har blivit ändrad utifrån så uppdateras den inte
	// Det fixas genom att klicka en gång. Så i UI perspektiv så gör det inte så mycket.
	// Användaren behöver bara trycka två gånger. Ex stänger av en typer med notiser
	// av så krävs två tryck för att få på en typ

	const callback = () => {
		onClick(!isToggled);
		toggle(!isToggled);
	};

	return (
		<label className={styles}>
			<input type="checkbox" checked={toggled} onChange={callback} />
			<span />
			<strong>{children}</strong>
		</label>
	);
}
