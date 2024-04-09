import { useRouter } from "next/router";
import React from "react";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BackButton({ page = "", children }) {
	const router = useRouter();

	function handleBackClick() {
		// Om knappen ska gå tillbaka i historiken
		if (page === "history") {
			router.back();
		} else {
			router.push(`/${page}`);
		}
	}

	return (
		<button type="button" className="back-button" onClick={handleBackClick}>
			<FontAwesomeIcon icon={faArrowLeft} /> {children}
		</button>
	);
}
