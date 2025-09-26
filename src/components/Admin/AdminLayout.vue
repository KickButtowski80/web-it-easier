<template>
  <div class="admin-container">
    <header class="admin-header" role="banner" aria-label="Admin header">
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
        class="admin-nav gap-[0.25rem] mr-1 md:gap-2"
        role="navigation"
        aria-label="Admin navigation"
      >
        <router-link
          :to="newPostLinkTo"
          class="nav-link"
          :class="{ active: isNewPostActive }"
          role="link"
          :aria-current="isNewPostActive ? 'page' : 'false'"
        >
          {{ newPostLinkText }}
        </router-link>
        <router-link
          :to="managePostsLinkTo"
          class="nav-link"
          :class="{ active: isManagePostsRoute }"
          role="link"
          :aria-current="isManagePostsRoute ? 'page' : 'false'"
        >
          <span v-if="showBackArrow" class="mr-1">←</span> {{ managePostsLinkText }}
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
import { useRouter, useRoute } from "vue-router";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import Notification from "../UI/Notification.vue";
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("info");
const router = useRouter();  // For navigation :performing navigation actions
const route = useRoute();    // For reading current route info

// Computed properties for dynamic navigation
const isEditRoute = computed(() => route.path.includes("/admin/edit-post/"));
const isNewPostRoute = computed(() => route.path === "/admin/new-post");
const isManagePostsRoute = computed(() => route.path === "/admin/manage-posts");

const newPostLinkText = computed(() =>
  isEditRoute.value ? "Edit Post" : "New Post"
);

const newPostLinkTo = computed(() =>
  isEditRoute.value ? route.path : "/admin/new-post"
);

// Always show "Manage Posts" but with a back arrow when in edit mode
const managePostsLinkText = "Manage Posts";
const managePostsLinkTo = "/admin/manage-posts";
const showBackArrow = computed(() => isEditRoute.value);

const isNewPostActive = computed(() =>
  isNewPostRoute.value || isEditRoute.value
);

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
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  margin: 0;
}

.admin-nav {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #cbd5e0; /* Light gray for contrast */
  text-decoration: none;
  padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem);
  border-radius: 0.25rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #4a5568; /* Darker gray for hover */
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem);
  border: none;
  border-radius: 0.25rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  cursor: pointer;
  
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c82333; /* Darker red for hover */
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
    flex-direction: row;
    align-items: center;
    padding: 0.75rem;
    flex-wrap: wrap;
  }
  
  .admin-logo h1 {
    margin-right: 0.5rem;
  }
  
  .admin-nav {
    display: flex;
    gap: 0.25rem;
    margin-top: 0.75rem;
  }
}
</style>
