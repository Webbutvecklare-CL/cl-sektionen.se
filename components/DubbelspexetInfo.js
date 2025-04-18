import MarkdownRender from "@/components/MarkdownRender";
import styles from "@/styles/dubbelspexet.module.css";
import { useState } from "react";

export default function DubbelspexetInfo({ rubric, descriptions }) {
	console.log("Info:", descriptions);
	return (
		<div>
			<MarkdownRender mdData={descriptions} />
		</div>
	);
}
