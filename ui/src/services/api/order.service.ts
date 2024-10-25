// src/services/productService.ts
import createApiClient from "./createApiClient";
import { AxiosPromise } from "axios";
import {
  InfigoApiResponseObjectModel,
} from "@infigo-official/types-for-api/src";
import { InfigoOrderItem } from "@infigo-official/types-for-api/src/models/InfigoOrderItem";
import { OrderRequest } from "@/types/order-request";

const OrderService = {
  /**
   * Places an order in Infigo, returning all error details if the order submission fails.
   * @param {OrderRequest} orderRequest - The order request data encapsulated in an object.
   * @returns {AxiosPromise<InfigoApiResponseObjectModel>} - A promise resolving to the order response.
   */
  placeOrder(
    orderRequest: OrderRequest,
  ): AxiosPromise<InfigoApiResponseObjectModel> {
    const apiClient = createApiClient();
    return apiClient.post(
      `services/api/order/recordorder`,
      orderRequest.toApiModel(),
    );
  },

  /**
   * Retrieves order details from Infigo by order ID.
   * @param {number} orderId - The ID of the order to retrieve.
   * @returns {AxiosPromise<InfigoOrderItem>} - A promise resolving to the order details.
   */
  getOrderById(orderId: number): AxiosPromise<InfigoOrderItem> {
    const apiClient = createApiClient();
    return apiClient.get(`services/api/order/detail/${orderId}`);
  },
};

export default OrderService;
