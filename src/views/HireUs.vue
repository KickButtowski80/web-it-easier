<template>
  <section
    id="hire-us"
    aria-label="Hire Us Section"
    class="grid place-items-center"
  >
    <header class="text-center mb-20">
      <div></div>
      <h1 class="font-bold py-6 text-3xl">Hire Us</h1>
    </header>
    <article
      class="hire-us-article relative md:left-9 grid grid-cols-1 md:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 glass"
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
    </article>
    <div
      id="hire-us-info"
      class="w-96 bg-purple-400 p-6 rounded-xl relative -top-[-20%] md:-top-[31rem] md:-left-48 min-h-full text-blue-700"
    >
      <div v-for="memberinfo in membersInfo" :key="memberinfo.fullName">
        <MemberProfile :memberInfo="memberinfo" class="member-profile" />
      </div>
    </div>
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
header h1 {
  animation: slide-in 0.8s ease-in-out;
}

@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.glass {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.3); 
  border-radius: 1rem; 
  padding: 1.5rem; 
  color: #fff; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}
#hire-us {
  isolation: isolate;
  position: relative;
}
#hire-us::before {
  content: "";
  position: absolute;
  top: 0;
  left:0;
  height: 100vh;
  width: 100%;
  background-image: linear-gradient(
    135deg,
    transparent 50%,
    rgb(189, 128, 250) 50%
  );
  background-size: 768px 768px;
 
  transition: background-position 0.2s;
  background-attachment: fixed;
  background-position: bottom right;
  background-repeat: no-repeat;
}

#hire-us:has(details[open])#hire-us {
  transition: all 0.2s;
}

#hire-us-info .member-profile {
  transition: transform 0.3s ease-in-out;
}

#hire-us-info .member-profile:hover {
  transform: translateY(-10px);
}
</style>
