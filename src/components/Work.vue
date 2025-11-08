<template>
  <article 
    :aria-label="'Project: ' + projectTitle"
    class="grid place-items-center"
    :data-expanded="readMoreStatus"
  >
    <div class="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-purple-200/70 bg-white/90 shadow-xl transition-colors duration-300 dark:border-indigo-400/40 dark:bg-slate-800/70">
      <img
        class="my-5 h-full min-w-full rounded-xl border border-purple-500/80 object-contain shadow-sm transition-colors duration-300 dark:border-indigo-300/70"
        :src="image"
        :title="imageAlt"
        :alt="imageAlt"
        width="600"
        height="400"
        :aria-hidden="!imageAlt"
      />
      <Transition name="slide-fade">
        <h2
          v-show="!readMoreStatus"
          class="mb-2 text-center text-xl font-semibold text-purple-700 transition-colors duration-300 dark:text-indigo-200"
        >
          {{ projectTitle }}
        </h2>
      </Transition>
      <section
        class="mb-2 flex items-center justify-center text-xl font-semibold text-purple-700 dark:text-indigo-100"
      >
        <button
          type="button"
          @click="toggleReadMoreStatus"
          @keydown.enter.space.prevent="toggleReadMoreStatus"
          :aria-expanded="readMoreStatus ? 'true' : 'false'"
          :aria-controls="`card-${projectId}`"
          :aria-describedby="`project-toggle-desc-${projectId}`"
          class="mb-2 flex w-fit items-center rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 hover:bg-purple-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-indigo-950"
        >
          {{ readMoreText }}
          <span class="sr-only" :id="`project-toggle-desc-${projectId}`">project details for {{ projectTitle }}</span>
        </button>
      </section>

      <Transition name="slide-fade">
        <div 
          v-show="readMoreStatus" 
          :id="`card-${projectId}`"
          role="region"
          aria-live="polite"
          class="cardInfo"
          ref="cardInfo"
        >
          <ActionButtons 
            :liveView="liveView"
            :codeView="codeView"
            :privateRepo="privateRepo"
            :projectTitle="projectTitle"
          />
          <div 
            class="flex-grow rounded-2xl border border-purple-100/50 bg-white/90 p-5 shadow-inner transition-opacity duration-200 dark:border-indigo-300/40 dark:bg-slate-800/40"
            :class="{ 'opacity-0 h-0 overflow-hidden': !readMoreStatus, 'opacity-100': readMoreStatus }"
            :aria-labelledby="`project-title-${projectId}`"
            :aria-hidden="!readMoreStatus"
            :tabindex="readMoreStatus ? '0' : '-1'"
          >
            <h3 :id="`project-title-${projectId}`" class="sr-only">
              Project Details: {{ projectTitle }}
            </h3>
            <p class="h-80 overflow-y-auto text-base text-slate-700 transition-colors duration-300 dark:text-slate-200">
              {{ description }}
            </p>
          </div>
          <div 
            class="px-3 pt-4 pb-2 transition-opacity duration-200"
            :class="{ 'opacity-0 h-0 overflow-hidden': !readMoreStatus, 'opacity-100': readMoreStatus }"
            :aria-hidden="!readMoreStatus"
            :tabindex="readMoreStatus ? '0' : '-1'"
          >
            <ul class="m-0 list-none p-0">
              <li 
                v-for="(tec, index) in technologiesUsed"
                :key="index"
                class="mr-2 mb-2 inline-block rounded-full bg-purple-100/80 px-3 py-1 text-sm font-semibold text-purple-800 transition-colors duration-300 dark:bg-indigo-900/40 dark:text-indigo-100"
              >
                #{{ tec }}
              </li>
            </ul>
            <p class="mt-2 leading-none text-slate-900 dark:text-slate-100">
              <span class="font-bold">Role:</span> Developer
            </p>
            <p class="text-slate-600 dark:text-slate-300">
              <span class="font-bold">Completed:</span> January 2024
            </p>
          </div>
          <div 
            class="mt-5 rounded-2xl border border-purple-100/50 bg-white/90 p-5 shadow-inner transition-opacity duration-200 dark:border-indigo-300/40 dark:bg-slate-800/45"
            :class="{ 'opacity-0 h-0 overflow-hidden': !readMoreStatus, 'opacity-100': readMoreStatus }"
            :aria-hidden="!readMoreStatus"
            :tabindex="readMoreStatus ? '0' : '-1'"
          >
            <h3 class="mb-2 text-lg font-semibold text-purple-700 dark:text-indigo-200">
              Highlights
            </h3>
            <div 
              class="h-48 overflow-y-auto rounded border border-purple-100/40 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:border-indigo-300/40 dark:focus:ring-indigo-300"
              tabindex="0"
              aria-label="Project highlights"
            >
              <ul class="space-y-2 pl-5 list-disc">
                <li 
                  v-for="(highlight, index) in highlights" 
                  :key="index"
                  class="text-slate-700 transition-colors duration-300 dark:text-slate-200"
                >
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
    
        </div>
      </Transition>
    </div>
  </article>
