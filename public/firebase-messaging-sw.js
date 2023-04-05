importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCImoQ7ARRJ16nxGr1OaHuFhmWerJckg-E",
  authDomain: "cl-sektionen-test.firebaseapp.com",
  projectId: "cl-sektionen-test",
  storageBucket: "cl-sektionen-test.appspot.com",
  messagingSenderId: "1017530078266",
  appId: "1:1017530078266:web:2c2fd85c6f515b356f9103",
  measurementId: "G-7Q1MHPQ2EM",
});

const messaging = firebase.messaging();

console.log("SW loaded");

messaging.onBackgroundMessage(function (message) {
  // Om notisen kommer som en data-notis se
  // https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages
  if (message.data.title) {
    console.log("New foreground notification with data!", message.data);
    self.registration.showNotification(message.data.title, {
      body: message.data.body,
      icon: "/media/grafik/favicon/android-chrome-512x512.png",
      image: message.data.image,
      link: message.data.link,
    });
  } else {
    // Notis typ
    console.log("New foreground notification with notification!", message.notification);
    // Gör inget för den visas automatiskt av någon anledning
  }
});
