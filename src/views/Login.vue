<template>
    <div class="login-container">
        <h1>Admin Login</h1>
        <form @submit.prevent="login">
            <input v-model="password" type="password" 
            placeholder="Enter admin password"
            autocomplete="new-password">
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  console.log("Login component mounted!")
  document.title = "Login Page - Admin"
})

const password = ref('')
const router = useRouter()

const login = () => {
  console.log("Login attempt with:", password.value)
  console.log("Expected password:", import.meta.env.VITE_ADMIN_PASSWORD)
  
  if (password.value === import.meta.env.VITE_ADMIN_PASSWORD) {
    console.log("Login successful")
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('password', password.value)
    router.push('/admin/new-post')
  } else {
    console.log("Login failed")
    alert('Invalid password')
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
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #2d3748;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #e142b7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3182ce;
}
</style>