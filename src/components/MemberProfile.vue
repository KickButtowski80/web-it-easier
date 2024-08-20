<template>
  <figure class="clear-both">
    <img
      :src="img"
      :alt="imgAlt"
      class="rounded-full float-left"
      style="shape-outside: circle()"
    />

    <figcaption>
      <summary>
        <h2 class="text-black text-xl font-bold">{{ name }}</h2>
        <h3 class="text-gray-700 text-lg font-semibold">{{ title }}</h3>
        <details>
          <div class="text-justify mb-3">
            {{ info }}
          </div>
        </details>
      </summary>
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
    if (props.memberInfo) {
      const { 
        image,
        imgAlt,
        fullName,
        title,
        bio,
         } = toRefs(props.memberInfo);
    }
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
