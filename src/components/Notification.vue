<template>
  <div class="fixed top-4 right-4 flex flex-col gap-2 z-50">
    <transition-group name="fade" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['p-4 rounded-md shadow-md max-w-xs', getBgColor(notification.type)]"
        @click="removeNotification(notification.id)"
      >
        <p class="text-white text-sm">{{ notification.message }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const notifications = ref([])

const getBgColor = (type) => {
  switch (type) {
    case 'error': return 'bg-red-500'
    case 'success': return 'bg-green-500'
    default: return 'bg-blue-500'
  }
}

const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const handleNotificationEvent = (event) => {
  notifications.value.push(event.detail)
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    removeNotification(event.detail.id)
  }, 3000)
}

onMounted(() => {
  document.addEventListener('show-notification', handleNotificationEvent)
})

onUnmounted(() => {
  document.removeEventListener('show-notification', handleNotificationEvent)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
