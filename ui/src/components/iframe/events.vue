<template>
  <div class="box">
    <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
      <h3 class="title is-4 mb-0">Events</h3>
      <button class="button is-small is-danger" @click="clearEvents" v-if="events.length > 0">
        Clear
      </button>
    </div>
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
  emits: ['clear'],
  setup(props, { emit }) {
    const clearEvents = () => {
      emit('clear');
    };

    return {
      props,
      clearEvents,
    };
  },
});
</script>
