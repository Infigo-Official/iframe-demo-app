<template>
  <nav class="navbar is-dark">
    <div class="navbar-brand">
      <img id="image-logo" src="https://resources.public.infigosoftware.rocks/logo/infigo-logo-white.svg"
           alt="Infigo Logo" height="100px" width="100px" class="sl-image">
    </div>

    <div id="navbarMenu" class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/setup" class="navbar-item">Setup</router-link>
        <router-link to="/product" class="navbar-item">Design a job</router-link>
        <router-link to="/shopping-list" class="navbar-item">Shopping Cart</router-link>
        <router-link to="/documentation" class="navbar-item">Iframe documentation</router-link>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({});
</script>
