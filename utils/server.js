export function revalidate(page = "all", postId = "") {
  const url = `/api/revalidate?secret=${"Y3c6e9a07c10d202b26345t8b22bf4044"}&page=${page}&postId=${postId}`;
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

import admin from "firebase-admin";
import serviceAccount from "../firebase/cl-sektionen-test-firebase-adminsdk-hg4t4-d28e5cc501.json";
export async function sendNotification(data) {
  // Admin initialization
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Initialized.");
  } catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
      console.error("Firebase admin initialization error", error.stack);
    }
  }

  // Skapa payload objekt med all data
  const payload = createPayload(data);

  // Hämtar alla tokens - de som ska få notisen
  const tokens = await getTokens(data.type);

  console.log(`Sending notification to ${tokens.length} devices`);
  if (tokens.length > 0) {
    // Send notifications to all tokens.
    const options = {
      webpush: {
        headers: {
          TTL: "86400",
        },
        fcm_options: {
          link: payload.link,
          click_action: payload.link,
        },
      },
    };
    try {
      const response = await admin.messaging().sendToDevice(tokens, payload, options);
      await cleanupTokens(response, tokens);
      console.log("Notifications have been sent and tokens cleaned up.");
    } catch (error) {
      console.error("Something went wrong with sending notification or cleaning up tokens.", error);
    }
  }
}

export function createPayload(data) {
  return {
    data: {
      title: `${data.committee} publicerade ${data.type == "event" ? "ett event" : "ett inlägg"}`,
      body: `${data.title}`,
      image: data.image || "",
      // icon: data.image || "/images/profile_placeholder.png", // kanske alla nämnders loggor här
      link: `https://${"cl-sektionen.vercel.app"}/aktuellt/${data.id}`,
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
  console.warn("No cleanup");
  return;
  // For each notification we check if there was an error.
  const tokensDelete = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error("Failure sending notification to", tokens[index], error);
      // Cleanup the tokens that are not registered anymore.
      if (
        error.code === "messaging/invalid-registration-token" ||
        error.code === "messaging/registration-token-not-registered"
      ) {
        // Ta bort från alla prenumerationer struktur kommer förändras
        const deleteTask = admin.firestore().collection("fcmTokens").doc(tokens[index]).delete();
        tokensDelete.push(deleteTask);
      }
    }
  });
  return Promise.all(tokensDelete);
}
