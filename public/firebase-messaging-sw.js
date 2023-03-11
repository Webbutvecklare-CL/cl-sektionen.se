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

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body + "asdfjkhasdhjklsdfhj",
    icon: "https://cl-sektionen.vercel.app/media/grafik/CL_logo_color_transparent.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
