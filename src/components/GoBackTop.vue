<template>
  <button class="doorgroup" ref="doorGroup" @click="scrollToTop" aria-label="Go to top of page">
    <div class="doorway" ref="doorWay">
      <div id="openDoor" class="door" ref="door">
        <div ref="openDoor" class="mx-auto text-center mt-2 w-full h-full text-xl">
          <span class="text-2xl" aria-hidden="true">⬆️</span>
          <span class="flex justify-end items-center mt-3 text-sm" aria-hidden="true">
            🟣</span>
        </div>
      </div>
    </div>
  </button>
</template>
<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const doorGroup = ref(null);
    const door = ref(null);
    const doorWay = ref(null);
    const openDoor = ref(null);
    const animationFrameId = ref(null);

    const handleScroll = () => {

      if (window.scrollY > 30) {
        door.value.classList.remove("hidden");
        door.value.classList.add("show");
        openDoor.value.classList.remove("hidden");
        openDoor.value.classList.add("show");
        doorWay.value.classList.remove("hidden");
        doorWay.value.classList.add("show");
      } else {
        door.value.style.transform = "rotateY(0deg)";
        door.value.classList.remove("show");
        door.value.classList.add("hidden");
        openDoor.value.classList.remove("show");
        openDoor.value.classList.add("hidden");
        doorWay.value.classList.remove("show");
        doorWay.value.classList.add("hidden");
      }
    };

    const scrollToTop = () => {
      door.value.style.transform = "rotateY(55deg)";
      history.replaceState({}, '', location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });

    };
    const handleTouchStart = (event) => {
      event.preventDefault();
      door.value.style.transform = "rotateY(55deg)";
    };

    const handleTouchEnd = (event) => {
      // Cancel any previous animation frame (if needed)
      if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value);
        animationFrameId.value = null;
      }

      animationFrameId.value = requestAnimationFrame(() => {
        door.value.style.transform = "rotateY(0deg)";
        scrollToTop();
      });

      event.preventDefault();
    };
    onMounted(() => {
      openDoor.value.classList.add("hidden");
      door.value.classList.add("hidden");
      doorWay.value.classList.add("hidden");
      window.addEventListener("scroll", handleScroll);

      // Parent element listener (capture phase)
      // Only add touch listeners to the doorGroup (outermost element)
      // This will capture touches anywhere within the door
      doorGroup.value.addEventListener("touchstart", handleTouchStart, {
        passive: false
      });
      doorGroup.value.addEventListener("touchend", handleTouchEnd, {
        passive: false
      });


    });

    return {
      doorGroup,
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
  cursor: pointer;
  display: inline-flex;
  position: fixed;
  z-index: 2; 
  isolation: isolate; /* Create new stacking context */
  bottom: 3.5rem;
  right: 1rem;
  touch-action: manipulation;
}

.doorway {
  border: 5px solid black;
  height: 110px;
  width: 66px;
  position: relative;
  perspective: 200px;
  /* Apply perspective to the parent */
}

.door {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgb(146, 47, 153);
  font-size: 24px;
  border-left: none;
  transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
  transform: rotateY(0deg);
  transform-origin: left center;
  user-select: none;
}

.door * {
  pointer-events: auto;
  touch-action: manipulation;
}

.door:focus-visible {
  transform: rotateY(55deg);
}
</style>
