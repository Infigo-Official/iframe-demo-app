import createApiClient from "./createApiClient";
import { AxiosPromise } from "axios";
import { InfigoProductInfoV2Model } from "@infigo-official/types-for-api/src";

const ProductService = {
  /**
   * Retrieves detailed product information for a specific product by its ID from Infigo.
   *
   * @param {string} id - The unique identifier of the product.
   * @returns {AxiosPromise<InfigoProductInfoV2Model>} - A promise that resolves with the product details.
   *
   * @example
   * ProductService.getById("12345")
   *   .then(response => {
   *     console.log("Product details:", response.data);
   *   })
   *   .catch(error => {
   *     console.error("Error fetching product:", error);
   *   });
   */
  getById(id: string): AxiosPromise<InfigoProductInfoV2Model> {
    const apiClient = createApiClient();
    return apiClient.get(`/services/api/catalog/v2/product/${id}`);
  },

  /**
   * Retrieves a paginated list of all products available in Infigo.
   *
   * @returns {AxiosPromise<InfigoProductInfoV2Model[]>} - A promise that resolves with the list of products.
   *
   * **Note**: The response includes up to 500 products in a single request, with `pageIndex` set to 0.
   *
   * @example
   * ProductService.getAll()
   *   .then(response => {
   *     console.log("All products:", response.data);
   *   })
   *   .catch(error => {
   *     console.error("Error fetching products:", error);
   *   });
   */
  getAll(): AxiosPromise<InfigoProductInfoV2Model[]> {
    const apiClient = createApiClient();
    return apiClient.get("/services/api/catalog/v2/product", {
      data: {
        pageIndex: 0,
        pageSize: 500,
      },
    });
  },
};

export default ProductService;
