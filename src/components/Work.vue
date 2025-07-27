<template>
  <div class="grid place-items-center shadow-md">
    <div
      class="max-w-sm w-full mx-2 rounded overflow-hidden shadow-lg bg-white flex flex-col"
    >
      <img
        class="min-w-full h-full object-contain border rounded-lg border-purple-800 my-5 overflow-hidden"
        :src="image"
        :title="imageAlt"
        :alt="imageAlt"
        width="600"
        height="400"
      />
      <Transition name="slide-fade">
        <div
          v-show="!readMoreStatus"
          class="font-bold text-xl mb-2 text-blue-600 text-center"
        >
          {{ projectTitle }}
        </div>
      </Transition>
      <section
        class="font-bold text-xl mb-2 text-blue-600 flex justify-center items-center"
      >
        <button
          @click="toggleReadMoreStatus"
          aria-expanded="false"
          aria-controls="cardInfo"
          role="button"
          class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 flex item-center w-fit"
        >
          {{ readMoreText }}
        </button>
      </section>

      <Transition name="slide-fade" ref="cardInfo" class="cardInfo">
        <div v-show="readMoreStatus">
          <ActionButtons 
          :liveView="liveView"
          :codeView="codeView"
          :privateRepo="privateRepo"
          :projectTitle="projectTitle"
          />
          <div class="gray-bg-card flex-grow">
            <div class="font-bold text-xl mb-2 text-blue-600">
              {{ projectTitle }}
            </div>
            <p class="text-gray-700 text-base h-80 overflow-y-auto">
              {{ description }}
            </p>
          </div>
          <div class="px-3 pt-4 pb-2">
            <span
              v-for="(tec, index) in technologiesUsed"
              :key="index"
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              #{{ tec }}
            </span>
            <p class="text-gray-900 leading-none mt-2">
              <span class="font-bold">Role:</span> Developer
            </p>
            <p class="text-gray-600">
              <span class="font-bold">Completed:</span> January 2024
            </p>
          </div>
          <div class="gray-bg-card h-48 overflow-y-auto mt-5">
            <h3 class="font-bold text-lg mb-2 text-blue-600">Highlights</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-600">
              <li v-for="(highlight, index) in highlights" :key="index">
                {{ highlight }}
              </li>
            </ul>
          </div>
    
        </div>
      </Transition>
    </div>
  </div>
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
      const toggleReadMoreStatus = () => {
        readMoreStatus.value = !readMoreStatus.value;
        if (readMoreStatus.value) {
          // If read more is clicked (going to "Read Less"), scroll to the card info
          nextTick(() => {
            cardInfo.value.scrollIntoView({
              behavior: "smooth",
              inline: "center",
            });
          });
        }
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
  },
};
</script>

<style scoped>
.cardInfo {
  scroll-margin-top: 110px;
  margin-bottom: 10px;
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

.hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
