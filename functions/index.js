import admin from "firebase-admin";
import functions, { logger } from "firebase-functions";
import fetch from "node-fetch";
admin.initializeApp();
export const createPost = functions
  .region("europe-west1")
  .firestore.document("posts/{postId}")
  .onCreate(async (snapshot, context) => {
    logger.log("Inlägg skapat ", context.params.postId);
    // Revalidate:ar hemsidan
    revalidate("all");
    revalidate("post", context.params.postId);

    // Skickar notis till alla som följer eventuella taggar
    const payload = createPayload(snapshot);
    // Hämtar alla tokens - de som ska få notisen
    const allTokens = new Set();
    const fcmTokensCollection = admin.firestore().collection("fcmTokens");
    const type = snapshot.data().type;
    if (type === "Event") {
      const eventTokenDoc = await fcmTokensCollection.doc("event").get();
      const eventTokens = eventTokenDoc.data().tokens;
      eventTokens.forEach((token) => allTokens.add(token));
    } else if (type === "Nyheter") {
      const newsTokenDoc = await fcmTokensCollection.doc("event").get();
      const newsTokens = newsTokenDoc.data().tokens;
      newsTokens.forEach((token) => allTokens.add(token));
    }

    sendNotification(payload, Array.from(allTokens));

    return 0;
  });

export const updatePost = functions
  .region("europe-west1")
  .firestore.document("posts/{postId}")
  .onUpdate((change, context) => {
    logger.log("Post uppdaterad");

    // Revalidate:ar hemsidan
    revalidate("all");
    revalidate("post", context.params.postId);

    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (!newValue.image) {
      // Om det saknas en bild radera en eventuell tidigare bild
    } else if (newValue.image !== previousValue.image) {
      // Kollar om det är en ny bild i så fall: Ta bort den förra bilden
    }

    // Om tid ändras skicka notis om det

    return 0;
  });

export const deletePost = functions
  .region("europe-west1")
  .firestore.document("posts/{postId}")
  .onDelete((context) => {
    logger.log("Post borttagen");

    // Revalidate:ar hemsidan
    revalidate("all");
    revalidate("post", context.params.postId);

    // Ta bort eventuell kopplad bild

    // Rensa alla notis prenumerationer

    return 0;
  });

function revalidate(page = "all", postId = "") {
  const url = `https://${process.env.DOMAIN}/api/revalidate?secret=${process.env.REVALIDATE_TOKEN}&page=${page}&postId=${postId}`;
  const headers = {
    "Content-Type": "application/json",
    "method": "GET",
  };
  logger.log("Sending revalidation request for " + page);
  fetch(url, headers)
    .then((res) => {
      if (res.ok) {
        logger.log("Revalidation successful page: " + page);
      } else {
        logger.warn("Revalidation unsuccessful", res.statusText);
      }
    })
    .catch((error) => logger.error(error));
}

// Sends the notification to all tokens
async function sendNotification(payload, tokens) {
  logger.log(`Sending notification to ${tokens.length} devices`);
  if (tokens.length > 0) {
    // Send notifications to all tokens.
    const response = await admin.messaging().sendToDevice(tokens, payload);
    await cleanupTokens(response, tokens);
    logger.log("Notifications have been sent and tokens cleaned up.");
  }
}

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response, tokens) {
  // For each notification we check if there was an error.
  const tokensDelete = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      logger.error("Failure sending notification to", tokens[index], error);
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

// Create payload
function createPayload(snapshot) {
  const data = snapshot.data();
  const type = data.type;
  return {
    notification: {
      title: `${data.committee} publicerade ${type == "Event" ? "ett event" : "en nyhet"}`,
      body: `${data.title}`,
      // icon: snapshot.data().image || "/images/profile_placeholder.png",
      click_action: `https://${process.env.DOMAIN}/aktuellt/${snapshot.id}`,
    },
  };
}
