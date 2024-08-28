importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


const firebaseConfig = {
  apiKey: '<%= VITE_FIREBASE_API_KEY %>',
  authDomain: '<%= VITE_FIREBASE_AUTH_DOMAIN %>',
  projectId: '<%= VITE_FIREBASE_PROJECT_ID %>',
  storageBucket: '<%= VITE_FIREBASE_STORAGE_BUCKET %>',
  messagingSenderId: '<%= VITE_FIREBASE_MESSAGING_SENDER_ID %>',
  appId: '<%= VITE_FIREBASE_APP_ID %>',
  measurementId: '<%= VITE_FIREBASE_MEASUREMENT_ID %>'
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
    icon: "https://ik.imagekit.io/vaibhav11/Koe_Cafe/Additional/shape-4.png?updatedAt=1720483080805",
    body: payload.data.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

