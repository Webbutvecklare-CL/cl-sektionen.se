importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");
importScripts("swenv.js"); // Skapas av swEnvBuild.js i root mappen

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const messaging = firebase.messaging();

console.log("SW loaded");

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const link = e.notification.data.link;
  if (link) {
    e.waitUntil(self.clients.openWindow(link));
  }
});

messaging.onBackgroundMessage((payload) => {
  console.log("New background notification!", payload);
  // Det finns olika typer data och notification. Se och läs noga "Message types"
  // https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages
  if (payload.notification) {
    // Gör någon automatisk grej, fett drygt. Kan användas för att skicka campaigns
  } else {
    const notification = payload.data;

    const title = notification.title;
    const options = {
      body: notification.body,
      icon: notification.icon || "/media/icons/icon-512x512.png",
      badge: "/media/icons/badge-330x330.webp", // Lite icon som visas på "Android Chrome"
      image: notification.image,
      tag: notification.tag || "",
      data: { link: notification.link },
    };
    if (notification.tag) {
      options.renotify = true;
    }
    self.registration.showNotification(title, options);
  }
});
