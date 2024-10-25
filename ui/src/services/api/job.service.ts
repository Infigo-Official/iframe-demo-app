import createApiClient from "./createApiClient";
import { AxiosPromise } from "axios";
import downloadFile from "@/utils/downloadFile";
import { addToQueryString } from "@/utils/url";

const JobService = {
    /**
     * Initiates output creation for a specific job in Infigo.
     *
     * This function triggers an asynchronous output creation process in Infigo for a given `jobId`.
     * The `callbackUrl` parameter is used by Infigo to notify our service when the output is ready,
     * allowing us to later download the output once the creation process is complete.
     *
     * @param {string} jobId - The unique identifier for the job requiring output.
     * @param {string} callbackUrl - The URL Infigo will call when the output creation is complete.
     * @returns {AxiosPromise<void>} - A promise that resolves once the output creation process is triggered.
     *
     * @example
     * JobService.createOutput("job123", "https://example.com/api/callback")
     *   .then(() => {
     *     console.log("Output creation initiated for job123");
     *   })
     *   .catch(error => {
     *     console.error("Error creating output:", error);
     *   });
     */
    createOutput(jobId: string, callbackUrl: string): AxiosPromise<void> {
        const apiClient = createApiClient();
        return apiClient.post(`/services/api/orderlineitem/createoutputfor/${jobId}`, {
            CallbackUrl: callbackUrl,
            DirectDownload: true
        });
    },

    /**
     * Downloads the output file for a specified job once Infigo has completed the output creation.
     *
     * This method is designed to be called after receiving a notification via the `callbackUrl` (set in `createOutput`)
     * confirming that the output is ready. It retrieves the output in `blob` format and saves it using a utility function.
     *
     * @param {string} jobId - The unique identifier for the job whose output file is to be downloaded.
     * @returns {Promise<void>} - A promise that resolves when the file is successfully downloaded.
     *
     * @example
     * JobService.getOutput("job123")
     *   .then(() => {
     *     console.log("Output downloaded successfully.");
     *   })
     *   .catch(error => {
     *     console.error("Error downloading output:", error);
     *   });
     */
    getOutput(jobId: string): Promise<void> {
        const apiClient = createApiClient();

        return apiClient.get(`/services/api/orderlineitem/download/${jobId}`, { responseType: 'blob' })
            .then((response) => {
                downloadFile(response, `output_${jobId}.pdf`);
            })
            .catch((error) => {
                console.error('Error downloading the file', error);
            });
    },

    /**
     * Generates a link for embedding the Infigo editor into an iFrame.
     *
     * This function constructs a URL that allows the user to access the Infigo editor.
     * The generated link authenticates the user and has a short-lived validity period.
     * You must specify the product ID, and optionally, the order line item ID if you intend to edit
     * an existing product (such as a basket item or saved project).
     *
     * @param {string} customerId - The ID of the customer for whom the SSO URL is generated.
     * @param {number} productId - The ID of the product to be edited in the Infigo editor.
     * @param {string | null} jobId - The optional ID of the job associated with the product.
     *                               If provided, this will be included in the query string for the editor link.
     * @returns {Promise<string>} - A promise that resolves to the generated editor link.
     *
     * @example
     * JobService.getLinkForEditor(123, "job456")
     *   .then((editorLink) => {
     *     console.log("Editor link:", editorLink);
     *   })
     *   .catch(error => {
     *     console.error("Error getting editor link:", error);
     *   });
     */
    async getLinkForEditor(customerId: string, productId: number, jobId: string | null): Promise<string> {
        let linkForUrl = `/services/api/Editor/LinkFor/${customerId}`;
        linkForUrl = addToQueryString(linkForUrl, 'productId', productId);
        linkForUrl = addToQueryString(linkForUrl, 'quantity', 1);
        linkForUrl = addToQueryString(linkForUrl, 'embeddedOperationMode', true);

        if (jobId) {
            linkForUrl = addToQueryString(linkForUrl, "orderLineItemId", jobId);
        }

        return new Promise((resolve, reject) => {
            const apiClient = createApiClient();
            return apiClient.get(linkForUrl)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    console.error('Error getting link for editor', error);
                    reject(error);
                });
        });
    }
};

export default JobService;
