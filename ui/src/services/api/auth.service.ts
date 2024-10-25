import createApiClient from "@/services/api/createApiClient";

const AuthService = {
  /**
   * Checks if a connection to Infigo can be successfully established using the provided API token.
   * This method verifies if the given API token allows access to the Infigo platform.
   *
   * @param {string} platformUrl - The base URL of the Infigo platform.
   * @param {string} apiToken - The API token used for authentication.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the connection is successful, or `false` if not.
   *
   * @example
   * // Usage
   * AuthService.isAuthenticated("https://example.infigo.com", "yourApiToken")
   *   .then(isAuthenticated => {
   *     if (isAuthenticated) {
   *       console.log("Authenticated successfully");
   *     } else {
   *       console.log("Authentication failed");
   *     }
   *   });
   */
  isAuthenticated(platformUrl: string, apiToken: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const client = createApiClient(platformUrl, apiToken);
      client
        .get(`/services/api/auth/${apiToken}`)
        .then(() => {
          resolve(true);
        })
        .catch((err: any) => {
          console.log("Error checking authentication", err);
          resolve(false);
        });
    });
  },
};

export default AuthService;
