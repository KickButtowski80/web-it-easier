import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * SECURITY NOTICE:
 * This authentication system is designed for basic blog administration.
 * It provides reasonable protection against casual unauthorized access,
 * but should not be considered suitable for protecting highly sensitive information.
 * 
 * Security limitations:
 * - Environment variables in browser apps can be exposed
 * - LocalStorage is vulnerable to XSS attacks
 * - This is not a replacement for proper OAuth or Firebase Authentication
 * 
 * For production systems with sensitive data, consider:
 * - Using Firebase Authentication with proper user management
 * - Implementing server-side authentication
 * - Consulting with a security professional
 */

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

// Generate a secure hash with salt using native Web Crypto API
export const generateSecureHash = async (password) => {
  try {
    // Create a salt from the current date (changes daily)
    const salt = new Date().toISOString().split('T')[0];
    
    // Convert string to buffer for crypto operations
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    // Use SHA-256 algorithm
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert buffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Crypto operation failed:', error);
    // Instead of falling back to an insecure method, throw an error
    throw new Error('Secure hashing is not available in this environment');
  }
};

export const addPost = async (postData) => {
  // Remove sensitive data before storing
  const { adminHash, ...safeData } = postData;
  
  // Add the post with the hash for security validation
  return await addDoc(collection(db, 'posts'), {
    ...safeData,
    adminHash: adminHash // Keep the hash for Firestore rules
  });
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  // Check if authenticated
  if (localStorage.getItem('isAuthenticated') !== 'true') {
    return false;
  }
  
  // Check if token exists
  const authToken = localStorage.getItem('authToken');
  const authTokenHash = localStorage.getItem('authTokenHash');
  const authNonce = localStorage.getItem('authNonce');
  
  if (!authToken || !authTokenHash || !authNonce) {
    return false;
  }
  
  // Verify token hash
  try {
    const currentTokenHash = await generateSecureHash(authToken);
    if (currentTokenHash !== authTokenHash) {
      console.error("Auth Error: Token hash mismatch");
      return false;
    }
  } catch (error) {
    console.error("Auth Error: Failed to verify token hash", error);
    return false; // Fail closed if hash check errors
  }
  
  // Check if token exists in sessionStorage (double-check)
  if (sessionStorage.getItem('authToken') !== authToken) {
    return false;
  }
  
  // Check expiration
  const expiresAt = new Date(localStorage.getItem('authExpires'));
  if (new Date() > expiresAt) {
    return false;
  }
  
  return true;
};

// Check login attempts and manage rate limiting
export const checkLoginAttempts = async (ipAddress) => {
  try {
    // Use a sanitized IP address as the document ID
    // This prevents invalid characters in document IDs
    const sanitizedIp = ipAddress.replace(/[.:/]/g, '_');
    const attemptsRef = doc(db, 'loginAttempts', sanitizedIp);
    const attemptsDoc = await getDoc(attemptsRef);
    
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes
    
    if (attemptsDoc.exists()) {
      const data = attemptsDoc.data();
      
      // Check if account is locked
      if (data.lockedUntil && data.lockedUntil.toMillis() > Date.now()) {
        const timeLeft = Math.ceil((data.lockedUntil.toMillis() - Date.now()) / (60 * 1000));
        return {
          allowed: false,
          message: `Too many failed attempts. Please try again in ${timeLeft} minutes.`,
          attemptsLeft: 0
        };
      }
      
      // If not locked but has attempts
      return {
        allowed: true,
        attemptsLeft: MAX_ATTEMPTS - data.count,
        docRef: attemptsRef,
        data
      };
    } else {
      // First attempt from this IP
      await setDoc(attemptsRef, {
        count: 0,
        firstAttempt: serverTimestamp(),
        lastAttempt: serverTimestamp()
      });
      
      return {
        allowed: true,
        attemptsLeft: MAX_ATTEMPTS,
        docRef: attemptsRef,
        data: { count: 0 }
      };
    }
  } catch (error) {
    console.error('Error checking login attempts:', error);
    // Fail open - allow login if we can't check attempts
    return { allowed: true, attemptsLeft: 1 };
  }
};

export const recordLoginAttempt = async (ipAddress, success) => {
  try {
    const sanitizedIp = ipAddress.replace(/[.:/]/g, '_');
    const attemptsRef = doc(db, 'loginAttempts', sanitizedIp);
    
    if (success) {
      // Reset attempts on successful login
      await setDoc(attemptsRef, {
        count: 0,
        lastAttempt: serverTimestamp(),
        lastSuccess: serverTimestamp()
      });
    } else {
      // Get current attempts
      const result = await checkLoginAttempts(ipAddress);
      
      if (!result.allowed) {
        return; // Already locked
      }
      
      const MAX_ATTEMPTS = 5;
      const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes
      
      // Increment attempts
      const newCount = (result.data?.count || 0) + 1;
      
      // Update document
      const updateData = {
        count: newCount,
        lastAttempt: serverTimestamp()
      };
      
      // Add lockout if max attempts reached
      if (newCount >= MAX_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_TIME);
        updateData.lockedUntil = lockedUntil;
      }
      
      await updateDoc(attemptsRef, updateData);
    }
  } catch (error) {
    console.error('Error recording login attempt:', error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}