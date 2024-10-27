<template>
  <div class="mt-5">
    <div class="pt-5">
      <div class="columns">
        <div class="column is-paddingless is-9" v-if="showIframe">
          <iframe
              id="infigo-product-editor"
              width="100%"
              height="800px"
              scrolling="no"
              frameborder="0"
              class="infigo-main-editor is-clipped"
              :src="iframeEditorSrc"
          ></iframe>
        </div>
        <div class="column is-paddingless">
          <Events :events="events"></Events>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import SessionState from "@/services/cache/session-state";
import {ShoppingCartItem} from "@/types/iframe/infigo-job-response.type";
import {toast} from "vue3-toastify";
import JobService from "@/services/api/job.service";
import CustomerService from "@/services/api/customer.service";
import CatfishEditorCommunication from "@/services/catfish-editor-communication";
import Events from "@/components/iframe/events.vue";

const Communicator = {
  Attach(baseUrl: string, attributes: AttributesInfo, addedToBasketCallback: (item: ShoppingCartItem) => void, eventCallback: (method: string, data: any) => void) {
    var urlObj = new URL(baseUrl);

    var domain = urlObj.protocol + "//" + urlObj.host;

    var iframeEl = document.getElementById("infigo-product-editor") as any;

    var callBack = CatfishEditorCommunication.RegisterForCatfishEditorEvent(function (method, dData) {
      eventCallback(method, dData);
      switch (method) {
        case CatfishEditorCommunication.MessageConstants.InfigoItemAddedToBasket:
        case CatfishEditorCommunication.MessageConstants.InfigoItemAddedToSavedProjects:
          addedToBasketCallback(dData as ShoppingCartItem);

          toast("Job saved with success, please go to basket to place order", {
            type: "success",
          });
          break;
        case CatfishEditorCommunication.MessageConstants.EditorLoaded:
          CatfishEditorCommunication.PostMessage('ExternalDataUpdate', JSON.stringify(attributes), domain, iframeEl?.contentWindow || null);
          break;
        default:
          break;
      }
    }, domain);

    document.getElementById('infigo-product-editor')?.addEventListener('load', function () {
      CatfishEditorCommunication.RegisterForKeyboardInteraction("infigo-product-editor", domain);
    });

    return callBack;
  },
};

export default defineComponent({
  components: {Events},
  props: {
    productId: Number,
    jobId: String,
    attributes: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({}),
    }
  },
  emits: ['iframe-loaded', 'item-added-to-basket'],
  data() {
    return {
      iframeCustomerGuid: SessionState.customerId,
      loading: false,
      iframeEditorSrc: "",
      events: [] as Array<{ method: string; data: any }>,
      destroyCallback: null as any,
      showIframe: true,
    };
  },
  created() {
    this.openIframe();
    this.scrollToIframe();
  },
  unmounted() {
    if (this.destroyCallback) {
      this.destroyCallback();
    }
  },
  methods: {
    transformAttributes(): AttributesInfo {
      const attributes = this.attributes as any;
      return {
        attributes: Object.entries(attributes).map(([key, value]) => ({name: key, value} as Attribute))
      }
    },
    async openIframe() {
      this.loading = true;
      this.events.push({method: "Starting editor", data: null})

      if (!this.productId) {
        toast.error('Product ID is required');
        return;
      }

      if (!this.iframeCustomerGuid) {
        toast.error("Customer ID is required");
        return;
      }

      try {
        const baseUrl = SessionState.platformUrl as string;
        const editorLinkFor = await JobService.getLinkForEditor(this.iframeCustomerGuid, this.productId, this.jobId || null);
        CustomerService.getSSOUrl(this.iframeCustomerGuid, editorLinkFor)
            .then(it => {
              this.iframeEditorSrc = this.prepareIframeUrl(baseUrl, it.data.LoginUrl || '');
              this.loading = false;

              //We will destroy old iframe communicator in case if exists, as this is attached with a specific product/job/url
              // So in this case we destroy all the previous callbacks and attach new one
              if (this.destroyCallback) {
                this.destroyCallback();
              }

              const attributes = this.transformAttributes();
              console.log('attributes', attributes);

              console.log('callback exists', this.destroyCallback);

              this.destroyCallback = Communicator.Attach(baseUrl, attributes, (item: ShoppingCartItem) => {
                const sci = item as ShoppingCartItem;
                sci.Product.Id = this.productId || -1;
                this.$emit('item-added-to-basket', sci);
                this.showIframe = false;
              }, this.eventCallback);

              this.$emit('iframe-loaded');
            })
            .catch((e) => {
              toast.error('Failed to get link for editor');
              console.log(e);
              return;
            });
      } catch (e) {
        toast.error('Failed to get link for editor');
        console.log(e);
        return;
      }
    },
    prepareIframeUrl(baseUrl: string, editorUrl: string | null) {
      const urlObj = new URL(baseUrl);
      return `${urlObj.protocol}//${urlObj.host}${editorUrl}`;
    },
    scrollToIframe() {
      setTimeout(() => {
        const iframe = document.getElementById("infigo-product-editor");
        if (iframe) {
          iframe.scrollIntoView();
        }
      }, 0);
    },
    eventCallback(method: string, data: any) {
      this.events.push({method, data});
    },
  },
});

export interface AttributesInfo {
  attributes: Attribute[]
}

export interface Attribute {
  name: string;
  value: string;
}
</script>
