import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore/lite"; // Lite SDK for reads
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail, 
  onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword as firebaseUpdatePassword,
  browserLocalPersistence, browserSessionPersistence, setPersistence
} from 'firebase/auth';

import { formatDate } from '../utils/helpers';

// Initialize Firebase immediately (no need for async init)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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

/**
 * Firebase Firestore Helper Functions
 * 
 * This section contains functions for interacting with the Firestore database.
 * The functions are organized in two categories:
 * 1. Internal helper functions (not exported) - perform raw database operations
 * 2. Public API functions (exported) - format data and handle errors for component use
 */

/**
 * Get all blog posts from Firestore
 * @returns {Promise<Array>} Formatted array of blog posts with IDs and formatted dates
 */

/**
 * Utility function for retrying failed operations with exponential backoff
 * 
 * How the retry mechanism works:
 * 1. Attempts to execute the provided operation
 * 2. If it fails, increments the attempt counter and logs the failure
 * 3. If max retries reached, throws the final error
 * 4. Otherwise, waits using exponential backoff before trying again
 * 
 * See inline comments for detailed explanation of the Promise/await mechanism.
 * 
 * @param {Function} operation - Async function to retry if it fails
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @returns {Promise<any>} - Result of the operation if successful
 * @throws {Error} - Throws the last error if all retries fail
 */
const withRetry = async (operation, maxRetries = 3) => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      console.log(`Firebase operation failed. Attempt ${attempts}/${maxRetries}`);

      if (attempts >= maxRetries) {
        console.error('All retry attempts failed');
        throw error;
      }
      // Calculate base delay with exponential backoff
      // Base formula: 300ms * 2^attempts
      // This gives us: 600ms, 1200ms, 2400ms, etc.
      const baseDelay = 300 * Math.pow(2, attempts);

      // Add jitter to prevent thundering herd problem
      // - Multiplies base delay by a random factor between 0.7 and 1.3
      // - This spreads out retry attempts when many clients retry simultaneously
      // - Example: For a 1000ms base delay, actual delay will be between 700-1300ms
      const jitter = baseDelay * (0.7 + Math.random() * 0.6);

      // Wait using the calculated delay with jitter
      // This pauses only this function while allowing other code to run:
      // 1. Creates a Promise that resolves after the calculated delay
      // 2. await sees an unresolved Promise and pauses this function
      // 3. JavaScript continues running other code during this pause
      // 4. When setTimeout completes, it calls resolve() which fulfills the Promise
      // 5. The function resumes execution after the delay

      /*
       * EDUCATIONAL NOTE: Timing in JavaScript
       * -------------------------------------
       * Why use setTimeout instead of immediate Promise resolution?
       * 
       * Immediate resolution (what NOT to do):
       *   await new Promise(resolve => resolve());
       *   - Uses microtask queue
       *   - Delay is microscopic (microseconds)
       *   - Not suitable for retry mechanisms
       *
       * With setTimeout (what we use):
       *   await new Promise(resolve => setTimeout(resolve, delay));
       *   - Uses the task queue (macrotask)
       *   - Creates meaningful delays (hundreds of ms)
       *   - Allows CPU to handle other tasks during the wait
       *   - Essential for proper retry behavior
       *
       * This distinction is crucial for understanding JavaScript's event loop
       * and implementing effective retry mechanisms.
       */
      await new Promise(resolve => setTimeout(resolve, jitter));
    }
  }
};





export const getPosts = async () => {
  return withRetry(async () => {
    /* TEST RETRY MECHANISM: Uncomment to simulate network failures
     * This code creates artificial errors 70% of the time to test the retry mechanism.
     * Useful for:
     * 1. Verifying withRetry works correctly
     * 2. Testing how your UI handles loading states during retries
     * 3. Confirming error notifications appear only after all retries fail
     */
    // if (Math.random() < 0.7) {
    //   throw new Error("Simulated network error");
    // }

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
  });
};
/**
 * Internal helper function to find a post by its title (case-insensitive)
 * 
 * This is an internal helper that returns the raw Firestore document reference.
 * It's used by other functions like getPost() and updatePost() that need to
 * find posts by title for different purposes.
 * 
 * @param {string} title - The title to search for
 * @returns {Object|null} Raw Firestore document reference or null if not found
 */
