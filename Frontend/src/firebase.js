import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { toast } from "react-toastify";
import { toastMessage } from "./helperfunction";

const firebaseConfig = {
  apiKey: "AIzaSyBtuKlwUxYA-1fYpoPUGVD2e8CeO5DAvtw",
  authDomain: "koe-the-kafe.firebaseapp.com",
  projectId: "koe-the-kafe",
  storageBucket: "koe-the-kafe.appspot.com",
  messagingSenderId: "85120969518",
  appId: "1:85120969518:web:50867b9e03ee49356d28bf",
  measurementId: "G-RF5RHCZH9G"
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
    const token = await getToken(messaging, { vapidKey: "BCeMqK_AWyGgdzOkHw3tbj75qVdmuDL6p0-8YMrc_Gqx8oGWyWOBIth9CXfqV6SFY4RDFkDRQBsZTvLDL0w2AhM" });
    console.log(token);
    const saveTokenUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/notification/${userId}`
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


