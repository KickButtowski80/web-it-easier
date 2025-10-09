<template>
  
   <time  class="updated-at" :datetime="formatDateISO(postUpdatedAt)">
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
import { formatDateISO, relativeTime } from '@/utils/helpers';

export default {
    props: {
        postUpdatedAt: {
            type: [String, Date],
            required: true
        }
    },
    setup(props) {
        return {
            formatDateISO,
            relativeTime
        };
    }
};
</script>

<style scoped>

.updated-at {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.12);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  letter-spacing: 0.01em;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.updated-at__icon {
  width: 0.9rem;
  height: 0.9rem;
}

.updated-at__label {
  display: inline-block;
}

.dark .updated-at {
  color: #c7d2fe;
  background: rgba(129, 140, 248, 0.22);
}

</style>
