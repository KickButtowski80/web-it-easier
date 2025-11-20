<template>
  <RouterLink
    :to="to"
    class="door-nav-link"
    :class="computedClasses"
  >
    <span class="door-nav-link__label">
      <slot />
    </span>
    <span class="door-nav-link__knob" aria-hidden="true"></span>
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
  border: 1px solid transparent;
  overflow: visible; /* Allow 3D door to extend beyond bounds */
  transition:
    color 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.door-nav-link__label {
  position: relative;
  z-index: 1; /* keep text above the glass door panel */
}

.door-nav-link__knob {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: radial-gradient(circle,
    rgba(253, 224, 71, 0.95),
    rgba(251, 191, 36, 0.9) 50%,
    rgba(217, 119, 6, 0.85) 100%);
  opacity: 0;
  transform: translateY(-50%) scale(0.6);
  box-shadow: 0 0 0 rgba(253, 224, 71, 0);
  z-index: 2; /* ensure knob is above glass and label */
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.door-nav-link::after {
  content: "";
  position: absolute;
  inset: 0.18rem 0.28rem;
  border-radius: 0.9rem;
  opacity: 0;
  background: linear-gradient(135deg,
    rgba(168, 85, 247, 0.35),   /* soft purple near the hinge */
    rgba(255, 255, 255, 0.16));
  border: none; /* no inner outline, outer border handled by .door-nav-link */
  backdrop-filter: blur(10px);
  /* CONSISTENT door effect: always open from left */
  transform-origin: left center;
  transform: scaleX(0.4) translateX(-20%);
  transition:
    opacity 0.25s ease,
    transform 0.4s ease;
  pointer-events: none;
  z-index: 0;
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
  color: #f5f3ff; /* soft but slightly brighter */
  transform: translateY(-1px);
  background: radial-gradient(circle at left,
    rgba(168, 85, 247, 0.45),   /* color residue on left */
    rgba(196, 181, 253, 0.32) 50%,
    rgba(255, 255, 255, 0.06) 85%);
  box-shadow: 0 14px 30px rgba(76, 29, 149, 0.45);
  border-color: rgba(255, 255, 255, 0.95);
}

.door-nav-link--active .door-nav-link__knob,
.door-nav-link--blog-active .door-nav-link__knob,
.door-nav-link--top-active .door-nav-link__knob,
.door-nav-link--cta.door-nav-link--active .door-nav-link__knob {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  box-shadow: 0 0 0.55rem rgba(253, 224, 71, 0.9);
}

.door-nav-link--active::after,
.door-nav-link--blog-active::after,
.door-nav-link--top-active::after {
  opacity: 1;
  transform: scaleX(1) translateX(0);
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

/* CTA variant: warmer inner door colors for "Hire Us" */
.door-nav-link--cta::before {
  background: linear-gradient(180deg, rgba(129, 140, 248, 0.9), rgba(168, 85, 247, 0.98));
  box-shadow: 0 0 0.55rem rgba(129, 140, 248, 0.95);
}

.door-nav-link--cta::after {
  background: linear-gradient(135deg,
    rgba(165, 180, 252, 0.45),
    rgba(196, 181, 253, 0.42));
}

.door-nav-link--cta.door-nav-link--active {
  background: radial-gradient(circle at left,
    rgba(129, 140, 248, 0.55),
    rgba(196, 181, 253, 0.42) 55%,
    rgba(255, 255, 255, 0.08) 90%);
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
    transform: scaleX(0.4) translateX(-20%);
  }
  40% {
    opacity: 0.9;
    transform: scaleX(1) translateX(0);
  }
  100% {
    opacity: 0.9;
    transform: scaleX(1) translateX(0);
  }
}
</style>
