<template>
  <TopMenu />
  <AdminLayout v-if="isAdmin" class="admin-layout-bar" />
  <HamburgerMenu :hideIt="true" />
  <BottomMenu :hideIt="false" />
  
  <!-- Floating Action Button for mobile -->
  <button 
    v-if="!isAdmin" 
    class="mobile-login-btn"
    @click="navigateToLogin"
    aria-label="Go to login page"
  >
    <i class="fas fa-sign-in-alt"></i>
  </button>
</template>
<script setup>
import BottomMenu from "./Menus/BottomMenu.vue";
import HamburgerMenu from "./Menus/HamburgerMenu.vue";
import TopMenu from "./Menus/TopMenu.vue";
// Using defineAsyncComponent for AdminLayout to maintain code-splitting
import { defineAsyncComponent } from 'vue';
????const AdminLayout = defineAsyncComponent(() => import("./Admin/AdminLayout.vue"));
import { ref, onMounted, onUnmounted } from "vue";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';

const router = useRouter();
const isAdmin = ref(false);

// Function to navigate to login
const navigateToLogin = () => {
  router.push('/login');
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    isAdmin.value = user.email === 'pazpaz22@yahoo.com';
  } else {
    isAdmin.value = false;
  }
});

onMounted(() => {
  document.title = "Menu Page";
});

onUnmounted(() => {
  document.title = "Menu Page";
});   

onMounted(() => {
  document.title = "Menu Page - Admin";
});
onUnmounted(() => {
  document.title = "Menu Page";
});
</script>
