<template>
  <div class="box">
    <h3 class="title is-4">Events</h3>
    <div v-for="event in events" :key="event.method">
      <p>
        <strong>{{ event.method }}</strong>
      </p>
      <pre class="editor-event" v-if="event.data">{{ event.data }}</pre>
      <hr v-else/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>
