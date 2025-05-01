<template>
  <a
    href="#main-content"
    class="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:bg-white focus-visible:text-blue-500 focus-visible:py-2 focus-visible:px-4 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50 focus-visible:z-[9999]"
  >
    Skip to main content
  </a>
  <Menu />
  <GoBackTop />
  <Notification
    v-model="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
  />
  <main
    class="md:overflow-visible pb-[50px] md:pb-0"
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

  <!-- Tap areas for secret sequence (mobile only) -->
  <div class="secret-tap-areas" v-if="isMobile && !isLoginPage">
    <button class="tap-area top-left" @click="handleTap(1)">1</button>
    <button class="tap-area top-right" @click="handleTap(2)">2</button>
    <button class="tap-area bottom-left" @click="handleTap(3)">3</button>
    <button class="tap-area bottom-right" @click="handleTap(4)">4</button>
  </div>
</template>
<script setup>
import Menu from "./components/Menu.vue";
import Notification from "./components/UI/Notification.vue";
import GoBackTop from "./components/GoBackTop.vue";
import { ref, computed } from "vue";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/config/firebase";
const router = useRouter();
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("info");

// For secret tap sequence
const tapSequence = ref([]);
const correctSequence = [1, 2, 3, 4]; // 1=top-left, 2=top-right, 3=bottom-left, 4=bottom-right
const sequenceTimeout = ref(null);

// Handle key press for desktop
const handleKeyPress = async (e) => {
  console.log(auth.currentUser);
  const isAdmin = auth.currentUser?.email === "pazpaz22@yahoo.com";
  const isLoginKey = e.key === "l" || e.key === "L" || e.code === "KeyL";
  const isAlt = e.altKey;
  const isShift = e.shiftKey;
  if (isAdmin) {
    notificationMessage.value = "You are already logged in";
    notificationType.value = "warning";
    showNotification.value = true;
    return;
  }
  if (!isAdmin && isLoginKey && isAlt && isShift) {
    e.preventDefault();
    navigateToLogin();
  }
};
// Add this at the top of your script section
const isLoginPage = computed(() => {
  return router.currentRoute.value.path === '/login';
});



// Handle tap for mobile secret sequence
const handleTap = (quadrant) => {
  console.log(quadrant);
  console.log(`Tap detected in quadrant ${quadrant}`);

  // Clear timeout if it exists
  if (sequenceTimeout.value) {
    clearTimeout(sequenceTimeout.value);
  }

  // Add the tapped quadrant to the sequence
  tapSequence.value.push(quadrant);
  console.log("Current sequence:", tapSequence.value);

  // Check if sequence matches
  if (tapSequence.value.length === correctSequence.length) {
    const isMatch = tapSequence.value.every(
      (tap, index) => tap === correctSequence[index]
    );
    console.log("Sequence complete, match:", isMatch);

    if (isMatch) {
      console.log("SUCCESS! Navigating to login page");
      navigateToLogin();
    } else {
      console.log("Incorrect sequence");
    }

    // Reset sequence
    tapSequence.value = [];
  } else {
    // Set timeout to reset sequence after 2 seconds of inactivity
    sequenceTimeout.value = setTimeout(() => {
      console.log("Sequence timeout - resetting");
      tapSequence.value = [];
    }, 2000);
  }
};

// Common navigation function
const navigateToLogin = async () => {
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
};

// Check if device is mobile
const isMobile = ref(false);
let resizeObserver = null;

onMounted(() => {
  // Add keyboard event listener
  window.addEventListener("keydown", handleKeyPress);

  // Initial mobile check
  checkMobile();

  // Set up ResizeObserver for more efficient size monitoring
  resizeObserver = new ResizeObserver((entries) => {
    // We're observing the document body
    checkMobile();
  });

  // Start observing the document body
  resizeObserver.observe(document.body);

  console.log("App mounted, mobile detection active with ResizeObserver");
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener("keydown", handleKeyPress);

  // Disconnect ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// Function to check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 720;
  console.log(
    "Mobile detection:",
    isMobile.value ? "MOBILE" : "DESKTOP",
    "Width:",
    window.innerWidth
  );
};
</script>

<style scoped>
/* Secret tap areas for mobile */
.secret-tap-areas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none; /* Allow clicks to pass through by default */
}

.tap-area {
  position: absolute;
  width: 60px;
  height: 60px;
  pointer-events: auto; /* Enable clicks on these areas */
  opacity: 0.5; /* More visible for testing */
  background-color: transparent; /* Red background for testing */
  border: 2px solid white;
  color: white;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.top-left {
  top: 3rem;
  left: 0;
}

.top-right {
  top: 3rem;
  right: 0;
}

.bottom-left {
  bottom: 3.5rem;
  left: 0;
}

.bottom-right {
  bottom: 3.5rem;
  right: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
