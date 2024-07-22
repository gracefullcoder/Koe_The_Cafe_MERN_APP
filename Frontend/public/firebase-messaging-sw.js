importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


const firebaseConfig = {
  apiKey: "AIzaSyBtuKlwUxYA-1fYpoPUGVD2e8CeO5DAvtw",
  authDomain: "koe-the-kafe.firebaseapp.com",
  projectId: "koe-the-kafe",
  storageBucket: "koe-the-kafe.appspot.com",
  messagingSenderId: "85120969518",
  appId: "1:85120969518:web:50867b9e03ee49356d28bf",
  measurementId: "G-RF5RHCZH9G"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

