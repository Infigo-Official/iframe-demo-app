<template>
  <div id="loadingOverlay" class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {};
  },
  methods: {},
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure it overlays above other content */
}

.spinner {
  border: 8px solid #f3f3f3; /* Light gray background */
  border-top: 8px solid #3498db; /* Blue color */
  border-radius: 50%;
  width: 60px; /* Size of the spinner */
  height: 60px; /* Size of the spinner */
  animation: spin 1s linear infinite; /* Spin animation */
}
</style>
