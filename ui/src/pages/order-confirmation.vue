<template>
  <section class="hero pink-background block">
    <div class="hero-body">
      <div class="container is-fluid container-fullwidth">
        <Title
            title="Order Place Confirmation Page"
            subtitle="Thank you for your order!"></Title>

        <div class="content-container block">
          <pre class="json-display">{{ orderDetails }}</pre>
        </div>

        <div class="content-container block has-text-centered mt-4">
          <button class="button is-dark-infigo" @click="$router.push('/shopping-list')">Go to Basket</button>
        </div>
      </div>
    </div>
  </section>

  <infigo-loading v-if="loading"></infigo-loading>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {toast} from "vue3-toastify";
import OrderService from "@/services/api/order.service";
import orderService from "@/services/api/order.service";
import InfigoLoading from "@/components/shared/loading.vue";
import Title from "@/components/layout/title.vue";

export default defineComponent({
  data() {
    return {
      orderDetails: {},
      loading: true
    };
  },
  components: {
    Title,
    InfigoLoading: InfigoLoading
  },
  mounted() {
    const orderId = this.$route.params.id || null;

    if (!orderId){
      toast('Order not found', {position: 'top-right', type: 'error'});
      return;
    }

    this.loading = true;

    OrderService.getOrderById(+orderId || -1)
        .then(it => {
          this.orderDetails = it.data;
        })
        .catch((error) => {
          toast('Order not found', {position: 'top-right', type: 'error'});
          console.log(error);
          return;
        })
        .finally(() => {
          this.loading = false;
        });
  }
});
</script>

<style scoped>
</style>
