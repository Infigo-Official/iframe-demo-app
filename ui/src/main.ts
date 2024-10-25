import {createApp} from "vue";
import App from "@/App.vue";
import "bulma/css/bulma.min.css";
import "vue3-toastify/dist/index.css";
import router from "@/router";
import '@/router/permissions'

createApp(App).use(router).mount("#app");
