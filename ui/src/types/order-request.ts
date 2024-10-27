import InfigoAddress from "@/types/demo/address";
import {ShoppingCartItem} from "@/types/iframe/infigo-job-response.type";
import {InfigoApiRecordOrderModel} from "@infigo-official/types-for-api/src/index";
import {BasketItem} from "@/types/demo/basket-item";

/**
 * Represents an order request in Infigo, encapsulating billing, shipping, customer, and item details.
 */
export class OrderRequest {
    billing: InfigoAddress;
    shipping: InfigoAddress;
    externalId: string | null;
    customerId: string | null;
    deliveryMethod: string | null;
    poNumber: string | null;
    lineItems: BasketItem[];

    constructor(
        billing: InfigoAddress,
        shipping: InfigoAddress,
        externalId: string | null,
        customerId: string | null,
        deliveryMethod: string | null,
        poNumber: string | null,
        lineItems: BasketItem[]
    ) {
        this.billing = billing;
        this.shipping = shipping;
        this.externalId = externalId;
        this.customerId = customerId;
        this.deliveryMethod = deliveryMethod;
        this.poNumber = poNumber;
        this.lineItems = lineItems;
    }

    /**
     * Converts the order request into the format expected by the Infigo API.
     * @returns {InfigoApiRecordOrderModel} - The structured order model.
     */
    toApiModel(): InfigoApiRecordOrderModel {
        return {
            BillingAddress: {...this.billing},
            DeliveryAddress: {...this.shipping},
            ExternalOrderId: this.externalId,
            CatfishCustomerId: this.customerId,
            CatfishDeliveryMethod: this.deliveryMethod,
            CheckoutAttributes: [],
            PurchaseOrderNumber: this.poNumber,
            OrderLineItems: this.lineItems.map((item) => ({
                JobId: item.jobId,
                Quantity: item.quantity,
                NopProductId: item.productId,
                ProductVariantAttributes: [],
                ExtraData: {
                    "created-by": "infigo-demo",
                    "created-on": new Date().toISOString(),
                } as any,
            })),
        };
    }
}
