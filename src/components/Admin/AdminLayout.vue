<template>
  <header class="admin-header">
    <div class="admin-logo">
      <h1>Admin Dashboard</h1>
    </div>
    
    <nav v-if="isAuthenticated" class="admin-nav">
      <router-link 
        to="/admin/new-post" 
        class="nav-link"
        :class="{ active: $route.path === '/admin/new-post' }"
      >
        New Post
      </router-link>
      <!-- <router-link 
        to="/admin/posts" 
        class="nav-link"
        :class="{ active: $route.path === '/admin/posts' }"
      >
        Manage Posts
      </router-link> -->
      <button 
        @click="logout" 
        class="logout-btn"
        type="button"
        aria-label="Log out from admin panel"
      >
        Log out
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

const router = useRouter();

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return auth.currentUser !== null;
});

// Logout function
const logout = async () => {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 6rem;
  left: 0;
  right: 0;
  z-index: 1000;
}

.admin-logo h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.admin-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover, .nav-link.active {
  color: #3182ce;
  border-bottom-color: #3182ce;
}

.logout-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #c53030;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .admin-nav {
    margin-top: 1rem;
    width: 100%;
    justify-content: center;
  }
}
</style>
