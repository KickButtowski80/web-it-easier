<template>
  <section class="login-bg">
  <div class="login-container animate-fade-in">
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

      <div class="flex items-center gap-2">
        <label for="rememberMe" class="flex items-center">
          <span>Remember Me</span>
          <input
            type="checkbox"
            v-model="rememberMe"
            id="rememberMe"
            class="w-6 h-6 scale-150 flex-1 ml-2"
          />
        </label>    
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
      </div>
</section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence, setPersistence } from '@/config/firebase'

const email = ref('')
const password = ref('')
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const rememberMe = ref(false)

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
  document.title = "Login Page - Admin";
  const storedEmail = localStorage.getItem('adminEmail');
  if (storedEmail) {
    email.value = storedEmail;
    rememberMe.value = true;
  }
})
watch(rememberMe, (newValue) => {
  if (newValue) {
    localStorage.setItem('adminEmail', email.value);
  } else {
    localStorage.removeItem('adminEmail');
  }
});
const login = async () => {
  loading.value = true
  errorMessage.value = ''
  emailError.value = ''
  const persistence = rememberMe.value ? browserLocalPersistence : browserSessionPersistence;
  try {
    // Validate inputs
    if (!email.value || !password.value) {
      errorMessage.value = 'Email and password are required'
      return // No need to set loading false here, finally block handles it
    }
    
    // Validate email format
    if (!validateEmail()) {
      return // No need to set loading false here, finally block handles it
    }
    await setPersistence(auth, persistence);
    // Attempt login
    await signInWithEmailAndPassword(auth, email.value, password.value)
    
    // Navigate using router.push - the guard will handle auth check
    const targetRoute = '/admin/manage-posts';
    
    await router.isReady(); // Ensure router is ready
    await router.push(targetRoute);
    
    
  } catch (err) {
    // Handle specific errors
    if (err.code === 'auth/invalid-credential') {
      errorMessage.value = 'Invalid email or password. Please try again.'
    } else if (err.message.includes('domain') || err.message.includes('unauthorized')) {
       errorMessage.value = 'Authentication failed. Domain might not be authorized.' // Simplified message
    } else {
      errorMessage.value = 'An error occurred during login. Please try again.'
    }
    
    // Focus handling can remain if needed
    setTimeout(() => {
      const errorEl = document.querySelector('.error-message')
      if (errorEl) errorEl.focus()
    }, 100);
  } finally {
    loading.value = false
  }
}


</script>

<style scoped>
.login-container {
  position: relative;
  top: 4rem;
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 32px 0 rgba(44, 19, 56, 0.18), 0 2px 8px rgba(63, 45, 86, 0.12);
  backdrop-filter: blur(2px);
  border: 1.5px solid rgba(124, 95, 191, 0.18);
  animation: glowBox 2.5s ease-in-out infinite alternate;

  background-color: white;
}

@keyframes glowBox {
  0% { box-shadow: 0 8px 32px 0 rgba(117, 94, 169, 0.12), 0 2px 8px rgba(63, 45, 86, 0.12); }
  100% { box-shadow: 0 8px 32px 0 rgba(124,95,191,0.28), 0 2px 8px rgba(63, 45, 86, 0.18); }
}

.animate-fade-in {
  animation: fadeIn 1s ease 0.1s both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
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
  outline: 2px solid #4299e1;
  outline-offset: 1px;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
}

input[aria-invalid="true"] {
  border-color: #e53e3e;
}

button {
  background: linear-gradient(90deg, #5d4391 0%, #7c5fbf 100%); /* Darker for better contrast */
  padding: 12px;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600; /* Increased for better contrast */
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
  margin-top: 15px;
  box-shadow: 0 2px 8px rgba(63, 45, 86, 0.15);
  position: relative;
}

button:hover {
  background: linear-gradient(90deg, #4c3577 0%, #6b50a4 100%); /* Even darker for hover */
  box-shadow: 0 4px 12px rgba(63, 45, 86, 0.25);
}

button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(93, 67, 145, 0.5);
  text-decoration: underline;
}

button:active {
  background: #4c3577;
  transform: translateY(1px);
}

button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
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