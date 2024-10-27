<template>
  <div class="container">
    <h1 class="title is-2 has-text-centered">Shopping Cart</h1>

    <div
      class="errors"
      v-if="placeOrderIssues.length > 0"
      id="notification-errors"
    >
      <div class="title">Place order errors:</div>
      <div
        v-for="(issue, index) in placeOrderIssues"
        :key="index"
        class="notification is-danger"
      >
        {{ issue }}
      </div>
    </div>

    <!-- Check if there are any cart items -->
    <div v-if="cartItems.length > 0" class="basket" id="basket">
      <div class="columns is-multiline">
        <div class="column is-6">
          <div
        v-for="(item, index) in cartItems"
        :key="index"
        class="box has-background-light"
      >
        <div class="columns is-multiline">
          <div class="column thumbnail-cont"><img
              :src="getThumbUrl(item.thumbnailUrls[0])"
              alt="Thumbnail"
              class="thumbnail"
          /></div>
          <div class="column">
          <div class="item-details">
            <h2 class="title is-4">{{ item.productName }}</h2>
            <p class="subtitle is-6">{{ item.productSKU }}</p>
            <div class="field">
              <label class="label">Quantity</label>
              <div class="control">
                <input
                  type="number"
                  @input="onQuantityChange(index, $event)"
                  v-model.number="item.quantity"
                  min="1"
                  class="input"
                />
              </div>
            </div>
            <div class="field">
              <div class="buttons">
                <button @click="editItem(index)" class="button is-info is-small" v-if="canEditJob(index)">
                  Edit
                </button>
                <button @click="getOutput(index)" class="button is-info is-small" v-if="canCreateOutput(index)">
                  Create Output
                </button>
                <button @click="removeItem(index)" class="button is-danger is-small">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
        </div>

        <div class="column details-side">
          <div class="box has-background-light">
            <div class="field">
              <label class="label">PO Number</label>
              <div class="control">
                <input
                    type="text"
                    v-model="poNumber"
                    class="input"
                    placeholder="Enter PO Number"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Delivery Method</label>
              <div class="control">
                <input type="text" v-model="deliveryMethod" class="input" />
              </div>
            </div>

            <div class="field">
              <label class="label">External Order ID</label>
              <div class="control">
                <input type="text" v-model="externalOrderId" class="input" readonly />
              </div>
            </div>
            <div class="continue buttons">


              <button
                  @click="clearCart"
                  class="button is-warning"
                  :disabled="loading"
              >
                Clear All Items
              </button>

              <button
                  @click="continueCart"
                  class="button is-success"
                  :disabled="loading"
              >
                Continue Order
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- No cart items -->
    <div v-else class="has-text-centered">
      <p class="has-text-danger">
        No items in the shopping cart. Redirecting to product page...
      </p>
    </div>

    <div class="hidden" id="details" v-if="cartItems.length > 0">
      <div class="columns details">
      <div class="column">
        <h1 class="title is-2 has-text-centered">Billing address</h1>
        <Address
          :address="billingAddress"
          @address-change="onBillingAddressChange"
        ></Address>
      </div>
      <div class="column">
        <h1 class="title is-2 has-text-centered">Shipping address</h1>
        <Address
          :address="shippingAddress"
          @address-change="onShippingAddressChange"
        ></Address>
      </div>
        </div>
      <div class="columns bottom-buttons">
        <div class="column is-12">
          <div class="buttons is-centered mt-4">
            <button
                @click="continueCart"
                class="button is-success"
                :disabled="loading"
            >
              Back
            </button>
            <button
                @click="placeOrder"
                class="button is-success"
                :disabled="loading"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <InfigoLoading v-if="loading"></InfigoLoading>
</template>

<script lang="ts">
import {defineComponent, nextTick} from "vue";
import ShoppingCartItemService from "@/services/cache/shopping-cart-item-state";
import ShoppingCartItemState from "@/services/cache/shopping-cart-item-state";
import SessionState from "@/services/cache/session-state";
import Address from "@/components/order/address.vue";
import AddressState from "@/services/cache/address-state";
import OrderService from "@/services/api/order.service";
import {toast} from "vue3-toastify";
import InfigoLoading from "@/components/shared/loading.vue";
import {AxiosError} from "axios";
import {InfigoApiResponseObjectModel} from "@infigo-official/types-for-api/src/index";
import CustomerService from "@/services/api/customer.service";
import JobService from "@/services/api/job.service";
import {OrderRequest} from "@/types/order-request";
import PoolService from "@/services/pool-service";
import {addToQueryString} from "@/utils/url";
import {InfigoProductType} from "@/types/infigo-product.type";

