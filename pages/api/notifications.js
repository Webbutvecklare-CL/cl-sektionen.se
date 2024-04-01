import { FieldValue } from "firebase-admin/firestore";
import admin from "../../firebase/firebaseAdmin";

import { verifyUser } from "../../utils/apiUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }
  console.log("Received notification request with message:", req.body);

  if (!req.body.data) {
    return res.status(400).send({ message: "Felaktiga attribut i body." });
  }
  let uid = "";
  let permission = "";
  try {
    ({ uid, permission } = await verifyUser(req, res));
  } catch (error) {
    console.error("Error validating user authentication:", error);
    return res.status(401).json({ error: error.error });
  }

  let type;
  let message;
  let dryRun = false;

  // Kollar vilken typ av notis det är och skapar payload
  // Om inget matchar returnera 400 error
  if (req.body.data.type === "post") {
    try {
      const postData = await verifyRequest(uid, req.body.data.postId);

      // Skapa payload objekt med all data
      const payload = createPostPayload(postData);
      type = postData.type;
      message = {
        topic: "new_post",
        ...payload,
        collapseKey: req.body.data.postId, // Gör att notiser med samma id byter ut den tidigare notisen
        fcmOptions: { analyticsLabel: "new_post" },
      };
    } catch (error) {
      console.error("Verification failed:", error);
      return res.status(400).send({ message: `Verifiering misslyckades: ${error}` });
    }
  } else if (req.body.data.type === "mottagning") {
    type = "mottagning";
    dryRun = req.body.data.dryRun || false;
    const payload = {
      data: {
        title: `Mottagningen: ${req.body.data.title}`,
        body: req.body.data.body,
        icon: "/media/icons/icon-512x512.png", // kanske alla nämnders loggor här
        link: "/mottagning",
      },
    };
    message = {
      topic: "mottagning",
      ...payload,
      fcmOptions: { analyticsLabel: "mottagning" },
    };
  } else if (req.body.data.type === "custom") {
    if (permission !== "admin") {
      return res.status(401).send({
        message: "Du har inte tillåtelse att skicka anpassade notiser",
      });
    }
    dryRun = req.body.data.dryRun || false;
    type = "information";
    const payload = {
      data: {
        title: req.body.data.title,
        body: req.body.data.body,
        image: req.body.data.image || "",
        icon: "/media/icons/icon-512x512.png", // kanske alla nämnders loggor här
        link: "/",
      },
    };
    message = {
      topic: "custom",
      ...payload,
      fcmOptions: { analyticsLabel: "custom" },
    };
  } else {
    return res.status(400).send({ message: "Felaktig typ av notis" });
  }

  // Typ lite oklart vad dessa headers gör
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-Type", "application/json");

  try {
    // Skickar notis till alla som följer eventuella taggar
    const response = await sendNotification(type, message, dryRun);

    // Skickar tillbaka respons
    return res.status(200).json({
      message: `Notis skickad till ${response.successCount} enheter och misslyckades skicka till ${response.failureCount} enheter.`,
      data: req.query.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ett fel inträffade", error });
  }
}

// Hjälpfunktioner

async function sendNotification(type, message, dryRun = false) {
  return new Promise((resolve, reject) => {
    // Hämtar alla tokens - de som ska få notisen
    getTokens(type)
      .then((tokens) => {
        console.log(`Sending notification to ${tokens.length} devices`);
        if (tokens.length > 0) {
          message.tokens = tokens;
          admin
            .messaging()
            .sendEachForMulticast(message, dryRun)
            .then((response) => {
              console.log(
                "Successfully sent notification to:",
                response.successCount,
                "tokens. Failed to send notification to:",
                response.failureCount,
                "tokens"
              );

              cleanupTokens(response, tokens).then((removedTokens) => {
                console.log("Removed", removedTokens.length, "invalid tokens");

                // Skickar tillbaka antal tokens som notisen skickades till, detta är egentligen lite fel då vissa kan vara ogiltiga
                resolve({
                  ok: true,
                  successCount: response.successCount,
                  failureCount: response.failureCount,
                });
              });
            })
            .catch((error) => {
              console.error(
                "Something went wrong with sending notification or cleaning up tokens.",
                error
              );
              reject({
                ok: false,
                successCount: 0,
                failureCount: tokens.length,
                error,
              });
            });
        } else {
          console.log("No tokens to send notification to");
          resolve({ ok: true, successCount: 0, failureCount: 0 });
        }
      })
      .catch((error) => {
        console.error("Something went wrong fetching tokens", error);
        reject({ ok: false, successCount: 0, failureCount: 0, error });
      });
  });
}

function createPostPayload(data) {
  return {
    data: {
      title: `${data.author} publicerade ett ${data.type === "event" ? "event" : "inlägg"}`,
      body: `${data.title}`,
      image: data.image || "",
      icon: "/media/icons/icon-512x512.png", // kanske alla nämnders loggor här
      link: `/aktuellt/${data.id}`,
    },
  };
}

async function getTokens(type) {
  const selectedTokens = new Set(); // Set gör att tokens inte ska räknas dubbelt

  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection("fcmTokens")
      .doc("all")
      .get()
      .then((allTokensDoc) => {
        const allTokensObj = allTokensDoc.data();

        console.log("hej");

        for (const [token, settings] of Object.entries(allTokensObj)) {
          if (settings.enabled && settings.types[type]) {
            selectedTokens.add(token);
          }
        }

        resolve(Array.from(selectedTokens));
      })
      .then(() => removeOldTokens(allTokensObj))
      .then((removedTokens) => {
        console.log("Removed", removedTokens.length, "old tokens");
      })
      .catch((error) => {
        console.error("Something went wrong with removing old tokens", error);
      })
      .catch((error) => reject(error));
  });
}

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response, tokens) {
  // For each notification we check if there was an error.
  const tokensDelete = [];
  response.responses.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error("Failure sending notification to", {
        token: tokens[index],
        message: error.message,
        code: error.code,
      });
      // Cleanup the tokens that are not registered anymore.
      if (
        error.message === "The registration token is not a valid FCM registration token" ||
        error.code === "messaging/invalid-registration-token" ||
        error.code === "messaging/registration-token-not-registered"
      ) {
        // Ta bort från alla prenumerationer struktur kommer förändras
        const allTokensRef = admin.firestore().collection("fcmTokens").doc("all");

        // Lägger in en request för att ta bort varje token
        tokensDelete.push(
          allTokensRef.update({
            [`${tokens[index]}`]: FieldValue.delete(),
          })
        );
      }
    }
  });

  // Gör så att funktionen tar bort samtliga ogiltiga tokens innan den resolvar
  return Promise.all(tokensDelete);
}

