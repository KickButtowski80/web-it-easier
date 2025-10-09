<template>
  <time
    class="updated-at"
    :class="sizeClass"
    :datetime="formatDateISO(postUpdatedAt)"
  >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="updated-at__icon">
            <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"
                d="M12 6v6l3 1.5m6-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="updated-at__label">
            Updated {{ relativeTime(postUpdatedAt) }}
        </span>
    </time>
</template>

<script>
import { computed, toRef } from 'vue';
import { formatDateISO, relativeTime } from '@/utils/helpers';

export default {
    props: {
        postUpdatedAt: {
            type: [String, Date],
            required: true
        },
        size: {
            type: String,
            default: 'md',
            validator: value => ['sm', 'md'].includes(value)
        }
    },
    setup(props) {
        const size = toRef(props, 'size');

        const sizeClass = computed(() => ({
            'updated-at--sm': size.value === 'sm',
            'updated-at--md': size.value === 'md'
        }));

        return {
            formatDateISO,
            relativeTime,
            sizeClass
        };
    }
};
</script>

<style scoped>


.updated-at {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.12);
  border-radius: 9999px;
  letter-spacing: 0.01em;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.updated-at--md {
  font-size: 1rem;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
}

.updated-at--sm {
  font-size: 0.85rem;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
}

.updated-at--sm .updated-at__icon {
  width: 0.75rem;
  height: 0.75rem;
}

.updated-at__icon {
  width: 1rem;
  height: 1rem;
  display: block;
}

.updated-at__label {
  display: inline-block;
}

.dark .updated-at {
  color: #c7d2fe;
  background: rgba(129, 140, 248, 0.22);
}

</style>
