<template>
  <section class="hero pink-background block">
    <div class="hero-body">
      <div class="container is-fluid container-fullwidth">
        <Title subtitle="Edit Options - change product attributes"></Title>

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

        <div class="iframe" v-if="iframeSrc">
          <iframe
            id="edit-options-iframe"
            width="100%"
            height="800px"
            scrolling="no"
            frameborder="0"
            class="infigo-main-editor is-clipped"
            :src="iframeSrc"
          ></iframe>
        </div>
      </div>
    </div>
  </section>

  <InfigoLoading v-if="loading"></InfigoLoading>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { toast } from "vue3-toastify";
import SessionState from "@/services/cache/session-state";
import CustomerService from "@/services/api/customer.service";
import ShoppingCartItemState from "@/services/cache/shopping-cart-item-state";
import CatfishEditorCommunication from "@/services/catfish-editor-communication";
import InfigoLoading from "@/components/shared/loading.vue";
import Title from "@/components/layout/title.vue";
import { ShoppingCartItem } from "@/types/iframe/infigo-job-response.type";
import { BasketItem } from "@/types/demo/basket-item";

export default defineComponent({
  components: {
    Title,
    InfigoLoading,
  },
  data() {
    return {
      loading: true,
      iframeSrc: "",
      productId: null as number | null,
      jobId: null as string | null,
      destroyCallback: null as any,
    };
  },
  mounted() {
    this.productId = Number(this.$route.params.productId) || null;
    this.jobId = (this.$route.params.jobId as string) || null;

    if (!this.productId || !this.jobId) {
      toast("Product ID and Job ID are required", { position: "top-right", type: "error" });
      this.$router.push("/shopping-list");
      return;
    }

    console.log("[EditOptions] Mounted with productId:", this.productId, "jobId:", this.jobId);
    this.loadProductPage();
  },
  unmounted() {
    if (this.destroyCallback) {
      this.destroyCallback();
    }
  },
  methods: {
    async loadProductPage() {
      const platformUrl = SessionState.platformUrl;
      const customerId = SessionState.customerId;

      if (!platformUrl || !customerId) {
        toast.error("Platform URL and Customer ID are required");
        return;
      }

      const urlObj = new URL(platformUrl);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

      try {
        const storefrontPath = this.extractStorefrontPath(platformUrl);
        const parentOrigin = window.location.origin;
        const productPageUrl = `${storefrontPath}/p/${this.productId}?jobId=${this.jobId}&editOptions=true&enableEditOptions=true&bMode=Iframe&bUrl=${encodeURIComponent(parentOrigin)}`;

        console.log("[EditOptions] Storefront path:", storefrontPath);
        console.log("[EditOptions] Product page URL:", productPageUrl);

        // Get SSO URL the same way the editor does
        const ssoResponse = await CustomerService.getSSOUrl(customerId, productPageUrl);
        const loginUrl = ssoResponse.data.LoginUrl || "";

        console.log("[EditOptions] SSO LoginUrl:", loginUrl);

        this.iframeSrc = `${baseUrl}${loginUrl}`;
        console.log("[EditOptions] Final iframe src:", this.iframeSrc);

        this.loading = false;
        this.attachCommunicator(baseUrl);
      } catch (e) {
        console.error("[EditOptions] Failed to load product page", e);
        toast.error("Failed to load product page");
        this.loading = false;
      }
    },
    extractStorefrontPath(platformUrl: string): string {
      const urlObj = new URL(platformUrl);
      // e.g. https://catfish.infigosoftware.com/iframe -> /iframe
      return urlObj.pathname.replace(/\/+$/, '');
    },
    attachCommunicator(baseUrl: string) {
      this.destroyCallback = CatfishEditorCommunication.RegisterForCatfishEditorEvent(
        (method: string, data: any) => {
          console.log("[EditOptions] Received message:", method, data);
          switch (method) {
            case CatfishEditorCommunication.MessageConstants.InfigoItemAddedToBasket:
            case CatfishEditorCommunication.MessageConstants.InfigoItemAddedToSavedProjects:
              this.onItemAddedToBasket(data as ShoppingCartItem);
              break;
            default:
              break;
          }
        },
        baseUrl
      );
    },
    onItemAddedToBasket(item: ShoppingCartItem) {
      console.log("[EditOptions] Item added to basket:", item);
      const existingItems = ShoppingCartItemState.loadCartFromLocalStorage();
      const index = existingItems.findIndex((it) => it.jobId == this.jobId);

      if (index < 0) {
        toast.error("Could not find the original basket item to update");
        return;
      }

        ...existingItems[index],
        jobId: item.Job.Id || existingItems[index].jobId,
        quantity: item.Job.Quantity,
        productName: item.Product.Name,
        productSKU: item.Product.Sku,
        thumbnailUrls: item.Images.Thumbnails,
        customerGuid: item.Customer.Guid,
      };

      ShoppingCartItemState.updateItem(index, updatedItem);

      toast.success("Item updated successfully, redirecting to basket...", { position: "top-right" });
      setTimeout(() => {
        this.$router.push("/shopping-list");
      }, 1000);
    },
  },
});
</script>

<style scoped></style>
