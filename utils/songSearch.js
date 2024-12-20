export const rankSearchResult = (song, searchTerm, index) => {
	let score = 0;
	const searchLower = searchTerm.toLowerCase();

	// Exact title match gets highest score
	if (song.title.toLowerCase() === searchLower) {
		score += 100;
	}
	// Title contains search term
	else if (song.title.toLowerCase().includes(searchLower)) {
		score += 50;
	}

	// Check alternate titles
	if (song.altSearch?.some((alt) => alt.toLowerCase().includes(searchLower))) {
		score += 40;
	}

	// Page number exact match
	if (song.sida === searchTerm) {
		score += 30;
	}

	// Category match
	if (song.kategori.toLowerCase().includes(searchLower)) {
		score += 20;
	}

	// Content match
	const words = searchTerm
		.toLowerCase()
		.replace(/[#_:.,*|/\"\'\\!?()[\]\{\}+'´']/gm, "")
		.trim()
		.split(" ");

	const contentMatches = words.every((word) => {
		const songRefs = index[word]?.split(" ") || [];
		return songRefs.some((ref) => song.href.endsWith(ref));
	});

	if (contentMatches) {
		score += 10;
	}

	return score;
};
