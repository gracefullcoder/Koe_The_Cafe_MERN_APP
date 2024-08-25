import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { toast } from "react-toastify";
import { toastMessage } from "./helperfunction";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);


export const generateToken = async (userId) => {
  console.log('Requesting permission...');
  console.log(userId);

  toast.info("Allow Notification in your permission, we only send professional message, no spam!", {
    position: "top-center",
    autoClose: 5000
  });

  let permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    console.log(token);
    const saveTokenUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/pushnotification/${userId}`
    const fetchData = await fetch(saveTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ token: token })
    })

    const responseData = await fetchData.json();
    console.log(responseData);
    toastMessage(responseData);
  }

  if (permission === "denied") {
    toast.info("No Worries,You Can See Our Notificatios any Time in your Dashboard", {
      position: 'top-center',
      autoClose: 8000
    });
    console.log("denied");
  }
}


