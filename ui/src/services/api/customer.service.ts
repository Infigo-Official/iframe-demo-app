import { AxiosPromise } from "axios";
import createApiClient from "@/services/api/createApiClient";
import { addToQueryString } from "@/utils/url";
import {InfigoApiCustomerSsoResult} from "@infigo-official/types-for-api/src/models/InfigoApiCustomerSsoResult";

const CustomerService = {
  /**
   * Migrates all data associated with a specified user (such as basket items, saved projects, images)
   * from one user to another. This is commonly used when jobs have been created across multiple user
   * sessions (e.g., starting as a guest user, then logging in as a registered user) and the user
   * wishes to consolidate jobs under a single account to enable placing an order.
   *
   * **Example Use Case**: A user initially creates a job as a guest, then logs in with a registered
   * account and creates a second job. Since orders require all jobs to be linked to a single user,
   * this method allows all jobs to be migrated to the registered account.
   *
   * @param {string} fromCustomerId - The ID of the user whose data is to be migrated (usually a guest).
   * @param {string} toCustomerId - The ID of the target user to which data should be migrated.
   * @returns {AxiosPromise<void>} - A promise that resolves when the migration request is successful.
   *
   * @example
   * // Usage
   * CustomerService.migrateItems("guestUserId123", "registeredUserId456")
   *   .then(() => {
   *     console.log("Migration successful");
   *   })
   *   .catch(error => {
   *     console.error("Migration failed", error);
   *   });
   */
  migrateItems(
      fromCustomerId: string,
      toCustomerId: string,
  ): AxiosPromise<void> {
    const apiClient = createApiClient();
    let url = "services/api/customer/migrate";
    url = addToQueryString(url, "fromCustomerId", fromCustomerId);
    url = addToQueryString(url, "toCustomerId", toCustomerId);

    return apiClient.post(url, {});
  },

  /**
   * Generates a Single Sign-On (SSO) URL that allows the specified user to authenticate and access the editor link.
   *
   * This method is useful for providing a seamless authentication experience. The generated SSO URL can be
   * used to redirect users to the editor while ensuring they are logged in. The `returnUrl` parameter indicates
   * the editor link that the user will access after successful authentication.
   *
   * @param {string} customerId - The ID of the customer for whom the SSO URL is generated.
   * @param {string} editorLink - The link to the editor that the user will be redirected to after authentication.
   * @returns {AxiosPromise<string>} - A promise that resolves with the SSO URL for the user.
   *
   * @example
   * CustomerService.getSSOUrl("user123", "https://editor.example.com")
   *   .then((ssoUrl) => {
   *     console.log("SSO URL:", ssoUrl);
   *   })
   *   .catch(error => {
   *     console.error("Error generating SSO URL:", error);
   *   });
   */
  getSSOUrl(customerId: string, editorLink: string): AxiosPromise<InfigoApiCustomerSsoResult> {
    const apiClient = createApiClient();
    let ssoUrl = `/services/api/SSOUrl/Get/${customerId}`;
    ssoUrl = addToQueryString(ssoUrl, "returnUrl", editorLink);

    return apiClient.get(ssoUrl);
  }
};

export default CustomerService;
