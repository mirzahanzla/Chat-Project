import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAallQC2v7H_4MQ5gBZo-OrxD_WZvc8FeU",
  authDomain: "influencer-e6302.firebaseapp.com",
  projectId: "influencer-e6302",
  storageBucket: "influencer-e6302.appspot.com",
  messagingSenderId: "177609698618",
  appId: "1:177609698618:web:3750af679ab0677e093403",
  measurementId: "G-P9R7X60576"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app, storage };
