import { FieldValue } from "firebase-admin/firestore";
import admin from "../../firebase/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  console.log("Received notification request with message:", req.body);

  if (!req.body.data) {
    res.status(400).send({ message: "Felaktiga attribut i body." });
    return;
  }

  try {
    var { uid, permission } = await verifyUser(req, res);
  } catch (error) {
    console.error("Error validating user authentication:", error);
    res.status(401).json({ error: "Invalid authentication token" });
    return;
  }

  let topic;
  let message;

  if (req.body.data.type == "post") {
    try {
      const postData = await verifyRequest(uid, req.body.postId);

      // Skapa payload objekt med all data
      const payload = createPayload(postData);
      topic = postData.type;
      message = {
        topic: "new_post",
        ...payload,
        collapseKey: "new_post",
        fcmOptions: { analyticsLabel: "new_post" },
      };
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: error });
      return;
    }
  } else if (req.body.data.type == "custom") {
    if (permission !== "admin") {
      res.status(401).send({ message: "Du har inte tillåtelse att skicka anpassade notiser" });
      return;
    }
    topic = "information";
    const payload = {
      data: {
        title: req.body.data.title,
        body: req.body.data.body,
        image: req.body.data.image || "",
        icon: "/media/grafik/favicon/android-chrome-512x512.png", // kanske alla nämnders loggor här
        tag: "Nyhet",
        link: `/`,
      },
    };
    message = {
      topic: "custom",
      ...payload,
      collapseKey: "custom",
      fcmOptions: { analyticsLabel: "custom" },
    };
  } else {
    res.status(400).send({ message: "Felaktig typ av notis" });
    return;
  }

  // Typ lite oklart vad dessa headers gör
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-Type", "application/json");

  try {
    // Skickar notis till alla som följer eventuella taggar
    let response = await sendNotification(topic, message);
    // Skickar tillbaka respons
    res
      .status(200)
      .json({ message: `Notis skickat till ${response.tokens} enheter`, data: req.query.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Ett fel inträffade`, error });
  }
  return;
}

// Hjälpfunktioner

async function sendNotification(topic, message) {
  return new Promise(async (resolve, reject) => {
    // Hämtar alla tokens - de som ska få notisen
    const tokens = await getTokens(topic);

    console.log(`Sending notification to ${tokens.length} devices`);
    if (tokens.length > 0) {
      message.tokens = tokens;
      try {
        // Send notifications to all tokens.
        const response = await admin.messaging().sendEachForMulticast(message);
        await cleanupTokens(response, tokens);
        console.log("Notifications have been sent and tokens cleaned up.");
        resolve({ ok: true, tokens: tokens.length });
      } catch (error) {
        console.error(
          "Something went wrong with sending notification or cleaning up tokens.",
          error
        );
        reject({ ok: false, tokens: 0, error });
      }
    }
  });
}

function createPayload(data) {
  return {
    data: {
      title: `${data.committee} publicerade ${data.type == "event" ? "ett event" : "ett inlägg"}`,
      body: `${data.title}`,
      image: data.image || "",
      icon: "/media/grafik/favicon/android-chrome-512x512.png", // kanske alla nämnders loggor här
      tag: "Nytt inlägg",
      link: `/aktuellt/${data.id}`,
    },
  };
}

async function getTokens(type) {
  const allTokens = new Set(); // Set dör att tokens inte ska räknas dubbelt
  const fcmTokensCollection = admin.firestore().collection("fcmTokens");

  return new Promise(async (resolve, reject) => {
    if (type === "event") {
      const eventTokenDoc = await fcmTokensCollection.doc("event").get();
      const eventTokens = eventTokenDoc.data().tokens;
      eventTokens.forEach((token) => allTokens.add(token));

      resolve(Array.from(allTokens));
    } else if (type === "information") {
      const infoTokenDoc = await fcmTokensCollection.doc("information").get();
      const infoTokens = infoTokenDoc.data().tokens;
      infoTokens.forEach((token) => allTokens.add(token));

      resolve(Array.from(allTokens));
    } else {
      reject("Wrong type");
    }
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
        const eventTokensRef = admin.firestore().collection("fcmTokens").doc("event");
        const infoTokensRef = admin.firestore().collection("fcmTokens").doc("information");

        // Tar bort ifrån event prenumerationen
        tokensDelete.push(
          eventTokensRef.update({
            tokens: FieldValue.arrayRemove(tokens[index]),
          })
        );

        // Tar bort ifrån informations prenumerationen
        tokensDelete.push(
          infoTokensRef.update({
            tokens: FieldValue.arrayRemove(tokens[index]),
          })
        );
      }
    }
  });
  return Promise.all(tokensDelete);
}

function verifyRequest(userId, postId) {
  return new Promise(async (resolve, reject) => {
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
        reject({ error: err });
      });
  });
}

async function verifyUser(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: "Missing authorization header" });
      }

      const idToken = authorization.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).json({ error: "Invalid authorization header" });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid } = decodedToken;

      // Kolla vilka rättigheter användaren har
      const userDoc = await admin.firestore().collection("users").doc(uid).get();
      const user = userDoc.data();

      resolve({ uid, permission: user.permission });
    } catch (error) {
      reject(error);
    }
  });
}
