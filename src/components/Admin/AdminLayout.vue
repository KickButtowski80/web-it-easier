<template>
  <div class="admin-container">
    <header class="admin-header" role="banner">
      <div class="admin-logo">
        <h1>Admin Dashboard</h1>
      </div>
      <Notification
        v-model="showNotification"
        :message="notificationMessage"
        :type="notificationType"
        :duration="3000"
      />
      <nav
        v-if="isAuthenticated"
        class="admin-nav gap-0 md:gap-2"
        role="navigation"
        aria-label="Admin navigation"
      >
        <router-link
          to="/admin/new-post"
          class="nav-link"
          :class="{ active: $route.path === '/admin/new-post' || $route.path.includes('/admin/edit-post/') }"
          role="link"
          :aria-current="$route.path === '/admin/new-post' || $route.path.includes('/admin/edit-post/') ? 'page' : 'false'"
        >
          New Post
        </router-link>
        <router-link
          to="/admin/manage-posts"
          class="nav-link"
          :class="{ active: $route.path === '/admin/manage-posts' }"
          role="link"
          :aria-current="$route.path === '/admin/manage-posts' ? 'page' : 'false'"
        >
          Manage Posts
        </router-link>
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

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import Notification from "../UI/Notification.vue";
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("info");
const router = useRouter();

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return auth.currentUser !== null;
});

// Logout function
const logout = async () => {
  try {
    await signOut(auth);
    showNotification.value = true;
    notificationMessage.value = "You have been logged out";
    notificationType.value = "success";
    router.push("/");
  } catch (error) {
    console.error("Logout failed:" + (error.message || "Unknown error"));
    showNotification.value = true;
    notificationMessage.value = "Logout failed";
    notificationType.value = "error";
  }
};
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.75rem;
  background-color: #2d3748; /* Dark background for contrast */
  color: #ffffff; /* White text for contrast */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 6rem;
  left: 0;
  right: 0;
  z-index: 10;
}

.admin-logo h1 {
  font-size: 1.5rem;
  margin: 0;
}

.admin-nav {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #cbd5e0; /* Light gray for contrast */
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #4a5568; /* Darker gray for hover */
  color: #ffffff;
}

.nav-link:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
  background-color: #4a5568;
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(74, 85, 104, 0.5);
  text-decoration: underline;
}

.nav-link.active {
  background-color: #4c1d95; /* Purple for active state */
  color: #ffffff;
}

.logout-btn {
  background-color: #dc3545; /* Red for logout */
  color: #ffffff;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c82333; /* Darker red for hover */
}

.logout-btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
  background-color: #c82333; /* Darker red for focus */
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.5);
}



/* Transition for router-view */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

}
</style>
