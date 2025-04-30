<template>
  <a
    href="#main-content"
    class="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:bg-white focus-visible:text-blue-500 focus-visible:py-2 focus-visible:px-4 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50 focus-visible:z-[9999]"
  >
    Skip to main content
  </a>
  <Menu />
  <GoBackTop />
  <main
    class="overflow-scroll md:overflow-visible pb-[50px] md:pb-0"
    id="main-content"
    tabindex="-1"
    role="main"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <Notification
    v-model="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
  />
</template>
<script setup>
import Menu from "./components/Menu.vue";
import Notification from "./components/UI/Notification.vue";
import GoBackTop from "./components/GoBackTop.vue";
import { ref } from "vue";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("info");

const handleKeyPress = async (e) => {
  if (
    (e.key === "l" || e.key === "L" || e.code === "KeyL") &&
    e.altKey &&
    e.shiftKey
  ) {
    e.preventDefault();

    try {
      await router.push("/login");
      showNotification.value = true;
      notificationMessage.value = "Navigating to login page";
      notificationType.value = "success";
    } catch (error) {
      showNotification.value = true;
      notificationMessage.value = `Navigation failed: ${error.message}`;
      notificationType.value = "error";
    }
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyPress, { capture: true });
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress, { capture: true });
});
</script>
 


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
