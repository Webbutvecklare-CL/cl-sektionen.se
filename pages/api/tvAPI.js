export async function getData() {
	const response = await fetch(
		"https://transport.integration.sl.se/v1/sites/9204/departures",
	);
	const jsonData = await response.json();
	return jsonData.departures;
}
export default async function handler(req, res) {
	const jsonData = await getData();
	res.status(200).json(jsonData);
}