export default defineComponent({
  components: {
    InfigoLoading: InfigoLoading,
    Address: Address,
  },
  data() {
    return {
      cartItems: ShoppingCartItemState.loadCartFromLocalStorage(),
      billingAddress: AddressState.getBillingAddress(),
      shippingAddress: AddressState.getShippingAddress(),
      poNumber: "", // Field for PO Number
      deliveryMethod: "First class", // Default delivery method
      externalOrderId: new Date().getTime().toString(), // Default to current timestamp,
      loading: false,
      customerId: SessionState.customerId,
      placeOrderIssues: [] as string[],
    };
  },
  methods: {
    //remove or improve dw
    continueCart(): void {
      const cartElement: HTMLElement | null = document.getElementById('details');
      const basketElement: HTMLElement | null = document.getElementById('basket');

      if (cartElement && basketElement) {
        cartElement.classList.toggle('hidden');
        basketElement.classList.toggle('hidden');
      } else {
        console.error("Cart element not found.");
      }
    },
    canEditJob(index: number): boolean {
      const item = this.cartItems[index];
      return item.productType == InfigoProductType.Dynamic;
    },
    canCreateOutput(index: number): boolean {
      const item = this.cartItems[index];
      return item.productType == InfigoProductType.Dynamic;
    },
    editItem(index: number) {
      const item = this.cartItems[index];
      this.$router.push(`/edit/${item.jobId}`);
    },
    async poolInternal(
        callbackUrl: string,
      interval: number,
      retries: number,
    ): Promise<boolean> {
      try {
        await PoolService.pool(callbackUrl);
        return true; // Return the successful response data
      } catch (error) {
        console.error("Request failed:", error.message);
        if (retries > 0) {
          console.log(`Retrying in ${interval} ms...`);
          await new Promise((resolve) => setTimeout(resolve, interval)); // Wait for the specified interval
          return this.poolInternal(callbackUrl, interval, retries - 1); // Retry the request
        } else {
          console.error("Max retries reached. Exiting...");
          throw error; // Throw the error if max retries are reached
        }
      }
    },
    pool(callbackUrl: string): Promise<boolean> {
      const pollingInterval = 2000; // Time to wait between requests (in milliseconds)
      const maxRetries = 300; // Maximum number of retries

      return this.poolInternal(callbackUrl, pollingInterval, maxRetries);
    },
    getOutput(index: number) {
      const item = this.cartItems[index];
      this.loading = true;
      const uniqueId = Date.now().toString();

      const callbackUrl = PoolService.generateCallbackUrl(uniqueId);

      JobService.createOutput(item.jobId || '', callbackUrl)
        .then((it) => {
          console.log("Output created triggered", it.data);
          const pool = this.pool(callbackUrl).then((it) => {
            JobService.getOutput(item.jobId || '').catch((err) => {
              console.error("Error getting output", err);
              toast(`Error getting output: ${err.message}`, {
                type: "error",
              });
            });
          });
          // const output = JobService.getOutput(item.Job.Id)

          toast.promise(pool, {
            pending: "Creating output...",
            success: "Output created successfully",
            error: "Error creating output",
          });
        })
        .catch((err) => {
          console.error("Error creating output", err);
          toast(`Error creating output: ${err.message}`, {
            type: "error",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    removeItem(index: number) {
      ShoppingCartItemService.removeItem(index);
      this.cartItems = [];

      this.cartItems = [...ShoppingCartItemService.getCartItems()];
    },
    clearCart() {
      this.cartItems = [];
      ShoppingCartItemService.clearCart();
    },
    placeOrder() {
      this.loading = true;
      this.placeOrderIssues = [];

      const addErrors = (errors: string[]) => {
        this.placeOrderIssues = this.placeOrderIssues.concat(errors);

        nextTick(() => {
          //scroll to notification-errors
          const element = document.getElementById("notification-errors");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        })
      };

      const customerIds = [
        ...new Set(this.cartItems.map((it) => it.customerGuid)),
      ];
      const migrateCustomerIds = customerIds.filter(
        (it) => it !== this.customerId,
      );

      let failed = false;
      migrateCustomerIds.forEach((customerGuid) => {
        if (failed) {
          return;
        }

        CustomerService.migrateItems(customerGuid, this.customerId || "")
          .then((it) => {
            toast.info('Items migrated successfully');
          })
          .catch((err) => {
            failed = true;
            console.error("Error migrating items", err);
            toast(`Error migrating items: ${err.message}`, {
              type: "error",
            });
          });
      });

      if (failed) {
        this.loading = false;
        return;
      }

      const orderRequest = new OrderRequest(this.billingAddress, this.shippingAddress, this.externalOrderId, this.customerId, this.deliveryMethod, this.poNumber, this.cartItems);

      OrderService.placeOrder(orderRequest)
        .then((it) => {
          console.log("Order placed with success", it.data.Success);
          if (!it.data.Success) {
            addErrors(
              it.data.ContextInfo?.ErrorList?.map(
                (q) => q.ErrorMessage || "",
              ) ?? [],
            );
            return;
          }

          const infigoOrderId = (it as any).data["CatfishOrderId"];

          toast(
            `Order placed successfully - infigo order id ${infigoOrderId}`,
            {
              type: "success",
            },
          );

          this.clearCart(); // Clear the cart after placing the order
          this.$router.push("/order/" + infigoOrderId); // Redirect to order confirmation page after placing the order
        })
        .catch((err) => {
          const errors = err as AxiosError<InfigoApiResponseObjectModel>;

          const response =
            (errors?.response?.data as InfigoApiResponseObjectModel) || {};

          if (!response.Success) {
            addErrors(
              response.ContextInfo?.ErrorList?.map(
                (q) => q.ErrorMessage || "",
              ) ?? [],
            );
          }

          console.error("Error", errors);
          toast.error(`Error placing order: ${errors.message}`);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getThumbUrl(thumb: string) {
      const baseUrl = SessionState.platformUrl;
      const origin = new URL(baseUrl || "").origin;

      let url =`${origin}/${thumb}`;

      // add a timestamp to force browser to retrieve always the latest artwork from Infigo
      return addToQueryString(url, 'timestamp', Date.now().toString());
    },
    onQuantityChange(index: number, event: InputEvent) {
      const value = (event.target as any).value;
      const quantity = parseInt(value, 10);
      if (quantity < 1) {
        return;
      }

      const item = this.cartItems[index];
      item.quantity = quantity;
      ShoppingCartItemService.updateItem(index, item);
    },
    onBillingAddressChange(address: any) {
      this.billingAddress = address;
      AddressState.setBillingAddress(address);
    },
    onShippingAddressChange(address: any) {
      this.shippingAddress = address;
      AddressState.setShippingAddress(address);
    },
  },
  mounted() {
    // If no cart items, redirect to the product page
    if (this.cartItems.length === 0) {
      setTimeout(() => {
        this.$router.push("/product");
      }, 2000); // 2-second delay before redirecting
    }
  },
});


</script>

<style scoped>
.basket {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  background-color: #f9f9f9;
}

.box {
  transition: transform 0.2s;
  display: flex; /* Added for flexbox layout */
  align-items: center; /* Center items vertically */
}

.box:hover {
  transform: scale(1.02);
}

.item-content {
  display: flex; /* Added for image and details layout */
  align-items: center; /* Center items vertically */
}

.thumbnail {
  width: 80px; /* Set desired width for thumbnail */
  height: 80px; /* Set desired height for thumbnail */
  margin-right: 1rem; /* Space between image and details */
  border-radius: 4px; /* Optional: add border radius */
}

.item-details {
  flex-grow: 1; /* Allow details to take up remaining space */
}

.field {
  margin-top: 0.5rem; /* Space between item details and quantity field */
}

.buttons {
  margin-top: 1rem;
}
</style>
