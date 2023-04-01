import functions, { logger } from "firebase-functions";

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
export const updateUser = functions.firestore
  .region("europe-west3")
  .document("posts/{postId}")
  .onUpdate((change, context) => {
    // Revalidate:ar hemsidan
    fetch(`https://${process.env.DOMAIN}/api/revalidate?secret=${process.env.REVALIDATE_TOKEN}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            logger.log(data);
          });
        }
      })
      .catch(logger.warn("Could not revalidate pages"));

    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (!newValue.image) {
      // Om det saknas en bild radera en eventuell tidigare bild
    } else if (newValue.image !== previousValue.image) {
      // Kollar om det är en ny bild i så fall: Ta bort den förra bilden
    }

    logger.log("Post uppdaterad");
  });