const findPostByTitle = async (title) => {
  return withRetry(async () => {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);
    if (snapshot.empty) return null;
    const lowerTitle = title.toLowerCase().trim();
    const post = snapshot.docs.find(doc => {
      const data = doc.data();
      return data.title && data.title.toLowerCase().trim() === lowerTitle;
    })
    return post || null;
  });
};
/**
 * Public API function to get a post by its title
 * 
 * This function uses findPostByTitle() internally but adds:
 * 1. Error handling for component safety
 * 2. Data formatting (especially for dates)
 * 3. A clean interface for components to consume
 * 
 * Used primarily for public-facing blog pages where posts are accessed by title/slug
 * 
 * @param {string} title - The title of the post to retrieve
 * @returns {Object|null} Formatted post object or null if not found/error
 */
export const getPost = async (title) => {
  try {
    const post = await findPostByTitle(title);
    // Safe guard against undefined as well
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

/**
 * Create a new blog post in Firestore
 * 
 * This function performs several important operations:
 * 1. Verifies the user is authenticated
 * 2. Checks that no post with the same title exists (titles must be unique)
 * 3. Formats dates properly for Firestore storage
 * 4. Adds metadata like createdAt timestamp
 * 
 * @param {Object} postData - The blog post data to save
 * @returns {Promise<DocumentReference>} Reference to the newly created document
 * @throws {Error} If user is not authenticated or a post with same title exists
 */
export const addPost = async (postData) => {
    // Dynamically import write operations from full Firestore SDK
    const { addDoc, serverTimestamp } = await import('firebase/firestore');

  if (!auth.currentUser) throw new Error('Not authenticated');
  const existing = await findPostByTitle(postData.title);
  if (existing) throw new Error('A post with this title already exists!');
  return await addDoc(collection(db, 'posts'), {
    ...postData,
    date: postData.date instanceof Date ? postData.date : new Date(postData.date),
    createdAt: serverTimestamp()
  });
};


/**
 * Delete a blog post from Firestore by its title
 * 
 * This function:
 * 1. Verifies the user is authenticated
 * 2. Finds the post by title using the internal helper
 * 3. Deletes the post if found
 * 
 * Note: This currently uses title to find posts. Consider updating to use ID
 * for consistency with other admin operations.
 * 
 * @param {string} title - The title of the post to delete
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 * @throws {Error} If user is not authenticated or post not found
 */
export const deletePost = async (title) => {
  const { doc, deleteDoc } = await import('firebase/firestore/lite');
  if (!auth.currentUser) throw new Error('Not authenticated');
  const post = await findPostByTitle(title);
  if (!post) throw new Error('Post not found');
  const postRef = doc(db, 'posts', post.id);
  await deleteDoc(postRef);
};

/**
 * Public API function to get a post by its ID
 * 
 * This function retrieves a post directly by its document ID, which is more
 * efficient than searching by title. It's primarily used for admin operations
 * like editing posts where we have the exact ID.
 * 
 * @param {string} postId - The Firestore document ID of the post
 * @returns {Object|null} Formatted post object or null if not found/error
 */
export const getPostById = async (postId) => {
  if (!postId) return null;
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return {
        id: postSnap.id,
        ...postSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error in getPostById:', error);
    return null;
  }
};

/**
 * Update an existing blog post in Firestore
 * 
 * This function performs several important operations:
 * 1. Verifies the user is authenticated
 * 2. Ensures a post ID is provided
 * 3. Checks that no OTHER post with the same title exists (titles must be unique)
 * 4. Formats dates properly for Firestore storage
 * 5. Adds metadata like updatedAt timestamp
 * 
 * @param {string} postId - The ID of the post to update
 * @param {Object} postData - The updated blog post data
 * @returns {Promise<void>} Promise that resolves when update is complete
 * @throws {Error} If user is not authenticated, no ID provided, or title conflict
 */
export const updatePost = async (postId, postData) => {
  const { updateDoc, serverTimestamp } = await import('firebase/firestore');
  if (!auth.currentUser) throw new Error('Not authenticated');
  if (!postId) throw new Error('Post ID is required');

  // Check if another post with the same title exists (but not the current post)
  const existing = await findPostByTitle(postData.title);
  if (existing && existing.id !== postId) {
    throw new Error('Another post with this title already exists!');
  }

  const postRef = doc(db, 'posts', postId);
  return await updateDoc(postRef, {
    ...postData,
    date: postData.date instanceof Date ? postData.date : new Date(postData.date),
    updatedAt: serverTimestamp()
  });
};