</template>

<script>
import { toRefs, ref, computed, nextTick } from "vue";
import ActionButtons from "./UI/ActionButtons.vue";
export default {
  props: {
    projectInfo: Object,
  },
  components: {
    ActionButtons,
  },
  setup(props) {
    const readMoreStatus = ref(false);
    const cardInfo = ref(null);
    if (props.projectInfo) {
      const {
        projectId,
        image,
        imageAlt,
        projectTitle,
        clientName,
        description,
        technologiesUsed,
        startDate,
        endDate,
        highlights,
        liveView,
        codeView,
        privateRepo,
      } = toRefs(props.projectInfo);

      const readMoreText = computed(() => {
        return !readMoreStatus.value ? "Read More" : "Read Less";
      });
      const toggleReadMoreStatus = (event) => {
        // Prevent default only for keyboard events to avoid double-triggering with click
        if (event.type === 'keydown') {
          event.preventDefault();
        }
        
        const wasExpanded = readMoreStatus.value;
        readMoreStatus.value = !wasExpanded;
        
        nextTick(() => {
          if (!wasExpanded) {
            // Smoothly scroll the top of the card content into view.
            // The browser's natural tab order will handle focusing the first interactive element.
            cardInfo.value?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          } else {
            // When collapsing, return focus to the toggle button
            event.target?.focus?.();
          }
        });
      };
      
      return {
        projectId,
        image,
        imageAlt,
        projectTitle,
        clientName,
        description,
        technologiesUsed,
        startDate,
        endDate,
        highlights,
        liveView,
        codeView,
        privateRepo,
        readMoreText,
        readMoreStatus,
        toggleReadMoreStatus,
        cardInfo,
      };
    }
    
    // Return default values if no projectInfo is provided
    return {
      projectId: '',
      image: '',
      imageAlt: '',
      projectTitle: '',
      description: '',
      technologiesUsed: [],
      highlights: [],
      liveView: '',
      codeView: '',
      privateRepo: false,
      readMoreText: 'Read More',
      readMoreStatus: false,
      toggleReadMoreStatus: () => {},
      cardInfo: null
    };
  },
};
</script>

<style scoped>
.cardInfo {
  scroll-margin-top: 6.875rem; /* 110px */
  margin-bottom: 3rem;
}
@media screen and (max-width: 48rem) { /* 768px */
  .cardInfo {
    scroll-margin-top: 5.5rem; /* 88px - space for sticky header + padding on mobile */
  }
}
summary {
  list-style: none; /* Remove the default list-style */
  cursor: pointer; /* Optional: change the cursor to pointer */
  margin-block: 1rem;
  margin-inline: 1rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}


</style>
