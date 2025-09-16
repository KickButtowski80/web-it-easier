<template>
  <article 
    :aria-label="'Project: ' + projectTitle"
    class="grid place-items-center shadow-md"
    :data-expanded="readMoreStatus"
  >
    <div class="max-w-sm w-full mx-2 rounded overflow-hidden shadow-lg bg-white flex flex-col">
      <img
        class="min-w-full h-full object-contain border rounded-lg border-purple-800 my-5 overflow-hidden"
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
          class="font-bold text-xl mb-2 text-blue-700 text-center"
        >
          {{ projectTitle }}
        </h2>
      </Transition>
      <section
        class="font-bold text-xl mb-2 text-blue-700 flex justify-center items-center"
      >
        <button
          @click="toggleReadMoreStatus"
          @keydown.enter.space.prevent="toggleReadMoreStatus"
          :aria-expanded="readMoreStatus ? 'true' : 'false'"
          :aria-controls="`card-${projectId}`"
          :aria-label="`${readMoreStatus ? 'Collapse' : 'Expand'} project details for ${projectTitle}`"
          class="focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 flex item-center w-fit transition-all duration-200"
        >
          {{ readMoreText }}
          <span class="sr-only">for {{ projectTitle }}</span>
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
            ref="descriptionSection"
            class="gray-bg-card flex-grow transition-opacity duration-200"
            :class="{ 'opacity-0 h-0 overflow-hidden': !readMoreStatus, 'opacity-100': readMoreStatus }"
            :aria-labelledby="`project-title-${projectId}`"
            :aria-hidden="!readMoreStatus"
            :tabindex="readMoreStatus ? '0' : '-1'"
          >
            <h3 :id="`project-title-${projectId}`" class="sr-only">
              Project Details: {{ projectTitle }}
            </h3>
            <p class="text-gray-700 text-base h-80 overflow-y-auto">
              {{ description }}
            </p>
          </div>
          <div 
            ref="techSection"
            class="px-3 pt-4 pb-2 transition-opacity duration-200"
            :class="{ 'opacity-0 h-0 overflow-hidden': !readMoreStatus, 'opacity-100': readMoreStatus }"
            :aria-hidden="!readMoreStatus"
            :tabindex="readMoreStatus ? '0' : '-1'"
          >
            <ul class="list-none p-0 m-0">
              <li 
                v-for="(tec, index) in technologiesUsed"
                :key="index"
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{{ tec }}
              </li>
            </ul>
            <p class="text-gray-900 leading-none mt-2">
              <span class="font-bold">Role:</span> Developer
            </p>
            <p class="text-gray-600">
              <span class="font-bold">Completed:</span> January 2024
            </p>
          </div>
          <div 
            ref="highlightsSection"
            class="gray-bg-card mt-5 transition-opacity duration-200"
            :class="{ 'opacity-0 h-0 overflow-hidden': !readMoreStatus, 'opacity-100': readMoreStatus }"
            :aria-hidden="!readMoreStatus"
            :tabindex="readMoreStatus ? '0' : '-1'"
          >
            <h3 class="font-bold text-lg mb-2 text-blue-700">
              Highlights
            </h3>
            <div 
              class="h-48 overflow-y-auto p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              tabindex="0"
              aria-label="Project highlights"
            >
              <ul class="space-y-2 pl-5 list-disc">
                <li 
                  v-for="(highlight, index) in highlights" 
                  :key="index"
                  class="text-gray-700"
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
import { toRefs, toRef, ref, computed, nextTick } from "vue";
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
      const descriptionSection = ref(null);
      const techSection = ref(null);
      const highlightsSection = ref(null);
      
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
      clientName: '',
      description: '',
      technologiesUsed: [],
      startDate: '',
      endDate: '',
      highlights: [],
      liveView: '',
      codeView: '',
      privateRepo: false,
      readMoreText: 'Read More',
      readMoreStatus: false,
      toggleReadMoreStatus: () => {},
      cardInfo: null,
      descriptionSection: null,
      techSection: null,
      highlightsSection: null
    };
  },
};
</script>

<style scoped>
.cardInfo {
  scroll-margin-top: 110px;
  margin-bottom: 3rem;
}
@media screen and (max-width: 768px) {
  .cardInfo {
    scroll-margin-top: 40px; /* Adjust margin for medium screens */
  }
}
summary {
  list-style: none; /* Remove the default list-style */
  cursor: pointer; /* Optional: change the cursor to pointer */
  margin-block: 1rem;
  margin-inline: 1rem;
}

details[open] > summary::before {
  display: none; /* Hide the default triangle when the details element is open */
}

details summary::-webkit-details-marker {
  display: none; /* Hide the default triangle in WebKit browsers (Chrome, Safari) */
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
