<template>
  <transition name="fade">
  <div v-if="show" :class="['notification', type]">
    <img v-if="logo" :src="logo" alt="Logo" class="notification-logo" />
    <div class="notification-content">
      <slot>{{ message }}</slot>
    </div>
    <button class="notification-close" @click="close">&times;</button>
  </div>
</transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const show = defineModel({ type: Boolean, default: false }) // replaces modelValue
const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info', // 'info', 'success', 'error', 'warning'
  },
  logo: {
    type: String,
    default: '/open-door-icon.svg',
  },
  duration: {
    type: Number,
    default: 3500 // ms
  }
})

function close() {
  show.value = false
}

onMounted(() => {
  if (show.value && props.duration > 0) {
    setTimeout(close, props.duration)
  }
})

watch(show, (val) => {
  if (val && props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
.notification {
  display: flex;
  align-items: center;
  background: #f7fafc;
  color: #2d3748;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 1em 1.5em;
  min-width: 260px;
  max-width: 400px;
  margin: 1em auto;
  border-left: 6px solid #4299e1;
  position: relative;
  font-size: 1rem;
  z-index: 9999;
}
.notification-logo {
  width: 32px;
  height: 32px;
  margin-right: 1em;
}
.notification-content {
  flex: 1;
}
.notification-close {
  background: none;
  border: none;
  font-size: 1.5em;
  color: #a0aec0;
  cursor: pointer;
  margin-left: 1em;
  line-height: 1;
  transition: color 0.2s;
}
.notification-close:hover {
  color: #e53e3e;
}
/* Color themes */
.notification.info { border-left-color: #4299e1; background: #f0f6fb; color: #2d3748; }
.notification.success { border-left-color: #38a169; background: #f0fff4; color: #22543d; }
.notification.error { border-left-color: #e53e3e; background: #fff5f5; color: #742a2a; }
.notification.warning { border-left-color: #dd6b20; background: #fffaf0; color: #7b341e; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
