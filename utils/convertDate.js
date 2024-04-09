//Används för att konvertera datumet som är sparad i firebase till datumsträng på yyyy-mm-dd format
//Eftersom .toLocaleString() gav error i production build.
export function convertDate(date) {
	const y = String(date.getUTCFullYear());
	let m = String(date.getUTCMonth() + 1);
	let d = String(date.getUTCDate());

	if (m.length < 2) {
		m = `0${m}`;
	}

	if (d.length < 2) {
		d = `0${d}`;
	}

	const res = [y, m, d].join("-");
	return res.includes("NaN") ? "" : res;
}
