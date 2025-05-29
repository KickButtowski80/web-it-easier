<template>
  <figure class="clear-both mb-20">
    <img
      :src="image"
      :alt="imgAlt"
      class="rounded-full float-left overflow-hidden"
      style="shape-outside: circle()"
    />

    <figcaption>
      <details>
        <summary>
          <h2 class="text-black text-lg md:text-xl font-bold">{{ fullName }}</h2>
          <h3 class="text-gray-700 text-lg font-semibold">{{ title }}</h3>
        </summary>
        <div class="text-justify mb-3">
          {{ bio }}
        </div>
      </details>
    </figcaption>
  </figure>
</template>
<script>
import { toRefs, toRef, ref, computed, nextTick } from "vue";
export default {
  props: {
    memberInfo: Object,
  },
  setup(props) {
    const { image, imgAlt, fullName, title, bio } = toRefs(props.memberInfo);

    return {
      image,
      imgAlt,
      fullName,
      title,
      bio,
    };
  },
};
</script>

<style scoped>
/* Define the closed state of the details */
details {
  overflow: hidden;
  transition: max-height 0.4s ease-out;
  max-height: 5rem; /* Adjust this to fit the closed summary height */
}

details[open] {
  max-height: 100vh; /* This allows the content to fully expand when opened */
}

</style>
