<template>
  <div id="app">
    <Navbar/>
    <div class="container mt-5">
      <router-view/>
    </div>
  </div>

  <Footer></Footer>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Footer from "@/components/layout/footer.vue";
import Navbar from "@/components/layout/navbar.vue";

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    Footer: Footer
  }
});
</script>

<style>
/* Additional margin for the top to look clean */
.mt-5 {
  margin-top: 3rem;
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.container-fullwidth {
  width: 100%;
  margin: 0; /* Remove default margins */
}

html {
  background: rgb(228, 234, 236) !important;
}

.box {
  background-color: rgb(228, 234, 236) !important;
}

.navbar-brand img#image-logo {
  width: auto;
  height: 30px;
  padding: 10px;
  box-sizing: content-box;
}

.is-dark {
  background: #002e47 !important;
}

section.footer {
  margin-top: 2rem;
  width: 100%;
}

.button {
  border-radius: 0px !important;
}

.button.is-primary {
  background: #FF6867 !important;
  color: white !important;
}

.button.is-primary:hover {
  background: inherit !important;
}

.title, p, span, h1, h2, h3, h4, .navbar-link:not(.is-arrowless):after, .select:not(.is-multiple):not(.is-loading):after, label {
  color: #0f2e47 !important;
}

.navbar-link:not(.is-arrowless):after, .select:not(.is-multiple):not(.is-loading):after {
  border-color: black !important;
}

.white-text,
.footer a {
  color: white !important;
}

.input, .select select, .textarea, input {
  background: transparent !important;
  color: #0f2e47 !important;
  border-radius: 0 !important;
}

button.button.is-dark-infigo {
  background: #0f2e47;
  color: white;
}

select {
  background: transparent !important;
  border: 1px solid black !important;
  box-shadow: none !important;
  border-radius: 0px !important;
}

strong {
  color: inherit !important;
}

pre.editor-event {
  margin: .5rem 0;
}

.box:hover {
  transform: none !important;
}

.container {
  max-width: 90% !important;
}

img.thumbnail {
  width: auto !important;
  height: 200px !important;
  margin: 0px !important
}

.thumbnail-cont {
  text-align: center;
}

.column.details-side .box {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}

.continue.buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.hidden {
  display: none !important;
}

.columns.bottom-buttons {
  display: flex;
  justify-content: space-around;
}

.select select, .select {
  width: 100%;
}

.input:focus, .input:focus-within, .is-focused.input, .is-focused.textarea, .select select.is-focused, .select select:focus, .select select:focus-within, .textarea:focus, .textarea:focus-within {
  border-color: black;
  box-shadow: none;
}

</style>
