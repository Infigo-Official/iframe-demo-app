<template>
  <div class="container">
    <Title></Title>

    <h1 class="title is-3">Setup</h1>
    <form @submit.prevent="saveSetup">
      <!-- Platform URL -->
      <div class="field">
        <label class="label">Infigo Platform URL:</label>
        <div class="control">
          <input
            class="input"
            type="url"
            v-model="platformUrl"
            required
            placeholder="Enter platform URL"
          />
        </div>
        <p class="help is-danger" v-if="!platformUrl && submitted">
          Platform URL is required
        </p>
      </div>

      <!-- API Token -->
      <div class="field">
        <label class="label">API Token:</label>
        <div class="control">
          <input
            class="input"
            type="password"
            v-model="apiToken"
            required
            placeholder="Enter API token"
          />
        </div>
        <p class="help is-danger" v-if="!apiToken && submitted">
          API Token is required
        </p>
      </div>

      <!-- Submit Button -->
      <div class="field">
        <div class="control">
          <button type="submit" class="button is-primary">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SessionService from "@/services/cache/session-state";
import AuthService from "@/services/api/auth.service";
import { toast } from "vue3-toastify";
import Title from "@/components/layout/title.vue";

export default defineComponent({
  components: {
    Title: Title,
  },
  data() {
    return {
      platformUrl: "" as string | null,
      apiToken: "" as string | null,
      submitted: false,
    };
  },
  methods: {
    async saveSetup() {
      this.submitted = true;
      if (this.platformUrl && this.apiToken) {
        const isValid = await AuthService.isAuthenticated(
          this.platformUrl,
          this.apiToken,
        );

        if (!isValid) {
          toast.error("Invalid credentials, please check connection!");

          return;
        }

        // For simplicity instead of using Vuex, we will use SessionService to store the state in local storage
        SessionService.saveState(this.platformUrl, this.apiToken);

        toast.info("Connection succeeded!");

        setTimeout(() => {
          this.$router.push("/product");
        }, 1000);
      }
    },
  },
  created() {
    if (!SessionService.isSetupValid()) {
      SessionService.clearState();
      return;
    }

    this.platformUrl = SessionService.platformUrl;
    this.apiToken = SessionService.apiToken;
  },
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 2rem;
}
</style>
