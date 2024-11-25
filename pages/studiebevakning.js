import MarkdownRender from "@/components/MarkdownRender";
import { getContentData } from "@/utils/contents";

import { fortroendevaldaList } from "@/constants/fortroendevaldaData";
import Link from "next/link";

export default function Studiebevakning({ contents }) {
	return (
		<div id="contentbody">
			<h1 id="page-title">Studiebevakning</h1>
			<p className="headerText">
				På denna sidan kan du läsa om hur du kan påverka din utbildning och
				studentliv samt vad det finns för hjälp att få. Studienämnden på
				sektionen är ofta bra att kontakta när det kommer till studiebevakning,
				och har ofta koll på dina rättigheter eller om du behöver hjälp.
			</p>

			<p>Nuvarande Studienämnd består av {getStudienamnd()}. Du kan hitta deras kontaktuppgifter på <Link	href="fortroendevalda#studienamnden">sidan för förtroendevalda</Link>.</p>
			<MarkdownRender mdData={contents.influence} />
			<MarkdownRender mdData={contents.kursnamnd} />
			<MarkdownRender mdData={contents.akademisktintro} />
		</div>
	);
}

function getStudienamnd() {
	const studienamndData = fortroendevaldaList.find(
		(item) => item.id === "studienamnden",
	);
	const people = studienamndData?.people || [];

	let members = "";
	people.forEach((person, index) => {
		const memberInfo = `${person.role} ${person.name} (${person.year})`;
		if (index === 0) {
			members += memberInfo;
		} else if (index === people.length - 1) {
			members += ` och ${memberInfo}`;
		} else {
			members += `, ${memberInfo}`;
		}
	});

	return members;
}

export async function getStaticProps() {
	const contents = getContentData("studiebevakning");
	return {
		props: {
			contents,
		},
	};
}
