import Image from "next/image";

import busIcon from "@/media/tv/buss.svg";
import trainIcon from "@/media/tv/roslagsbana.svg";
import subwayIcon from "@/media/tv/tunnelbana.svg";

export default function TravelIcon({ icon }) {
	let srcImage = null;

	if (icon === "tunnelbana") {
		srcImage = subwayIcon;
	} else if (icon === "roslagsbana") {
		srcImage = trainIcon;
	} else if (icon === "buss") {
		srcImage = busIcon;
	}

	return (
		<Image src={srcImage} width={32} height={32} alt={`ikon för ${icon}`} />
	);
}
