<template>
  <section
    class="grid place-items-center min-h-screen bg-[url('/layered-steps-haikei-bg.svg')] bg-cover bg-right-bottom md:bg-center w-full"
  >
    <header class="text-center mb-20 mt-10">
      <div id="hire-us" aria-label="Hire Us Section"></div>
      <h1 class="font-bold py-6 text-3xl">Hire Us</h1>
    </header>
    <article
      class="relative md:left-9 grid grid-cols-1 md:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 glass"
    >
      <div class="col-span-1"></div>
      <section class="">
        <h2 class="text-center font-semibold text-2xl text-blue-700">
          Contact Us to make your dream a reality
        </h2>
        <div class="font-normal text-gray-900 pb-32">
          <div class="my-9 font-bold text-xl text-gray-900">
            Tel:<a href="tel:+1 (424)-442-0591">(424)-442-0591 </a>
          </div>
          <div class="text-gray-900 font-bold text-xl">
            Email: <a href="mailto:pazpaz25@gmail.com">pazpaz25@gmail.com</a>
          </div>
        </div>
      </section>
      <aside
        id="hire-us-info"
        class="w-96 bg-purple-400 p-6 rounded-xl md:absolute relative -top-[-20%] md:-top-9 md:-left-28 min-h-full text-blue-700"
      >
        <div v-for="memberinfo in membersInfo" :key="memberinfo.fullName">
          <MemberProfile :memberInfo="memberinfo" />
        </div>
      </aside>
    </article>
  </section>
</template>

<script>
import membersInfoData from "../assets/json/membersInfoData.json";
import MemberProfile from "../components/MemberProfile.vue";
import { ref, onMounted } from "vue";
export default {
  components: { MemberProfile },
  setup() {
    const membersInfo = ref([]);
    onMounted(() => {
      membersInfo.value = membersInfoData.membersInfo;
    });
    return {
      membersInfo,
    };
  },
};
</script>

<style scoped lang="css">
.glass {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  background-color: rgba(255, 255, 255, 0.3); /* Adjust the transparency */
  border-radius: 1rem; /* Rounded corners */
  padding: 1.5rem; /* Padding */
  color: #fff; /* Text color */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
}

figure {
  width: 100%;
}
</style>
