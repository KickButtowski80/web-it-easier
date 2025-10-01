import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore/lite"; // Lite SDK for reads
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

// Connect to emulator in development
// if (import.meta.env.DEV) {
//   const { connectFirestoreEmulator } = await import('firebase/firestore/lite');
//   connectFirestoreEmulator(db, '127.0.0.1', 8080);
//   console.log('Connected to Firestore emulator');
// }

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

/**
 * Public API function to get a post by its slug
 *
 * @param {string} slug - The slug of the post to retrieve
 * @returns {Object|null} Formatted post object or null if not found/error
 */
export const getPostBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const post = await findPostBySlug(slug);
    if (post != null) {
      const data = post.data();
      return {
        id: post.id,
        ...data,
        date: data?.date ? formatDate(data.date.toDate()) : 'No date'
      };
    }
    return null;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
};

/**
 * Validate tags array according to the requirements
 * - Max 5 tags per post
 * - Each tag max 20 characters
 * - Alphanumeric + hyphens/underscores only
 * - No duplicates
 * - Convert to lowercase
 * 
 * @param {Array<string>} tags - Array of tag strings
 * @returns {Array<string>} Validated and cleaned tags array
 * @throws {Error} If validation fails
 */
export const validateTags = (tags) => {
  if (!Array.isArray(tags)) {
    throw new Error('Tags must be an array');
  }
  
  if (tags.length > 5) {
    throw new Error('Maximum 5 tags allowed per post');
  }
  
  const cleanedTags = [];
  const seenTags = new Set();
  
  for (const tag of tags) {
    if (typeof tag !== 'string') {
      throw new Error('All tags must be strings');
    }
    
    const trimmedTag = tag.trim();
    if (trimmedTag.length === 0) continue; // Skip empty tags
    
    if (trimmedTag.length > 20) {
      throw new Error(`Tag "${trimmedTag}" exceeds 20 characters`);
    }
    
    // Check for valid characters: alphanumeric, hyphens, underscores
    const validTagRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validTagRegex.test(trimmedTag)) {
      throw new Error(`Tag "${trimmedTag}" contains invalid characters. Only alphanumeric, hyphens, and underscores are allowed`);
    }
    
    const lowerTag = trimmedTag.toLowerCase();
    
    // Step 1: Check for duplicates BEFORE adding
    if (seenTags.has(lowerTag)) {
      throw new Error(`Duplicate tag: "${trimmedTag}"`);
    }
    
    // Step 2: Add to seenTags (for future duplicate checks) AND to cleanedTags (for output)
    seenTags.add(lowerTag);
    cleanedTags.push(lowerTag);
  }
  
  return cleanedTags;
};

/**
 * Get all blog posts from Firestore
 * @returns {Promise<Array>} Formatted array of blog posts with IDs and formatted dates
 */
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
const findPostByField = async (field, value) => {
  if (!field || typeof field !== 'string' || !value) return null;

  return withRetry(async () => {
    const normalized = value.toLowerCase().trim();
    const postsRef = collection(db, 'posts');
    const postsQuery = query(postsRef, where(field, '==', normalized));
    const snapshot = await getDocs(postsQuery);
    if (snapshot.empty) return null;

    return snapshot.docs.find(Boolean) || null;
  });
};

const findPostByTitle = async (title) => findPostByField('title', title);

/**
 * Internal helper function to find a post by its slug (case-insensitive)
 *
 * @param {string} slug - The slug to search for
 * @returns {Object|null} Raw Firestore document reference or null if not found
 */
const findPostBySlug = async (slug) => findPostByField('slug', slug);
/**
 * Public API function to get a post by its title
 * 
 * This function uses findPostByTitle() internally but adds:
 * 1. Error handling for component safety
 * 2. Data formatting (especially for dates)
 * 3. A clean interface for components to consume
 * 
 * Used primarily for public-facing blog pages where posts are accessed by title
 * but the slug is also available to maintain backwards compatibility.
 *
 * @param {string} title - The title of the post to retrieve
 * @returns {Object|null} Formatted post object or null if not found/error
 */
