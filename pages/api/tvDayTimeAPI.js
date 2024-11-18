const sunAPI =
	"https://api.sunrise-sunset.org/json?lat=59.325117&lng=18.071093&formatted=0";

export async function getSunTime() {
	const response = await fetch(sunAPI);
	const jsonData = await response.json();

	const now = new Date();
	const sunrise = new Date(jsonData.results.sunrise);
	const sunset = new Date(jsonData.results.sunset);

	return now >= sunrise && now < sunset;
}
export default async function handler(req, res) {
	const jsonData = await getSunTime();
	res.status(200).json(jsonData);
}
