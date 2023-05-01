import { firestore, messaging } from "./clientApp";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import localforage from "localforage";

const VAPID_KEY =
  "BOhBPHGOqQCjY-LHq0C2sYo_0yoWW87X0a_Pk-YupV0wyJLauCJJm90_jPYAS78g-qaUrpycktrhKwvU72kNbdA";

// https://github.com/FirebaseExtended/expense-tracker

// Requests permissions to show notifications.
async function requestNotificationsPermissions(collection) {
  console.log("Requesting notifications permission...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");
    // Notification permission granted.
    await saveMessagingDeviceToken(collection);
  } else {
    console.log("Unable to get permission to notify.");
  }
}

// Saves the messaging device token to Cloud Firestore.
export async function saveMessagingDeviceToken(collection) {
  console.log("save msg device token");

  try {
    const msg = await messaging();
    const fcmToken = await getToken(msg, { vapidKey: VAPID_KEY });
    if (fcmToken) {
      console.log("Got FCM device token:", fcmToken);
      // Save device token to Firestore
      const tokenRef = doc(firestore, `fcmTokens/${collection}`);
      await updateDoc(tokenRef, {
        tokens: arrayUnion(fcmToken),
      });
      // This will fire when a message is received while the app is in the foreground.
      // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
      onMessage(msg, (message) => {
        // Om notisen kommer som en data-notis se
        // https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages
        if (message.data.title) {
          console.log("New foreground notification with data!", message.data);
          new Notification(message.data.title, {
            body: message.data.body,
            icon: "/media/grafik/favicon/android-chrome-512x512.png",
            image: message.data.image,
            link: message.data.link,
            click_action: message.data.link,
          });
        } else {
          // Notis typ
          console.log("New foreground notification with notification!", message.notification);
          new Notification(message.notification.title, {
            body: message.notification.body,
            icon: "/media/grafik/favicon/android-chrome-512x512.png",
            image: message.notification.image,
            link: message.notification.link,
            click_action: message.data.link,
          });
        }
      });
      return fcmToken;
    } else {
      // Need to request permissions to show notifications.
      return requestNotificationsPermissions(collection);
    }
  } catch (error) {
    console.error("Unable to get messaging token.", error);
    return error;
  }
}