export const getPost = async (title) => {
  if (!title) return null;

  try {
    const post = await findPostByTitle(title);
    if (post != null) {
      const data = post.data();
      return {
        id: post.id,
        ...data,
        date: data?.date ? formatDate(data.date.toDate()) : 'No date'
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
  // Dynamically import write operations from Firestore lite SDK
  const { addDoc, serverTimestamp } = await import('firebase/firestore/lite');
  const { titleToSlug } = await import('../utils/helpers');
  const { notifyGoogle } = await import('../utils/googleIndexing');

  if (!auth.currentUser) throw new Error('Not authenticated');
  const existing = await findPostByTitle(postData.title);
  if (existing) throw new Error('A post with this title already exists!');
  
  // Validate and clean tags
  // empty array is for a post that is not having any tags
  const validatedTags = validateTags(postData.tags || []);
  
  // Create the post document
  const newPost = {
    ...postData,
    tags: validatedTags, // Include validated tags
    date: postData.date instanceof Date ? postData.date : new Date(postData.date),
    createdAt: serverTimestamp(),
    slug: titleToSlug(postData.title)
  };
  
  const docRef = await addDoc(collection(db, 'posts'), newPost);
  
  // Notify Google about the new post
  try {
    // Get the current hostname dynamically
    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/blog/${titleToSlug(postData.title)}`;
    await notifyGoogle(postUrl, 'URL_UPDATED');
    console.log(`Notified Google about new post: ${postUrl}`);
  } catch (error) {
    console.error('Failed to notify Google about new post:', error);
    // Don't throw here - post was still created successfully
  }
  
  return { id: docRef.id, ...newPost };
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
  const { titleToSlug } = await import('../utils/helpers');
  const { notifyGoogle } = await import('../utils/googleIndexing');
  
  if (!auth.currentUser) throw new Error('Not authenticated');
  const post = await findPostByTitle(title);
  if (!post) throw new Error('Post not found');
  
  // Get the slug before deleting the post
  const slug = titleToSlug(title);
  
  // Delete the post
  const postRef = doc(db, 'posts', post.id);
  await deleteDoc(postRef);
  
  // Notify Google about the deleted post
  try {
    const postUrl = `${window.location.origin}/blog/${slug}`;
    await notifyGoogle(postUrl, 'URL_DELETED');
    console.log(`Notified Google about deleted post: ${postUrl}`);
  } catch (error) {
    console.error('Failed to notify Google about deleted post:', error);
    // Don't throw here - post was still deleted successfully
  }
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
 * Get all unique tags from existing blog posts for auto-suggestions
 * 
 * This function collects all tags from all posts and returns a unique,
 * sorted array of tag strings for use in the tag input component.
 * 
 * @returns {Promise<Array<string>>} Sorted array of unique tag strings
 */
export const getAllTags = async () => {
  return withRetry(async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const tagSet = new Set();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => {
          if (typeof tag === 'string') {
            tagSet.add(tag.toLowerCase().trim());
          }
        });
      }
    });
    
    return Array.from(tagSet).sort();
  });
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
  const { updateDoc, serverTimestamp } = await import('firebase/firestore/lite');
  const { titleToSlug } = await import('../utils/helpers');
  const { notifyGoogle } = await import('../utils/googleIndexing');
  
  if (!auth.currentUser) throw new Error('Not authenticated');
  if (!postId) throw new Error('Post ID is required');

  // Check if another post with the same title exists (but not the current post)
  const existing = await findPostByTitle(postData.title);
  if (existing && existing.id !== postId) {
    throw new Error('Another post with this title already exists!');
  }

  // Validate and clean tags
  // empty array is for a post that is not having any tags
  const validatedTags = validateTags(postData.tags || []);

  // Update the post with new data and timestamp
  const postRef = doc(db, 'posts', postId);
  
  // Handle date conversion properly (Firestore Timestamp to Date)
  let dateToUse = postData.date;
  if (postData.date && typeof postData.date.toDate === 'function') {
    // It's a Firestore Timestamp, convert to Date
    dateToUse = postData.date.toDate();
  } else if (postData.date instanceof Date) {
    // It's already a Date
    dateToUse = postData.date;
  } else {
    // Try to convert from string/other format
    dateToUse = new Date(postData.date);
  }
  
  const updatedData = {
    ...postData,
    tags: validatedTags, // Include validated tags
    date: dateToUse,
    updatedAt: serverTimestamp(),
    slug: titleToSlug(postData.title)
  };
  
  await updateDoc(postRef, updatedData);
  
  // Notify Google about the updated post
  try {
    const postUrl = `${window.location.origin}/blog/${titleToSlug(postData.title)}`;
    await notifyGoogle(postUrl, 'URL_UPDATED');
    console.log(`Notified Google about updated post: ${postUrl}`);
  } catch (error) {
    console.error('Failed to notify Google about updated post:', error);
    // Don't throw here - post was still updated successfully
  }
  
  return { id: postId, ...updatedData };
};

