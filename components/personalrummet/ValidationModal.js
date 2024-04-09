import { createId, getTypedLink, validateLink } from "@/utils/postUtils";
import { useState } from "react";

import Modal from "../Modal";

import { actionMenu } from "@/styles/personalrummet/post-form.module.css";

export default function ValidationModal({ data, onClose, onError }) {
	const [unique, setUnique] = useState(false);
	const [validating, setValidating] = useState(false);
	const [result, setResult] = useState(""); // Felmeddelande från valideringen
	const [newLink, setNewLink] = useState("");

	return (
		<Modal
			onClose={() => {
				onClose(false);
			}}
		>
			<h2>Adressen/id:et är inte unik</h2>
			<p>Ange en egen adress eller generera en unik:</p>
			{validating && <p>Validerar...</p>}
			{result && <p>{result}</p>}
			<div className={actionMenu}>
				<input
					type="text"
					value={newLink}
					className={!unique ? "error" : ""}
					onChange={(e) => {
						setUnique(true);
						setNewLink(getTypedLink(e.target.value));
					}}
				/>
				<button
					type="button"
					onClick={() => {
						setUnique(true);
						const randomLink = createId(
							`${data.title}-${new Date().toISOString().substring(0, 10)}`,
							data.type,
						);
						setNewLink(randomLink);
					}}
				>
					Auto
				</button>
			</div>
			<div className={actionMenu}>
				<button
					type="button"
					onClick={async () => {
						setValidating(true);
						setResult("");
						try {
							// Funktionen resolverar med false om länken inte är unik annars med länken
							const link = await validateLink(newLink, data.type);
							if (link) {
								// Länken är unik
								setUnique(true);
								onClose(link);
							} else {
								// Försök igen
								setUnique(false);
								setResult("Länken är inte unik");
							}
						} catch (error) {
							console.error("Fel vid valideringen av länken:", error);
							onError(error);
						}

						setValidating(false);
					}}
				>
					Fortsätt
				</button>
				<button
					type="button"
					onClick={() => {
						onClose(false);
					}}
				>
					Avbryt
				</button>
			</div>
		</Modal>
	);
}
