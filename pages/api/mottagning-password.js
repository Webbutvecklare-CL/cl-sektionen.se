import { serialize } from "cookie";
import rateLimit from "../../utils/rate-limit";

import admin from "../../firebase/firebaseAdmin";

const limiter = rateLimit({
	interval: 60 * 1000, // 60 seconds
	uniqueTokenPerInterval: 500, // Max 500 users per second
});

// Tar emot inloggningsförsök från mottagningssidan och sätter en cookie om lösenordet är rätt
export default async function handler(req, res) {
	// Kollar om användaren försöker mer än 10 gånger per minut
	try {
		const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		await limiter.check(res, 10, ip); // 10 requests per minute per ip
	} catch {
		return res.status(429).json({ error: "Rate limit exceeded" });
	}

	if (req.method === "GET") {
		return handleKeyReq(req, res);
	}
	if (req.method === "POST") {
		if (req.body.type === "password") {
			return handlePasswordReq(req, res);
		}
		return res.status(405).send("Type not declared or not allowed");
	}
	return res.status(405).send("Method not allowed");
}

function handlePasswordReq(req, res) {
	const password = req.body.password;

	if (process.env.MOTTAGNING_PASSWORD === password) {
		let maxAge;
		if (req.cookies?.allowCookies === "true") {
			maxAge = process.env.NODE_ENV === "development" ? 60 : 60 * 60 * 24 * 14; // 60 sekunder eller 2 veckor
		} else {
			maxAge = undefined; // Blir en session cookie
		}

		// Om ingen maxAge sätts så blir det en session cookie
		const cookie = serialize("mottagning_key", process.env.MOTTAGNING_KEY, {
			path: "/",
			httpOnly: true,
			maxAge: maxAge,
		});
		res.setHeader("Set-Cookie", cookie);
		res
			.status(200)
			.json({
				success: "Logged in",
				mottagning_key: process.env.MOTTAGNING_KEY,
			});
	} else {
		res.status(401).json({ error: "Incorrect Password" });
	}
}

async function handleKeyReq(req, res) {
	const key = req.headers.mottagning_key;
	if (key === process.env.MOTTAGNING_KEY) {
		// Hämtar alla mottagningsposts
		const posts = [];
		const mottagningsPostsRef = admin
			.firestore()
			.collection("mottagningsPosts");
		try {
			const postDocs = await mottagningsPostsRef.limit(40).get();
			for (const doc of postDocs) {
				const data = doc.data();
				posts.push(data);
			}
		} catch (err) {
			console.log("Error getting documents", err);
			return res.status(200).json({ error: "Kunde inte ladda inläggen" });
		}
		return res.status(200).json({ posts });
	}
	return res.status(401).json({ error: "Incorrect key" });
}
