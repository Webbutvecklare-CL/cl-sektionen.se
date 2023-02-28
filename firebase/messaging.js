import firebase from "firebase/app";
import localforage from "localforage";
import { isSupported, getMessaging, getToken } from "firebase/messaging";
//enables messaging
export default async function enableMessaging() {
  if (typeof window !== "undefined") {
    if (isSupported()) {
      try {
        if ((await localforage.getItem("fcm_token")) !== null) {
          console.log("FCM Token already exists: " + (await localforage.getItem("fcm_token")));
          return false;
        }
        await Notification.requestPermission();
        // console.log(firebase.apps);
        const messaging = getMessaging();
        const token = await getToken(messaging, {
          vapidKey:
            "BOhBPHGOqQCjY-LHq0C2sYo_0yoWW87X0a_Pk-YupV0wyJLauCJJm90_jPYAS78g-qaUrpycktrhKwvU72kNbdA",
        });
        localforage.setItem("fcm_token", token);
        console.log("fcm_token", token);
      } catch (error) {
        console.log(error);
        throw "Unknown error occurred";
      }
    } else {
      console.log("Not supported");
      throw "Not Supported";
    }
  } else {
    console.log("Error");
  }
}
