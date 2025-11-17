<template>
  <RouterLink
    :to="to"
    class="door-nav-link"
    :class="computedClasses"
  >
    <slot />
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'default', // 'default' | 'blog' | 'cta' | 'top'
  },
});

const computedClasses = computed(() => ({
  'door-nav-link--active': props.active,
  'door-nav-link--blog': props.variant === 'blog',
  'door-nav-link--blog-active': props.variant === 'blog' && props.active,
  'door-nav-link--cta': props.variant === 'cta',
  'door-nav-link--top': props.variant === 'top',
  'door-nav-link--top-active': props.variant === 'top' && props.active,
}));
</script>

<style scoped>
.door-nav-link {
  position: relative;
  border-radius: 0.95rem;
  overflow: visible; /* Allow 3D door to extend beyond bounds */
  transition:
    color 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.door-nav-link::after {
  content: "";
  position: absolute;
  inset: 0.25rem 0.35rem;
  border-radius: 0.9rem;
  opacity: 0;
  background: linear-gradient(90deg, rgba(250, 250, 255, 0.35), rgba(191, 219, 254, 0.18), rgba(129, 140, 248, 0));
  border: none;
  /* CONSISTENT door effect: always open from left */
  transform-origin: left center;
  transform: scaleX(0) translateX(-30%);
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.door-nav-link::before {
  content: "";
  position: absolute;
  left: 0.4rem;
  top: 18%;
  width: 0.22rem;
  height: 64%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(129, 140, 248, 0.7), rgba(79, 70, 229, 0.96));
  opacity: 0.4;
  box-shadow: 0 0 0.25rem rgba(129, 140, 248, 0.65);
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.door-nav-link--active,
.door-nav-link--blog-active,
.door-nav-link--top-active {
  color: #ffffff;
  transform: translateY(-1px);
  background: radial-gradient(circle at left, rgba(239, 246, 255, 0.24), transparent 70%);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.3);
}

.door-nav-link--active::after,
.door-nav-link--blog-active::after,
.door-nav-link--top-active::after {
  opacity: 1;
  /* Same door opening angle for all variants */
  animation: nav-door-beam 0.7s ease-out forwards;
}

.door-nav-link--active::before,
.door-nav-link--blog-active::before,
.door-nav-link--top-active::before {
  opacity: 1;
  box-shadow: 0 0 0.4rem rgba(129, 140, 248, 0.95);
  transform: translateX(1px);
}

.door-nav-link--blog {
  color: #ccfbf1;
}

.door-nav-link--blog::after {
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.25), rgba(59, 130, 246, 0.2));
  border-color: rgba(20, 184, 166, 0.4);
}

.door-nav-link--blog-active {
  color: #d1fae5;
}

.dark .door-nav-link {
  color: #c7d2fe;
}

.dark .door-nav-link::after {
  background: linear-gradient(90deg, rgba(191, 219, 254, 0.6), rgba(129, 140, 248, 0.85), rgba(30, 64, 175, 0.2));
}

.dark .door-nav-link--blog::after {
  background: linear-gradient(90deg, rgba(45, 212, 191, 0.7), rgba(56, 189, 248, 0.75), rgba(34, 197, 94, 0.3));
}

.dark .door-nav-link--active,
.dark .door-nav-link--top-active {
  color: #f9fafb;
  background: radial-gradient(circle at left, rgba(30, 64, 175, 0.95), rgba(15, 23, 42, 0.6) 55%, transparent 75%);
  box-shadow:
    0 0 0.7rem rgba(129, 140, 248, 0.95),
    0 18px 36px rgba(15, 23, 42, 0.8);
}

.dark .door-nav-link--active::before,
.dark .door-nav-link--top-active::before {
  opacity: 1;
  box-shadow: 0 0 0.9rem rgba(129, 140, 248, 1);
  transform: translateX(1px) scaleY(1.04);
}

.dark .door-nav-link--active::after,
.dark .door-nav-link--top-active::after {
  opacity: 1;
}

.dark .door-nav-link--blog-active {
  color: #ecfdf5;
  background: radial-gradient(circle at left, rgba(34, 197, 94, 0.9), rgba(15, 23, 42, 0.6) 55%, transparent 75%);
  box-shadow:
    0 0 0.65rem rgba(45, 212, 191, 0.95),
    0 18px 36px rgba(15, 23, 42, 0.8);
}

.dark .door-nav-link--blog-active::before {
  opacity: 1;
  background: linear-gradient(180deg, rgba(45, 212, 191, 0.9), rgba(34, 197, 94, 0.98));
  box-shadow: 0 0 0.9rem rgba(45, 212, 191, 1);
  transform: translateX(1px) scaleY(1.04);
}

@keyframes nav-door-beam {
  0% {
    opacity: 0;
    transform: scaleX(0) translateX(-30%);
  }
  40% {
    opacity: 0.9;
    transform: scaleX(0.9) translateX(0);
  }
  100% {
    opacity: 0;
    transform: scaleX(1.1) translateX(5%);
  }
}
</style>
