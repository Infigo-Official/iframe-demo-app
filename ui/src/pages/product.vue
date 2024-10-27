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
                      <select v-model="iframeProductId" required @input="onProductChanged">
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
                    <button type="submit" class="button is-dark-infigo" :disabled="!iframeProductId" v-if="!canGoToBasket">
                      Open Editor
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

        </form>
        <div class="iframe" v-if="openIframe">
          <InfigoIframe :product-id="iframeProductId"
                        @iframe-loaded="iframeLoaded"
                        :attributes="attributeSelection"
                        @item-added-to-basket="addDesignJob"/>
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
      attributeSelection: {} as Record<string, string>
    };
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

        this.products = productsResponse.data
            .filter(it => it.Type == (+InfigoProductType.Dynamic))
            .map(it => {
              return {
                id: it.Id as number,
                name: it.Name as string,
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
  attributes: AttributeType[]
}

</script>

<style scoped>

</style>