// Remove old tokens
function removeOldTokens(tokensData) {
  const todayDate = new Date().getTime();
  const maxTime = 1000 * 60 * 60 * 24 * 365; // 365 days in milliseconds

  const removedTokens = [];

  const allTokensRef = admin.firestore().collection("fcmTokens").doc("all");

  for (const [token, settings] of Object.entries(tokensData)) {
    const lastUpdated = new Date(settings.lastUpdated).getTime();
    if (todayDate - lastUpdated > maxTime) {
      // Tar bort ifrån event prenumerationen
      removedTokens.push(
        allTokensRef.update({
          [token]: FieldValue.delete(),
        })
      );
    }
  }

  return Promise.all(removedTokens);
}

function verifyRequest(userId, postId) {
  return new Promise((resolve, reject) => {
    console.log("Verifying request for user", userId, "and post", postId);
    const db = admin.firestore();
    const postRef = db.collection("posts").doc(postId);
    const snap = postRef.get();

    snap
      .then((docSnap) => {
        if (docSnap.exists) {
          const postData = docSnap.data();

          if (postData.creator !== userId) {
            reject({ error: "not a valid user" });
          }

          postData.id = postId;

          resolve(postData);
        } else {
          reject({ error: "no document" });
        }
      })
      .catch((err) => {
        console.error("Error getting document:", err);
        reject({ error: err });
      });
  });
}
