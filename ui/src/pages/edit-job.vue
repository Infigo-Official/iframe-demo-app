<template>
  <section class="hero pink-background block">
    <div class="hero-body">
      <div class="container is-fluid container-fullwidth">
        <Title subtitle="Explore our Editor Iframe, edit job"></Title>

        <div class="field is-flex is-justify-content-right">
          <div class="control buttons">
            <button
              type="button"
              class="button is-dark-infigo"
              @click="$router.push('/shopping-list')"
            >
              Go to basket
            </button>
          </div>
        </div>
        <div class="iframe" v-if="openIframe">
          <InfigoIframe
            :product-id="iframeProductId"
            :job-id="jobId"
            @iframe-loaded="iframeLoaded"
            @item-added-to-basket="addToBasket"
          />
        </div>
      </div>
    </div>
  </section>

  <InfigoLoading v-if="loading"></InfigoLoading>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { toast } from "vue3-toastify";
import InfigoIframe from "@/components/iframe/index.vue";
import { ShoppingCartItem } from "@/types/iframe/infigo-job-response.type";
import ShoppingCartItemState from "@/services/cache/shopping-cart-item-state";
import InfigoLoading from "@/components/shared/loading.vue";
import Title from "@/components/layout/title.vue";

export default defineComponent({
  components: {
    Title,
    InfigoIframe: InfigoIframe,
    InfigoLoading: InfigoLoading,
  },
  data() {
    return {
      loading: true, // Initially set loading to true
      canGoToBasket: false,
      openIframe: false,
      iframeProductId: null as number | null,
      jobId: null as string | null,
      products: [] as Array<{ id: number; name: string }>, // Store products here
    };
  },
  mounted() {
    const jobId = this.$route.params.id || null;

    if (!jobId) {
      toast("Job not found", { position: "top-right", type: "error" });
      this.$router.push("/shopping-list");
      return;
    }

    ShoppingCartItemState.loadCartFromLocalStorage();
    const items = ShoppingCartItemState.getCartItems();

    const item = items.find((it) => it.Job.Id == jobId);

    if (!item) {
      toast("Job not found in basket", {
        position: "top-right",
        type: "error",
      });
      this.$router.push("/shopping-list");
      return;
    }

    this.jobId = jobId.toString() || null;
    this.iframeProductId = item.Product.Id;
    this.openIframe = true;
  },
  methods: {
    openIframeSubmit() {
      this.loading = true;
    },
    iframeLoaded() {
      this.loading = false;
    },
    addToBasket(item: ShoppingCartItem) {
      const existingItems = ShoppingCartItemState.loadCartFromLocalStorage();

      const index = existingItems.findIndex((it) => it.Job.Id == item.Job.Id);

      if (index < 0) {
        alert(`Failed to save item to basket - ${item.Job.Id}`);
        return;
      }

      ShoppingCartItemState.updateItem(index, item);
    },
  },
});
</script>

<style scoped></style>
