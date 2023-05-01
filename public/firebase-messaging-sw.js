importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCImoQ7ARRJ16nxGr1OaHuFhmWerJckg-E",
  projectId: "cl-sektionen-test",
  messagingSenderId: "1017530078266",
  appId: "1:1017530078266:web:2c2fd85c6f515b356f9103",
  measurementId: "G-7Q1MHPQ2EM",
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
  console.log("New background notification with data!", payload);
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/media/grafik/favicon/android-chrome-512x512.png",
    image: payload.notification.image,
    data: { link: payload.data.link },
  };
  self.registration.showNotification(title, options);
});
