<template>
  <section>
    <div id="my-works"></div>
    <h1 class="text-center font-bold py-6 text-3xl mt-20">My Works</h1>
    <section
      class="min-h-screen grid grid-cols-1 gap-y-6 place-items-center md:grid-cols-2 lg:grid-cols-3"
    >
      <div v-for="project in freelancerProjectHistory" :key="project.projectId">
        <Work :projectInfo="project" />
      </div>
    </section>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import freelancerProjectHistoryData from "../assets/json/freelancerProjectHistoryData.json";
import Work from "../components/Work.vue";

export default {
  components: {
    Work,
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
