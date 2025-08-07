<template>
  <section id="our-works" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold text-center mb-12">Our Works</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in freelancerProjectHistory" :key="project.projectId"
          class="bg-white rounded-lg shadow-md overflow-hidden">
          <Suspense>
            <template #default>
              <Work :projectInfo="project" />
            </template>
            <template #fallback>
              <div>Loading project...</div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, defineAsyncComponent } from "vue";
import freelancerProjectHistoryData from "../assets/json/freelancerProjectHistoryData.json";


export default {
  components: {
    Work: defineAsyncComponent(() => import('../components/Work.vue'))
  },
  setup() {
    const freelancerProjectHistory = ref([]);

    onMounted(() => {
      freelancerProjectHistory.value =
        freelancerProjectHistoryData.freelancerProjectHistory;
    });

    return {
      freelancerProjectHistory,
    };
  },
};
</script>
