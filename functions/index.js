import functions, { logger } from "firebase-functions";
import fetch from "node-fetch";

export const createPost = functions
  .region("europe-west1")
  .firestore.document("posts/{postId}")
  .onCreate((snapshot, context) => {
    logger.log("Post skapad");

    logger.log(context.params);
    // Revalidate:ar hemsidan
    revalidate("all");
    revalidate("post", context.params.postId);

    // Skickar notis till alla som följer eventuella taggar
    const type = snapshot.data().type;
    const payload = {
      notification: {
        title: `${snapshot.data().committee} publicerade ${
          type == "Event" ? "ett event" : "en nyhet"
        }`,
        body: `${snapshot.data().title}`,
        // icon: snapshot.data().image || "/images/profile_placeholder.png",
        click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/aktuellt/${snapshot.id}`,
      },
    };

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
  const url = `${process.env.DOMAIN}/api/revalidate?secret=${process.env.REVALIDATE_TOKEN}&page=${page}&postId=${postId}`;
  const headers = {
    "Content-Type": "application/json",
    "method": "GET",
  };
  logger.log("Sending revalidation request");
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

async function sendNotification(payload, tokens) {
  if (tokens.length > 0) {
    // Send notifications to all tokens.
    const response = await admin.messaging().sendToDevice(tokens, payload);
    await cleanupTokens(response, tokens);
    functions.logger.log("Notifications have been sent and tokens cleaned up.");
  }
}

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response, tokens) {
  // For each notification we check if there was an error.
  const tokensDelete = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      functions.logger.error("Failure sending notification to", tokens[index], error);
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
