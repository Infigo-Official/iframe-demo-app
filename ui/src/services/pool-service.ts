import {AxiosPromise} from "axios";
import createApiClient from "@/services/api/createApiClient";
import {Constants} from "../../consts/constants";

const PoolService = {
    /**
     * Polls the specified callback URL to check if Infigo has completed the requested output creation.
     *
     * Since output generation in Infigo is asynchronous, we cannot retrieve the result directly.
     * Instead, we periodically call this URL to determine when the output is ready.
     *
     * @param {string} callbackUrl - The URL used to check for output completion from Infigo.
     * @returns {AxiosPromise<void>} - A promise that resolves when the polling call completes.
     *
     * @example
     * PoolService.pool(callbackUrl)
     *   .then(() => {
     *     console.log("Polling successful, output is ready.");
     *   })
     *   .catch(error => {
     *     console.error("Polling error:", error);
     *   });
     */
    pool(callbackUrl: string): AxiosPromise<void> {
        const apiClient = createApiClient();
        return apiClient.get(callbackUrl);
    },

    /**
     * Generates a callback URL where Infigo will send notifications once output creation is complete.
     *
     * This method constructs a URL that is unique per request and points to a small temporary service.
     * The service is responsible for storing the response from Infigo, allowing the frontend to poll
     * for the result until the output is created.
     *
     * **Note**: Normally, an endpoint should be exposed within the application to handle callback requests
     * directly, but since this is handled from the frontend, we rely on the temporary service.
     *
     * @param {string} uniqueId - A unique identifier for the output request.
     * @returns {string} - A callback URL for Infigo to notify when the output is created.
     *
     * @example
     * const callbackUrl = PoolService.generateCallbackUrl("12345");
     * console.log("Generated Callback URL:", callbackUrl);
     */
    generateCallbackUrl(uniqueId: string): string {
        return `${Constants.WebhookCollectorUrl}/api/data/${uniqueId}`;
    }
};

export default PoolService;
