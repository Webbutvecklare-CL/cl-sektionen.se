import BackButton from "@/components/BackButton";
import CustomHead from "@/components/CustomHead";

import Schema_v1 from "@/media/mottagning/schema_1.webp";
import Schema_v2 from "@/media/mottagning/schema_2.webp";
import Schema_v3 from "@/media/mottagning/schema_3.webp";
import Schema_legend from "@/media/mottagning/schema_legend.webp";

import Image from "next/image";

export default function Schema() {
	return (
		<>
			<CustomHead
				metaTitle={"Mottagningsschema | Sektionen för Civilingenjör och Lärare"}
				description={"Schemat för mottagningen 2024."}
				url={"https://www.cl-sektionen.se/mottagning/schema"}
			/>
			<div id="contentbody" className="wideContent">
				<BackButton page="mottagning">Mottagningssidan</BackButton>
				<div>
					<article>
						<h1>Mottagningsschema</h1>
						<h2>Första veckan, v.33</h2>
						<Image
							src={Schema_v1}
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: "100%", height: "auto" }}
						/>
						<h2>Andra veckan, v.34</h2>
						<Image
							src={Schema_v2}
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: "100%", height: "auto" }}
						/>
						<h2>Tredje veckan, v.35</h2>
						<Image
							src={Schema_v3}
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: "100%", height: "auto" }}
						/>
						<h2>Teckenförklaring</h2>
						<Image
							src={Schema_legend}
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: "100%", height: "auto" }}
						/>
					</article>
				</div>
			</div>
		</>
	);
}
