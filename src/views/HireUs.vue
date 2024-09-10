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

    <div
      id="members-cards-info"
      class="w-96 bg-purple-400 p-6 rounded-xl relative text-blue-700 z-[2] left-[-20%] md:left-[-14rem]"
    >
      <div class="card relative">
        <header class="text-2xl font-semibold">Our Team members</header>
        <section class="members flex items-center justify-center gap-2">
          <div>
            <h2>Izak</h2>
            <a href="#izak-info">more info...</a>
          </div>
          <div>
            <h2>Sam</h2>
            <a href="#sam-info">more info...</a>
          </div>
        </section>
      </div>

      <section
        class="contact-info absolute opacity-0 grid grid-cols-2 md1:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 glass"
      >
        <section class="col-span-1">
          <div class="card">
            <div class="font-normal text-gray-900">
              <h2
                class="text-center w-full pr-[28px] font-semibold text-2xl text-blue-700"
              >
                Contact Us to make your dream a reality
              </h2>
              <div class="flex flex-col gap-5 mt-16">
                <div>
                  Tel:
                  <a href="tel:+1 (424)-442-0591">(424)-442-0591 </a>
                </div>
                <div>
                  Email:
                  <a href="mailto:pazpaz25@gmail.com">pazpaz25@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>

    <section
      class="contact-info absolute z-[1] grid grid-cols-2 md1:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 glass"
    >
      <div class="col-span-1"></div>
      <section class="col-span-1">
        <div class="card">
          <div class="font-normal text-gray-900">
            <h2
              class="text-center w-full pr-[28px] font-semibold text-2xl text-blue-700"
            >
              Contact Us to make your dream a reality
            </h2>
            <div class="flex flex-col gap-5 mt-16">
              <div>
                Tel:
                <a href="tel:+1 (424)-442-0591">(424)-442-0591 </a>
              </div>
              <div>
                Email:
                <a href="mailto:pazpaz25@gmail.com">pazpaz25@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

    <section
      class="members-info absolute grid grid-cols-2 md1:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 glass"
    >
      <div class="col-span-1"></div>
      <section class="col-span-1">
        <div class="card">
          <div
            id="izak-info"
            class="bg-gradient-to-r from-blue-100 to-purple-500
             text-gray-800 p-6  rounded-lg shadow-md max-w-2xl
              leading-relaxed"
          >
            <a href="#close"> X </a>
            <h1 class="font-bold py-3 text-3xl">Izak Tarashandegan</h1>
            <h2>Founder / Coder</h2>
            <img
              src="/programmers/skman-tyler.svg"
              alt="izak tarashandegan the founder and coder"
              class="float-right"
            />
            <p>
              At IT, we specialize in helping businesses build a strong internet
              presence. With a degree in CS from CSUN and years of
              experience as a freelance web developer, I’ve had the pleasure of
              supporting various companies in bringing their digital visions to
              life. Our mission is simple: to make your life easier by crafting
              websites that are not only functional but also impactful. We
              believe in opening doors of opportunity, one website at a time.
            </p>
          </div>
          <div
            id="sam-info"
            class="bg-gradient-to-r from-blue-100 to-purple-500
             text-gray-800  rounded-lg shadow-md max-w-2xl 
             leading-relaxed"
          >
            <a href="#close"> X </a>
            <h1 class="font-bold py-3 text-3xl">Skman Tyler</h1>
            <h2>Code Leader</h2>
            <img
              src="/programmers/skman-tyler.svg"
              alt="skman tyler the leader coder"
              class="float-right"
            />
            <p>
              Web Application Developer with 10+ years experience in modern,
              full-stack, component-based design with a focus on reliability via
              automated testing. Extremely diverse history in getting up to
              speed quickly and utilizing many different technologies to solve
              real-world problems. Diverse portfolio of applications includes an
              online document viewer, inventory management software, online
              health care tracking apps, and social network visualization and
              analysis.
            </p>
          </div>
        </div>
      </section>
    </section>
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
.container {
  position: relative;
}
.glass {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.card {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#hire-us {
  isolation: isolate;
  position: relative;
}
#hire-us::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
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

#members-cards-info .card {
  width: calc(300px - 0px);
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  gap: 2rem;
}
#members-cards-info .contact-info {
  opacity: 0;
  width: 384px;
  left: 0;
  z-index: -1;
}
#members-cards-info .members div {
  background: white;
  border: 1px solid gray;
  border-radius: 10%;
  padding: 2rem;
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
}
.members-info .card div {
  width: calc(60% - 0rem);
  height: calc(540px - 0rem);
  padding: 1.5rem;
  opacity: 0;
  color: black;
  transition: all 2s ease-in-out;
  position: absolute;
  top: -4%;
}
.contact-info {
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
}
:has(:target):has(.members-info) .contact-info {
  transform: translateX(-100%);
  opacity: 0;
}

:has(:target):has(.members-info) #members-cards-info .contact-info {
  top: 0%;
  left: 100%;
  opacity: 1;
  z-index: 1;
  width: 100%;
  background-color: #bd80fa;
}

:has(:target):has(.members-info) #members-cards-info + .card {
  opacity: 0;
}

.members-info .card div:target {
 
  transform: translateX(0%);
  opacity: 1;
  color: black;
}

.card div a {
  cursor: pointer;
}
a[href="#close"] {
  float: right;
  border: 2px solid black;
  padding: 5px;
  border-radius: 5px;
  text-decoration: none;
}
</style>
