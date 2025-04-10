import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Initialize Firebase immediately (no need for async init)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Firestore helpers
export const getPosts = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to formatted date string
        date: data.date ? formatDate(data.date.toDate()) : 'No date'
      };
    });
  };

export const addPost = async (postData) => {
  return await addDoc(collection(db, 'posts'), postData);
};


// Add this at the bottom of the file
export const isAuthenticated = () => {
  console.log("localStorge", localStorage)
  return localStorage.getItem('isAuthenticated') === 'true' || 
         localStorage.getItem('password') === import.meta.env.VITE_ADMIN_PASSWORD;
}







const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };