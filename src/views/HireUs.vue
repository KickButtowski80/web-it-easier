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
      class="hire-us-article relative md:left-9 grid grid-cols-2
      md1:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16
      md:mb-8 bg-white border border-gray-200 rounded-lg shadow
      hover:bg-gray-100 glass"
    >
      <div class="col-span-1"></div>
      <section class="col-span-1">
        <div class="card members-info">
          <div id="contact" class="font-normal text-gray-900  ">
            <h2 class="text-center font-semibold text-2xl text-blue-700">
              Contact Us to make your dream a reality
            </h2>
             
              <div class="flex flex-col ">
                <div>
                  Tel:<a href="tel:+1 (424)-442-0591">(424)-442-0591 </a>
                </div>
                <div>
                  Email: <a href="mailto:pazpaz25@gmail.com">pazpaz25@gmail.com</a>
                </div>
              </div>
       
          </div>
          
          <div id="izak-info" class="member">
            <a href="#close"> X </a>
            <h1>Izak Info</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe
              velit magni illo deserunt iusto voluptatem rem cumque
              necessitatibus eius tempora. Corporis, modi. Nisi quia iusto
              mollitia ex porro esse recusandae?
            </p>
          </div>
          <div id="sam-info" class="member">
            <a href="#close"> X </a>
            <h1>Sam Info</h1>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod
              voluptatem deserunt hic maxime. Doloribus exercitationem
              distinctio veritatis voluptatibus, adipisci amet possimus ullam
              dolores facere rem numquam eveniet accusamus vitae? Nobis.
            </p>
          </div>
        </div>
      </section>
    </article>

    <div
      id="hire-us-info"
      class="w-96 bg-purple-400 p-6 rounded-xl relative -top-[-20%] md:-top-[31rem] md:-left-48 min-h-full text-blue-700"
    >
      <div class="card">
        <header>Our Team members</header>
        <section class="members">
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
  left: 0;
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

 

.card {
  width: calc(300px - 0px);
  height: 350px;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  gap: 2rem;
 
}

.card:has(.members) .members {
  display: flex;
  gap: 1rem;
}
.card div {

  width: calc(100% - 3rem);
  padding: 1rem;
  opacity: 1;
  transition: all 2s ease-in-out;
}
.members-info {
  position: relative;
}
.members-info #contact div {
  width: 100%;
  opacity: 1;
  position: relative;
}

.members-info div {
  position: absolute;
  display: block;
  opacity: 0;
  color: black;
  transition: all 2s ease-in-out;
}

  #contact  {
  opacity: 1 ;
  display: block;
  height: 100%;
}
 
.card:has(:target) #contact {
  display: none;
  opacity: 0;
}
div:has(.member) div:target {
  /* display: inline-block; */
  opacity: 1;
  transform: scale(1);
}

.card div a {
  cursor: pointer;
}
a[href="#close"] {
  border: 2px solid black;
  padding: 5px;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
}
.card:has(#close:target) div {
  opacity: 0;
  height: 0;
  display: none;
}
</style>
