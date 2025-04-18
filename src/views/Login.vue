<template>
  <div class="login-container">
    <h1>Admin Login</h1>
    <form @submit.prevent="login" class="login-form">
      <input
        v-model="email"
        type="email"
        placeholder="Enter admin email"
        autocomplete="username"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Enter admin password"
        autocomplete="current-password"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, signInWithEmailAndPassword } from '@/config/firebase'

const email = ref('')
const password = ref('')
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  document.title = "Login Page - Admin"
})

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    if (!email.value || !password.value) {
      errorMessage.value = 'Email and password are required'
      return
    }
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/admin/new-post')
  } catch (err) {
    errorMessage.value = err.message
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