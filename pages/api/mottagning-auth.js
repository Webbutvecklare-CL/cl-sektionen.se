// API route to check if user is authenticated for mottagning
export default function handler(req, res) {
	const isLoggedIn = req.cookies.mottagning_key === process.env.MOTTAGNING_KEY;

	res.status(200).json({ isLoggedIn });
}
