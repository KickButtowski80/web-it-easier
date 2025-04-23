<template>
  <main class="login-container">
    <h1 id="login-heading">Admin Login</h1>
    <form @submit.prevent="login" class="login-form" aria-labelledby="login-heading">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter admin email"
          autocomplete="email"
          required
          :aria-invalid="!!emailError"
          @blur="validateEmail"
        />
        <span v-if="emailError" class="field-error" role="alert">{{ emailError }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter admin password"
          autocomplete="current-password"
          required
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        :aria-busy="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <div v-if="errorMessage" class="error-message" role="alert" aria-live="assertive">{{ errorMessage }}</div>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { auth, signInWithEmailAndPassword } from '@/config/firebase'

const email = ref('')
const password = ref('')
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const emailError = ref('')

// Validate email format
const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Email is required'
    return false
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }
  
  emailError.value = ''
  return true
}

onMounted(() => {
  document.title = "Login Page - Admin"
})

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  emailError.value = ''
  
  try {
    // Validate inputs
    if (!email.value || !password.value) {
      errorMessage.value = 'Email and password are required'
      loading.value = false
      return
    }
    
    // Validate email format
    if (!validateEmail()) {
      loading.value = false
      return
    }
    
    // Attempt login
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // Add a success message to confirm login
    errorMessage.value = 'Login successful! Redirecting...';
    console.log('Authentication successful, user:', auth.currentUser?.email);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      console.log('Attempting navigation to /admin/new-post');
      await router.isReady().then(() => {
        router.push('/admin/new-post');
      });
      console.log('Navigation successful');
    } catch (navError) {
      console.error('Navigation error:', navError);
      console.log('Current auth state:', auth.currentUser ? 'Authenticated' : 'Not authenticated');
      console.log('Current route:', router.currentRoute.value.path);
      errorMessage.value = 'Login successful, but failed to navigate. Trying alternative method...';
      
      // Try an alternative navigation approach - use the full URL
      const baseUrl = window.location.origin;
      console.log('Base URL:', baseUrl);
      const targetUrl = `${baseUrl}/admin/new-post`;
      console.log('Attempting direct navigation to:', targetUrl);
      
      // Use a button to let the user try manual navigation
      errorMessage.value = `Login successful! Click <a href="${targetUrl}" class="manual-link">here</a> to go to the admin page.`;
      
      // Also try automatic navigation after a delay
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 2000);
    }
  } catch (err) {
    // Format Firebase error messages to be more user-friendly
    if (err.code === 'auth/invalid-credential') {
      errorMessage.value = 'Invalid email or password. Please try again.'
    } else if (err.code === 'auth/too-many-requests') {
      errorMessage.value = 'Too many failed login attempts. Please try again later.'
    } else {
      errorMessage.value = err.message
    }
    
    // Set focus to the error message for screen readers
    setTimeout(() => {
      const errorEl = document.querySelector('.error-message')
      if (errorEl) errorEl.focus()
    }, 100)
  } finally {
    loading.value = false
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
  margin-bottom: 30px;
  color: #2d3748;
  font-size: 1.8rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
  color: #4a5568;
  font-size: 1rem;
}

input {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus-visible {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
}

input[aria-invalid="true"] {
  border-color: #e53e3e;
}

button {
  padding: 12px;
  background-color: #7c5fbf; /* soft indigo */
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(63, 45, 86, 0.07);
}

button:hover {
  background-color: #a48be7;
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #bca6e9;
}

button:active {
  background-color: #5d4391;
  transform: translateY(1px);
}

button:hover {
  background-color: #5c438c; /* lighter indigo for hover */
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 45, 86, 0.3);
}

button:active {
  background-color: #2a1e38;
  transform: translateY(1px);
}

button:hover {
  background-color: #3182ce;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  color: #e53e3e;
  margin-top: 15px;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #fff5f5;
  border-left: 3px solid #e53e3e;
}

.field-error {
  color: #e53e3e;
  font-size: 0.875rem;
}

/* Ensure the page is accessible at different viewport sizes */
@media (max-width: 480px) {
  .login-container {
    margin: 40px auto;
    padding: 20px;
    width: 90%;
  }
}
</style>