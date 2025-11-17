<template>
  <!-- Native button keeps semantics while the animation lives inside -->
  <button type="button" class="
   go-top-button
  fixed z-50 isolate inline-flex cursor-pointer right-4 bottom-[6.5rem] md:bottom-14
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4
  focus-visible:outline-purple-600 dark:focus-visible:outline-indigo-200
" ref="doorGroup" @click="scrollToTop" aria-label="Go to top of page">
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
  <!-- Screen-reader only region announces when the page returns to the top -->
  <span ref="statusRegion" class="sr-only" aria-live="polite"></span>
</template>
<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const doorGroup = ref(null);
    const door = ref(null);
    const doorWay = ref(null);
    const openDoor = ref(null);
    const animationFrameId = ref(null);
    const scrollFrame = ref(null); // Tracks the pending RAF so we only mutate per frame
    const statusRegion = ref(null); // Reference to the live region for announcements
    const announceTimeout = ref(null); // Clears announcement text after the polite message is spoken

    const cleanupAnimation = () => {
      if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value);
        animationFrameId.value = null;
      }
    };

    const announceTop = () => {
      if (!statusRegion.value) return;

      // Briefly set copy so assistive tech announces the successful scroll
      statusRegion.value.textContent = "Scrolled to top";

      if (announceTimeout.value) {
        clearTimeout(announceTimeout.value);
      }

      announceTimeout.value = setTimeout(() => {
        if (statusRegion.value) {
          statusRegion.value.textContent = "";
        }
        announceTimeout.value = null;
      }, 1200);
    };

    const handleScroll = () => {
      // Prevent redundant DOM work by coalescing events into a single RAF callback
      if (scrollFrame.value !== null) {
        return;
      }

      scrollFrame.value = requestAnimationFrame(() => {
        scrollFrame.value = null;

        if (!door.value || !openDoor.value || !doorWay.value) {
          return;
        }

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
      });
    };

    const scrollToTop = () => {
      door.value.style.transform = "rotateY(55deg)";
      history.replaceState({}, '', location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
      announceTop();

    };
    const handleTouchStart = (event) => {
      event.preventDefault();
      door.value.style.transform = "rotateY(55deg)";
    };

    const handleTouchEnd = (event) => {
      // Cancel any previous animation frame (if needed)
      cleanupAnimation();

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

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);

      if (doorGroup.value) {
        doorGroup.value.removeEventListener("touchstart", handleTouchStart);
        doorGroup.value.removeEventListener("touchend", handleTouchEnd);
      }

      cleanupAnimation();

      if (scrollFrame.value !== null) {
        cancelAnimationFrame(scrollFrame.value);
        scrollFrame.value = null;
      }

      if (announceTimeout.value) {
        clearTimeout(announceTimeout.value);
        announceTimeout.value = null;
      }
    });

    return {
      doorGroup,
      openDoor,
      door,
      doorWay,
      scrollToTop,
      statusRegion,
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
.go-top-button {
  touch-action: manipulation;
}

.doorway {
  border: 5px solid black;
  height: 110px;
  width: 66px;
  position: relative;
  /* Apply perspective to the parent */
  perspective: 200px;
}

.door {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgb(146, 47, 153);
  color: #ffffff; /* High contrast against the violet door */
  font-size: 24px;
  border-left: none;
  transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
  transform: rotateY(0deg);
  transform-origin: left center;
  user-select: none;
}

.dark .door {
  background: rgb(146, 47, 153);
  color: #fce7f3; /* Soft white with adequate contrast in dark mode */
}

.door * {
  pointer-events: auto;
  touch-action: manipulation;
}

.door:focus-visible {
  transform: rotateY(55deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
