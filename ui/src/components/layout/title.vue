<template>
  <div class="content-container block has-text-centered">
    <img
        :src="logoUrl"
        alt="Infigo"
        width="200"
    />
  </div>

  <div class="content-container block has-text-centered">
    <h1 class="title mb-4">{{ title }}</h1>
    <p v-if="subtitle" class="subtitle is-marginless">{{ subtitle }}</p>
  </div>

</template>
<script lang="ts">
import {computed, defineComponent} from "vue";
import {Constants} from "../../../consts/constants";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: 'Welcome to Infigo'
    },
    subtitle: {
      type: String,
      default: 'Explore our Editor Iframe'
    }
  },
  setup() {
    return {
      logoUrl: Constants.InfigoURL,
    }
  }
});
</script>
