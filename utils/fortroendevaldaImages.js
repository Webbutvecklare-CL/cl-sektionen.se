import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Normaliserar en sträng för jämförelse (tar bort emojis, specialtecken och gör gemener)
 */
function normalizeString(str) {
	if (!str) return "";
	return str
		.toLowerCase()
		.replace(
			/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
			"",
		)
		.replace(/[^a-z0-9åäö]/g, "")
		.trim();
}

/**
 * Letar reda på en person från personlistan som bäst matchar ett delnamn/filnamn
 */
function findMatchingPerson(people, key) {
	if (!people || !people.length || !key) return null;
	const normKey = normalizeString(key);
	if (!normKey) return null;

	for (const person of people) {
		// Kolla explicit image-fält om det finns
		if (person.image && normalizeString(person.image).includes(normKey)) {
			return person;
		}

		// Kolla roll (t.ex. "balgeneral", "talman", "ordförande")
		const normRole = normalizeString(person.role);
		if (normRole && (normRole.includes(normKey) || normKey.includes(normRole))) {
			return person;
		}

		// Kolla personens namn (t.ex. "frida", "anders")
		const normName = normalizeString(person.name);
		if (normName && (normName.includes(normKey) || normKey.includes(normName))) {
			return person;
		}
	}

	return null;
}

/**
 * Hämtar och mappar alla bilder för förtroendevalda från public/media/fortroendevalda/
 * @param {Array} fortroendevaldaList - Lista med kommittéer och personer från constants/fortroendevaldaData.js
 * @returns {Record<string, Array<{ url: string, alt: string, caption: string, personInfo: object|null }>>}
 */
export function getCommitteeImages(fortroendevaldaList = []) {
	const baseDir = path.join(process.cwd(), "public/media/fortroendevalda");
	const committeeImages = {};

	if (!existsSync(baseDir)) {
		return committeeImages;
	}

	const allowedExtensions = new Set([".webp", ".png", ".jpg", ".jpeg", ".avif"]);

	// Bygg en snabb-lookup för kommittéernas people-listor
	const committeeMap = new Map();
	for (const item of fortroendevaldaList) {
		committeeMap.set(item.id, item);
	}

	// Läs alla filer och mappar i basmappen
	const rootEntries = readdirSync(baseDir);

	// Samla potentiella bilder per kommitté-id
	for (const item of fortroendevaldaList) {
		const committeeId = item.id;
		const foundImages = [];
		const addedPaths = new Set();

		// 1. Kolla om det finns en undermapp: public/media/fortroendevalda/<committeeId>/
		const subDirPath = path.join(baseDir, committeeId);
		if (existsSync(subDirPath) && statSync(subDirPath).isDirectory()) {
			const subFiles = readdirSync(subDirPath);
			for (const fileName of subFiles) {
				const ext = path.extname(fileName).toLowerCase();
				if (allowedExtensions.has(ext)) {
					const fileBase = path.basename(fileName, ext);
					const fullWebPath = `/media/fortroendevalda/${committeeId}/${fileName}`;
					if (!addedPaths.has(fullWebPath)) {
						addedPaths.add(fullWebPath);
						foundImages.push({
							fileName,
							fileBase,
							url: fullWebPath,
						});
					}
				}
			}
		}

		// 2. Kolla filer i rotmappen som matchar committeeId
		//    T.ex. ctyrelsen.webp, ctyrelsen_1.webp, ctyrelsen-2.webp, enskilda_balgeneral.webp
		for (const fileName of rootEntries) {
			const ext = path.extname(fileName).toLowerCase();
			if (!allowedExtensions.has(ext)) continue;

			const fileBase = path.basename(fileName, ext);

			// Exakt match (ctyrelsen.webp) eller prefix (ctyrelsen_*, ctyrelsen-*)
			const isExact = fileBase === committeeId;
			const isPrefix =
				fileBase.startsWith(`${committeeId}_`) ||
				fileBase.startsWith(`${committeeId}-`);

			if (isExact || isPrefix) {
				const fullWebPath = `/media/fortroendevalda/${fileName}`;
				if (!addedPaths.has(fullWebPath)) {
					addedPaths.add(fullWebPath);
					const subKey = isExact
						? ""
						: fileBase.slice(committeeId.length + 1);
					foundImages.push({
						fileName,
						fileBase: subKey || fileBase,
						url: fullWebPath,
						isExact,
					});
				}
			}
		}

		// 3. Kolla om personer i listan har en explicit definierad bild (om den finns på disk)
		if (item.people) {
			for (const person of item.people) {
				if (person.image) {
					const imgPath = person.image.startsWith("/")
						? person.image
						: `/media/fortroendevalda/${person.image}`;
					if (!addedPaths.has(imgPath)) {
						addedPaths.add(imgPath);
						foundImages.push({
							fileName: path.basename(imgPath),
							fileBase: path.basename(imgPath, path.extname(imgPath)),
							url: imgPath,
							matchedPerson: person,
						});
					}
				}
			}
		}

		// Sortera bilderna stabilt:
		// Exakt match (<committeeId>.webp) hamnar först om inte specifika nummer/namn sorteras
		foundImages.sort((a, b) => {
			if (a.isExact && !b.isExact) return -1;
			if (!a.isExact && b.isExact) return 1;
			return a.fileName.localeCompare(b.fileName, undefined, {
				numeric: true,
				sensitivity: "base",
			});
		});

		// 4. Strukturera varje bild med alt, caption och ev personInfo
		committeeImages[committeeId] = foundImages.map((img, index) => {
			const person =
				img.matchedPerson ||
				findMatchingPerson(item.people, img.fileBase);

			let caption = "";
			if (person) {
				caption = person.role
					.replace(
						/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
						"",
					)
					.trim();
			} else if (foundImages.length > 1) {
				// Om det är t.ex. ctyrelsen_1 -> "Bild 1" eller delnamn
				const cleanKey = img.fileBase.replace(/^[0-9]+$/, (n) => `Bild ${n}`).trim();
				if (/^\d+$/.test(cleanKey) || !cleanKey || cleanKey === committeeId) {
					caption = `Bild ${index + 1} av ${foundImages.length}`;
				} else {
					// Formatera t.ex. "del-1" till "Del 1"
					caption = cleanKey
						.replace(/[-_]/g, " ")
						.replace(/\b\w/g, (c) => c.toUpperCase());
				}
			}

			return {
				url: img.url,
				alt: person
					? `${person.name} - ${person.role}`
					: `${item.id} - ${caption || "Gruppbild"}`,
				caption,
				personInfo: person
					? {
							name: person.name,
							role: person.role,
							year: person.year,
							mail: person.mail,
						}
					: null,
			};
		});
	}

	return committeeImages;
}

export default getCommitteeImages;
