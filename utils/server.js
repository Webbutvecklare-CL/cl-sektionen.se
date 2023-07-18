// För client sidan
export function revalidate(page = "all", postId = "") {
  const url = `/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_TOKEN}&page=${page}&postId=${postId}`;
  const headers = {
    "Content-Type": "application/json",
    "method": "GET",
  };
  console.log("Sending revalidation request for " + page);
  fetch(url, headers)
    .then((res) => {
      if (res.ok) {
        console.log("Revalidation successful page: " + page);
      } else {
        console.warn("Revalidation unsuccessful", res.statusText);
      }
    })
    .catch((error) => console.error(error));
}

export function sendNotification(user, data) {
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + user.accessToken,
    },
    body: JSON.stringify({ data }),
  };
  fetch(`/api/notifications`, options).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        console.log(data);
      });
    } else {
      res.json().then((data) => {
        console.error(data);
      });
    }
  });
}

// För server api
/**
 * Verifiera att användaren som gjorde requesten är inloggad och har rättigheter.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise som resolvar med uid och permission om användaren finns i databasen, annars rejectar den med error
 */
export async function verifyUser(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        reject({ error: "Missing authorization header" });
      }

      const idToken = authorization.split("Bearer ")[1];
      if (!idToken) {
        reject({ error: "Invalid authorization header" });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid } = decodedToken;

      // Kolla vilka rättigheter användaren har
      const userDoc = await admin.firestore().collection("users").doc(uid).get();
      const user = userDoc.data();

      resolve({ uid, permission: user.permission });
    } catch (error) {
      reject({ error });
    }
  });
}
