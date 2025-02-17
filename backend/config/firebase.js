import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app, storage };
