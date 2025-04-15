<template>
    <div class="login-container">
        <h1>Admin Login</h1>
        <form @submit.prevent="login" class="login-form">
            <input v-model="password" type="password" 
            placeholder="Enter admin password"
            autocomplete="new-password">
            <button type="submit" :disabled="loading">
              {{ loading ? 'Checking...' : 'Login' }}
            </button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkLoginAttempts, recordLoginAttempt, generateSecureHash } from '@/config/firebase'

// Get approximate IP address (for demo purposes)
// In production, you'd get this from a server
const getApproximateIpIdentifier = async () => {
  // Get browser information
  const nav = window.navigator;
  const screen = window.screen;
  
  // Get modern browser features
  const modernFeatures = [
    // Hardware information
    screen.width,
    screen.height,
    screen.colorDepth,
    
    // Language and timezone
    nav.language || nav.userLanguage || nav.browserLanguage,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Browser capabilities
    nav.hardwareConcurrency,
    nav.deviceMemory,
    nav.maxTouchPoints,
    
    // User agent data (modern approach)
    ...(nav.userAgentData?.platformVersion || ''),
    ...(nav.userAgentData?.platform || ''),
    
    // Additional browser features
    nav.connection?.effectiveType,
    nav.connection?.rtt,
    nav.connection?.downlink,
    
    // Timezone offset
    new Date().getTimezoneOffset(),
    
    // Canvas fingerprint (basic version)
    (() => {
      // Create canvas and context offscreen
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return ''; // Handle cases where canvas context is not available

      ctx.font = '12px Arial';
      ctx.textBaseline = 'top';
      ctx.fillText('Hello', 2, 2);
      const dataUrl = canvas.toDataURL();
      // console.log('Canvas Fingerprint Data URL:', dataUrl); // Keep for debugging if needed, otherwise remove
      return dataUrl;
    })()
  ];
  
  // Create a string from all features
  const identifier = modernFeatures.join('|');
  
  try {
    // Use Web Crypto API for secure hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(identifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `client_${hashHex.slice(0, 16)}`; // Use first 16 chars of hash for reasonable length
  } catch (error) {
    console.error('Secure client ID generation failed:', error);
    throw new Error('Your browser does not support secure client identification');
  }
};

const password = ref('')
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  console.log("Login component mounted!")
  document.title = "Login Page - Admin"
  
  // Clear any existing authentication data on login page load
  // This helps prevent session fixation attacks
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('authToken')
  localStorage.removeItem('authTokenHash')
  localStorage.removeItem('authExpires')
  localStorage.removeItem('authNonce')
  sessionStorage.removeItem('authToken')
})

const login = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    // Get client identifier
    const clientId = await getApproximateIpIdentifier();
    
    // Check if login is allowed (server-side rate limiting)
    const attemptCheck = await checkLoginAttempts(clientId);
    
    if (!attemptCheck.allowed) {
      errorMessage.value = attemptCheck.message;
      loading.value = false;
      return;
    }
    
    // Check password
    if (password.value === import.meta.env.VITE_ADMIN_PASSWORD) {
      console.log("Login successful");
      
      try {
        // Record successful login
        await recordLoginAttempt(clientId, true);
        
        // Generate a secure session token (timestamp + random string)
        const timestamp = new Date().getTime();
        const randomString = crypto.getRandomValues(new Uint8Array(16))
          .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
        const sessionToken = `${timestamp}.${randomString}`;
        
        // Generate a hash of the token for validation
        const tokenHash = await generateSecureHash(sessionToken);
        
        // Store authentication data (but NOT the password)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', sessionToken);
        localStorage.setItem('authTokenHash', tokenHash);
        localStorage.setItem('authExpires', new Date(timestamp + 24*60*60*1000).toISOString());
        
        // Store a copy in sessionStorage for additional security
        // sessionStorage is cleared when the browser/tab is closed
        sessionStorage.setItem('authToken', sessionToken);
        
        // Store a random nonce for additional validation
        const nonce = crypto.getRandomValues(new Uint8Array(16))
          .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
        localStorage.setItem('authNonce', nonce);
        
        router.push('/admin/new-post');
      } catch (error) {
        console.error("Security operation failed:", error);
        errorMessage.value = "Your browser doesn't support secure authentication. Please use a modern browser.";
        return;
      }
    } else {
      console.log("Login failed");
      
      // Record failed login
      await recordLoginAttempt(clientId, false);
      
      // Show appropriate error message
      if (attemptCheck.attemptsLeft <= 1) {
        errorMessage.value = "Invalid password. This is your last attempt before lockout.";
      } else {
        errorMessage.value = `Invalid password. ${attemptCheck.attemptsLeft - 1} attempts remaining.`;
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = "An error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2d3748;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 12px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3182ce;
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.error-message {
  color: #e53e3e;
  margin-top: 15px;
  text-align: center;
}
</style>