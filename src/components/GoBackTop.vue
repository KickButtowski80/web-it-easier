<template>
  <button
    type="button"
    class="doorgroup"
    @click="scrollToTop"
    aria-label="Go to top of page"
  >
    <div class="doorway" ref="doorWay">
      <div id="openDoor" class="door" ref="door">
        <a
          href="#openDoor"
          ref="openDoor"
          aria-label="Open Door"
          class="flex justify-center text-center mt-2 w-full h-full text-xl"
        >
          <span>go</span>
          <span role="img" aria-label="Up Arrow">⬆️</span>
          <span
            class="flex justify-end items-center mt-3 text-sm"
            aria-label="door knob"
          >
            🟣</span
          >
      </a>
      </div>
    </div>
  </button>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";

export default {
  setup() {
    const door = ref(null);
    const doorWay = ref(null);
    const openDoor = ref(null);

    const handleScroll = () => {
      if (window.scrollY > 30) {
        door.value.classList.remove("hidden");
        door.value.classList.add("show");
        openDoor.value.classList.remove("hidden");
        openDoor.value.classList.add("show");
        doorWay.value.classList.remove("hidden");
        doorWay.value.classList.add("show");
      } else {
        doorWay.value.classList.remove("show");
        doorWay.value.classList.add("hidden");
        door.value.classList.remove("show");
        door.value.classList.add("hidden");
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nextTick(() => {
        // Assuming doorRef is defined and used similarly to the back-to-top button
        if (door.value) {
          door.value.style.transform = "rotateY(0deg)";
        }
        if (window.location.hash) {
          history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
          );
        }
      });
    };
    const handleTouchStart = () => {
      console.log('i am touched')
      door.value.style.transform = 'rotateY(55deg)'
    };
    onMounted(() => {
      openDoor.value.classList.add("hidden");
      door.value.classList.add("hidden");
      doorWay.value.classList.add("hidden");
      window.addEventListener("scroll", handleScroll);
      document.addEventListener("touchstart", handleTouchStart, true);
    });

    return {
      openDoor,
      door,
      doorWay,
      scrollToTop,
    };
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
.show {
  display: block;
}

.doorgroup {
  perspective: 200px;
  cursor: pointer;
  display: inline-flex;
  position: fixed;
  bottom: 40px;
  right: 5px;
}

.doorway {
  border: 5px solid black;
  height: 110px;
  width: 66px;
  position: relative;
}

.door {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100px;
  width: 56px;
  background: rgb(146, 47, 153);
  font-size: 24px;
  border-left: none;
  transition: 60ms transform ease-in-out;
  transform: rotateY(0deg);
  transform-origin: left;
}

.door:hover, .door:active, .door:focus{
  transform: rotateY(55deg);
}
</style>
