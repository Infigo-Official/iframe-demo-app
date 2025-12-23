<template>
  <section class="hero pink-background block">
    <div class="hero-body">
      <div class="container is-fluid container-fullwidth">
        <Title subtitle="Explore our Editor Iframe, choose a product"></Title>

        <form @submit.prevent="openIframeSubmit" id="iframe-form" v-if="!loading">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <div class="field" v-if="!canGoToBasket">
                  <div class="control is-expanded">
                    <label class="label">Product</label>
                    <div class="select">
                      <select v-model="iframeProductId" required @input="onProductChanged($event.target.value)">
                        <option disabled value="">Select a product</option>
                        <option v-for="product in products" :key="product.id" :value="product.id">
                          {{ product.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <div class="field is-flex is-justify-content-right">
                  <div class="control buttons">
                    <button type="submit" class="button is-dark-infigo" :disabled="!iframeProductId" v-if="!canGoToBasket && canDesign()">
                      Open Editor
                    </button>
                    <button type="button" class="button is-dark-infigo" @click="addToBasket" v-if="!canGoToBasket && !canDesign()">
                      Add to basket
                    </button>
                    <button type="button" class="button is-dark-infigo" @click="$router.push('/shopping-list')">
                      Go to basket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!canGoToBasket">
            <!-- Add checkboxes section -->
            <div class="field mb-4" v-if="isMultipartOrMegaEditProduct">
              <label class="label">Hide UI Elements</label>
              <p class="help mb-2">
                These settings are used in case the external app wants to control certain actions from Infigo
              </p>
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="hideAddToBasketButton" />
                  Hide add to basket button
                </label>
              </div>
            </div>

            <div v-if="getAttributes().length > 0">
              <div class="field mb-4">
                <label class="label">Product Attributes</label>
                <p class="help">
                  These product attributes are loaded from Infigo. The values set will be reflected in Infigo.
                </p>
              </div>

              <div class="attribute" v-for="attr in getAttributes()" :key="attr.name">
                <div class="control">
                  <label class="label">{{ attr.name }}</label>

                  <template v-if="attr.type == attributeTypes.TextBox">
                    <input class="input" type="text" :placeholder="attr.description"
                           @input="onAttributeChanged(attr.name, $event.target.value)"/>
                  </template>
                  <template v-else-if="attr.type == attributeTypes.Checkboxes">
                    <div class="checkboxes">
                      <label class="checkbox" v-for="value in attr.values" :key="value.id">
                        <input type="checkbox" :value="value.name"
                               @change="onAttributeChanged(attr.name, $event.target.value)"/>
                        {{ value.name }}
                      </label>
                    </div>
                  </template>
                  <template v-else-if="attr.type == attributeTypes.DropdownList">
                    <div class="select">
                      <select @change="onAttributeChanged(attr.name, $event.target.value)">
                        <option disabled value="">Select a value</option>
                        <option v-for="value in attr.values" :key="value.id" :value="value.name">
                          {{ value.name }}
                        </option>
                      </select>
                    </div>
                  </template>

                  <template v-else-if="attr.type == attributeTypes.RadioList">
                    <div class="radio-list">
                      <label class="radio" v-for="value in attr.values" :key="value.id">
                        <input type="radio"
                               :value="value.name"
                               :name="attr.name"
                               @change="onAttributeChanged(attr.name, $event.target.value)"/>
                        {{ value.name }}
                      </label>
                    </div>
                  </template>

                  <template v-else>
                    <input class="input"
                           type="text"
                           :placeholder="attr.description"
                           @input="onAttributeChanged(attr.name, $event.target.value)"/>
                  </template>
                </div>
              </div>
            </div>
          </div>

        </form>
        <div class="iframe" v-if="openIframe">
          <!-- Info box explaining external button functionality -->
          <div class="notification is-info is-light mb-4" v-if="showExternalButtons && !itemAddedToBasket">
            <p class="is-size-7 mb-2">
              <strong>External App Control Mode:</strong> The selected buttons are hidden inside the Infigo editor, allowing your external application to control these actions.
            </p>
            <div class="is-size-7" v-if="hideAddToBasketButton">
              <p class="mb-1"><strong>Add to Basket Flow:</strong></p>
              <ol class="ml-4 mb-2" style="list-style-type: decimal;">
                <li>Wait for <code>Infigo.JobChanged</code> event with <code>isCompleted: true</code></li>
                <li>Your external app calls <code>CatfishEditorCommunication.PostMessage()</code> with:
                  <ul class="ml-4 mt-1" style="list-style-type: disc;">
                    <li><strong>messageId:</strong> <code>'Infigo.ItemAddedToBasketFromIframe'</code></li>
                    <li><strong>data:</strong> No data object to be sent</li>
                    <li><strong>target_url:</strong> <code>'{protocol}://{host}'</code> (iframe domain)</li>
                    <li><strong>target:</strong> <code>iframeElement.contentWindow</code></li>
                  </ul>
                </li>
                <li>Infigo responds with <code>Infigo.ItemAddedToBasket</code> event containing job details</li>
              </ol>
              <p class="mb-0"><strong>Example:</strong></p>
              <pre class="has-background-dark has-text-light p-2 is-size-7" style="border-radius: 4px; overflow-x: auto;">CatfishEditorCommunication.PostMessage(
  'Infigo.ItemAddedToBasketFromIframe',
  '',
  'https://your-infigo-domain.com',
  document.getElementById('infigo-iframe').contentWindow
);</pre>
            </div>
          </div>

          <!-- External buttons shown when elements are hidden and job is completed - PLACED ON TOP -->
          <div class="field mb-4" v-if="showExternalButtons">
            <div class="control buttons">
              <button
                type="button"
                class="button is-dark-infigo"
                @click="handleExternalAddToBasket"
                v-if="hideAddToBasketButton && !itemAddedToBasket"
                :disabled="!isJobCompleted"
              >
                Add to Basket
              </button>
            </div>
          </div>

          <InfigoIframe :product-id="iframeProductId"
                        @iframe-loaded="iframeLoaded"
                        :attributes="attributeSelection"
                        :hide-elements="getHideElements()"
                        @item-added-to-basket="addDesignJob"
                        @job-changed="onJobChanged"
                        ref="infigoIframe"/>
        </div>
      </div>
    </div>
  </section>

  <InfigoLoading v-if="loading"></InfigoLoading>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ProductService from "@/services/api/product.service";
import {toast} from "vue3-toastify";
import InfigoIframe from "@/components/iframe/index.vue";
import ShoppingCartItemState from "@/services/cache/shopping-cart-item-state";
import InfigoLoading from "@/components/shared/loading.vue";
import type {
  InfigoProductAttributeValueInfo
} from "@infigo-official/types-for-api/src/models/InfigoProductAttributeValueInfo";
import Title from "@/components/layout/title.vue";
import {InfigoProductType} from "@/types/infigo-product.type";
import {BasketItem} from "@/types/demo/basket-item";
import {ShoppingCartItem} from "@/types/iframe/infigo-job-response.type";
import SessionState from "@/services/cache/session-state";

export default defineComponent({
  components: {
    Title,
    InfigoIframe: InfigoIframe,
    InfigoLoading: InfigoLoading
  },
  data() {
    return {
      loading: true,
      canGoToBasket: false,
      iframeProductId: null as number | null,
      products: [] as Array<ProductType>,
      openIframe: false,
      attributeTypes: InfigoAttributeType,
      attributeSelection: {} as Record<string, string>,
      hideAddToBasketButton: false,
      isJobCompleted: false,
      currentJobId: null as number | null,
      itemAddedToBasket: false
    };
  },
  computed: {
    showExternalButtons(): boolean {
      return this.openIframe && this.hideAddToBasketButton;
    },
    isMultipartOrMegaEditProduct(): boolean {
      if (!this.iframeProductId) {
        return false;
      }
      const selectedProduct = this.products.find(q => q.id == this.iframeProductId);
      return selectedProduct?.type === InfigoProductType.MultiPart ||
             selectedProduct?.type === InfigoProductType.Dynamic;
    }
  },
  async created() { // Make created method async
    await this.init();
  },
  methods: {
    getAttributes() {
      if (!this.iframeProductId) {
        return [];
      }

      return this.products?.find(q => q.id == this.iframeProductId)?.attributes ?? [];
    },
    onAttributeChanged(name: string, value: string) {
      this.attributeSelection[name] = value;
    },
    onProductChanged(productId: number) {
      this.attributeSelection = {};

      const selectedProduct = this.products.find(q => q.id == productId);
      if (!selectedProduct) {
        return;
      }

      selectedProduct.attributes.forEach(attr => {
        if (attr.values.length > 0) {
          this.attributeSelection[attr.name] = attr.values.find(q => q.isDefault == true)?.name ?? attr.values[0]?.name;
        }
      });
    },
    async init() {
      try {
        const productsResponse = await ProductService.getAll();

        const supportedProductTypes = [InfigoProductType.Dynamic, InfigoProductType.Static, InfigoProductType.Normal, InfigoProductType.MultiPart];

        this.products = productsResponse.data
            .filter(it => supportedProductTypes.includes(it.Type as number))
            .map(it => {
              return {
                id: it.Id as number,
                name: it.Name as string,
                type: (it.Type as number) as InfigoProductType,
                thumbnailUrls: it.ThumbnailUrls,
                attributes: it?.ProductAttributes
                    ?.filter(q => !q.Name?.startsWith("Catfish_"))
                    ?.map((q: any) => {
                      return {
                        name: q.Name,
                        description: q.Description,
                        type: q.AttributeControlType,
                        values: q.ProductAttributeValues?.map((v: InfigoProductAttributeValueInfo) => {
                          return {
                            id: v.Id,
                            name: v.Name,
                            isDefault: v.IsPreSelected
                          }
                        }) ?? []
                      } as AttributeType
                    }) ?? []
              } as ProductType
            });

      } catch (err) {
        console.log(err);
        toast("Error loading products", {
          type: "error"
        });
      } finally {
        this.loading = false; // Hide loading overlay once data is fetched
      }
    },
    canDesign() {
      const selectedProduct = this.products.find(q => q.id == this.iframeProductId);

      if (!selectedProduct) {
        return;
      }

      const allowedToDesign = [InfigoProductType.Dynamic, InfigoProductType.MultiPart];
      return allowedToDesign.includes(selectedProduct.type);
    },
    addToBasket(){
      debugger;
      const selectedProduct = this.products.find(q => q.id == this.iframeProductId);
      if (!selectedProduct) {
        toast("Product not found", {position: "top-right", type: "error"});
        return;
      }

      const basketItems = ShoppingCartItemState.loadCartFromLocalStorage();
      const index = basketItems.findIndex((it) => it.productId == selectedProduct.id);
      if (index > -1){
        const existingItemInBasket = basketItems[index];
        existingItemInBasket.quantity += 1;
        ShoppingCartItemState.updateItem(index, existingItemInBasket);
        toast.success(`Quantity updated with success for ${selectedProduct.name}`, {position: "top-right"});

        setTimeout(() => {
          this.$router.push("/shopping-list");
        }, 1000);

        return;
      }

      const newItemBasket: BasketItem = {
        jobId:  "",
        quantity: 1,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productSKU: selectedProduct.name,
        productType: selectedProduct.type,
        thumbnailUrls: selectedProduct.thumbnailUrls,
        customerGuid: SessionState.customerId ?? "",
      }

      ShoppingCartItemState.addItem(newItemBasket);

      toast.success("Item added to basket", {position: "top-right"});
      setTimeout(() => {
        this.$router.push("/shopping-list");
      }, 1000);
    },
    openIframeSubmit() {
      if (this.openIframe) {
        this.init();
      }
      this.openIframe = true;
      this.loading = true;
      this.canGoToBasket = true;
    },
    iframeLoaded() {
      this.loading = false;
    },
    addDesignJob(item: ShoppingCartItem) {
      console.log("Item added to basket:", item);
      const newItemBasket: BasketItem = {
        jobId: item.Job.Id,
        quantity: item.Job.Quantity,
        productId: item.Product.Id,
        productName: item.Product.Name,
        productSKU: item.Product.Sku,
        productType: InfigoProductType.Dynamic,
        thumbnailUrls: item.Images.Thumbnails,
        customerGuid: item.Customer.Guid,
      }

      ShoppingCartItemState.addItem(newItemBasket);
      this.canGoToBasket = true;
      this.itemAddedToBasket = true;
    },
    getHideElements(): string[] {
      const elements: string[] = [];
      if (this.hideAddToBasketButton) {
        elements.push('addToBasket');
      }
      return elements;
    },
    onJobChanged(data: any) {
      console.log('Job changed:', data);
      this.isJobCompleted = data.isCompleted || false;
      this.currentJobId = data.jobId || null;
    },
    handleExternalAddToBasket() {
      const iframe = this.$refs.infigoIframe as any;
      if (iframe && iframe.triggerExternalAddToBasket) {
        iframe.triggerExternalAddToBasket();
      }
    }
  }
});

enum InfigoAttributeType {
  DropdownList = 1,
  RadioList = 2,
  Checkboxes = 3,
  TextBox = 4,
  MultilineTextbox = 10,
  Datepicker = 20,
  FileUpload = 30,
  Info = 40,
  HtmlSchema = 50,
  System = 60,
  Hidden = 999
}

interface AttributeType{
  name: string;
  description: string;
  type: InfigoAttributeType;
  values: {id: number, name: string, isDefault: boolean}[]
}

interface ProductType {
  id: number;
  name: string;
  attributes: AttributeType[],
  type: InfigoProductType,
  thumbnailUrls: string[]
}

</script>

<style scoped>

</style>
