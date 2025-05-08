import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail, 
  onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword as firebaseUpdatePassword,
  browserLocalPersistence, browserSessionPersistence, setPersistence } from 'firebase/auth';

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

// Initialize Firebase Auth
const auth = getAuth(app);

// Export Auth functions
export {
  auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  firebaseUpdatePassword,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
};

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
// Helper to find a post by title (case-insensitive)
const findPostByTitle = async (title) => {
  const postsRef = collection(db, 'posts');
  const snapshot = await getDocs(postsRef);
  if (snapshot.empty) return null;
  const lowerTitle = title.toLowerCase().trim();
  const post = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.title && data.title.toLowerCase().trim() === lowerTitle;
  })
  return post || null;
};
export const getPost = async (title) => {
  try {
    const post = await findPostByTitle(title);
    //safe guard against undefined as well
    if (post != null) {
      return {
        id: post.id,
        ...post.data(),
        date: post.data().date ? formatDate(post.data().date.toDate()) : 'No date'
      };
    }

    return null;
  } catch (error) {
    console.error('Error in getPost:', error);
    return null;
  }
};

export const addPost = async (postData) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const existing = await findPostByTitle(postData.title);
  if (existing) throw new Error('A post with this title already exists!');
  return await addDoc(collection(db, 'posts'), {
    ...postData,
    date: postData.date instanceof Date ? postData.date : new Date(postData.date),
    createdAt: serverTimestamp()
  });
};


export const deletePost = async (title) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const post = await findPostByTitle(title);
  if (!post) throw new Error('Post not found');
  const postRef = doc(db, 'posts', post.id);
  await deleteDoc(postRef);
};  


const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}