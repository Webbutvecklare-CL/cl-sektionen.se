import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase/clientApp";
const firestore = getFirestore(app);

function createId(data, type = "") {
	if (type === "SM") {
		// Kommer funka i lite mindre än 2000 år
		return `sm-${data.number}-${new Date().getFullYear() - 2000}`;
	}

	if (type === "StyM") {
		// Kommer funka i lite mindre än 2000 år
		return `stym-${data.number}-${new Date().getFullYear() - 2000}`;
	}

	let newData = `${data}`;

	newData = newData.toLowerCase();
	newData = newData.replace(/[åä]/g, "a");
	newData = newData.replace(/ö/g, "o");
	newData = newData.replace(/([\W_]+){1,}/g, "-"); // Tar bort alla konstiga tecken
	newData = newData.replace(/[ ]{1,}/g, "-"); // Byter ut alla mellanslag till -
	newData = newData.replace(/-*$/, ""); // Tar bort alla bindestreck i slutet

	return newData;
}

async function validateLink(data, type) {
	const exist = true;
	const unique_link = createId(data, type);

	return new Promise((resolve, reject) => {
		// Kolla om det finns ett dokument med den länken
		getDoc(doc(firestore, "posts", unique_link))
			.then((docSnap) => {
				if (docSnap.exists()) {
					// Länken finns redan
					resolve(false);
				} else {
					// Länken finns inte
					resolve(unique_link);
				}
			})
			.catch((error) => reject(error));
	});
}

// Ändrar värdet så att det är en korrekt länk
const getTypedLink = (txt) => {
	if (txt.endsWith(" ")) {
		// Låter användaren skriva mellan slag som om de lägger till fler tecken blir ett -
		return `${createId(txt)} `;
	}
	if (txt.endsWith("-")) {
		// Låter användaren skriva in - som försvinner om inga fler tecken läggs till
		return `${createId(txt)}-`;
	}
	return createId(txt);
};

export { validateLink, createId, getTypedLink };
