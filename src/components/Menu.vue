<template>
  <TopMenu />
  <AdminLayout v-if="isAdmin" class="admin-layout-bar" />
  <HamburgerMenu :hideIt="true" />
  <BottomMenu :hideIt="false" />
</template>
<script setup>
import BottomMenu from "./Menus/BottomMenu.vue";
import HamburgerMenu from "./Menus/HamburgerMenu.vue";
import TopMenu from "./Menus/TopMenu.vue";
// Using defineAsyncComponent for AdminLayout to maintain code-splitting
import { defineAsyncComponent } from 'vue';
const AdminLayout = defineAsyncComponent(() => import("./Admin/AdminLayout.vue"));
import { ref, onUnmounted, watch } from "vue";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const isAdmin = ref(false);

onAuthStateChanged(auth, (user) => {
  if (user) {
    isAdmin.value = user.email === 'pazpaz22@yahoo.com';
  } else {
    isAdmin.value = false;
  }
});

const defaultTitle = "Menu Page";

watch(isAdmin, (value) => {
  document.title = value ? "Menu Page - Admin" : defaultTitle;
}, { immediate: true });

onUnmounted(() => {
  document.title = defaultTitle;
});
</script>
