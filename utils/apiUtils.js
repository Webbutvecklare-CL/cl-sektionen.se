import admin from "@/firebase/firebaseAdmin";

/**
 * Verifiera att användaren som gjorde requesten är inloggad och har rättigheter.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise som resolvar med uid och permission om användaren finns i databasen, annars rejectar den med error
 */
export function verifyUser(req, res) {
	return new Promise((resolve, reject) => {
		try {
			const { authorization } = req.headers;
			if (!authorization) {
				reject({ error: "Missing authorization header" });
			}

			const idToken = authorization.split("Bearer ")[1];
			if (!idToken) {
				reject({ error: "Invalid authorization header" });
			}

			admin
				.auth()
				.verifyIdToken(idToken)
				.then((decodedToken) => {
					const { uid } = decodedToken;

					// Kolla vilka rättigheter användaren har
					return admin.firestore().collection("users").doc(uid).get();
				})
				.then((userDoc) => {
					const user = userDoc.data();
					if (!user) {
						reject({ error: "User not found" });
					}

					resolve({ uid: userDoc.id, permission: user.permission });
				})
				.catch((error) => {
					reject({ error });
				});
		} catch (error) {
			reject({ error });
		}
	});
}
