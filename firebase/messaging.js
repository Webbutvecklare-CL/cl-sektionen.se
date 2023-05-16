import { firestore, messaging, analytics } from "./clientApp";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getToken } from "firebase/messaging";

import { logEvent } from "firebase/analytics";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

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

      logEvent(analytics, "notification_subscribe", { topic: collection });

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
