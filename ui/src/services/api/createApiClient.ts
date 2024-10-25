import axios from 'axios';
import SessionService from "@/services/cache/session-state";

const createApiClient = (platformUrl?: string | null, apiToken?: string | null) => {
    /**
     * Creates a new Axios instance for making API calls to the Infigo platform.
     * This client is configured with a base URL and optional authentication token,
     * and is intended for demo purposes. Normally, API interactions should be handled
     * by a secure backend service to prevent exposing tokens and sensitive endpoints
     * to the browser. However, in this demo, the client interacts directly from the browser,
     * enabling the interception of requests and responses.
     *
     * @param {string} [platformUrl] - The base URL for the Infigo API platform.
     *                                Defaults to the platform URL from session if not provided.
     * @param {string} [apiToken] - An optional API token for authenticating requests.
     *                              Defaults to the token stored in the session if not provided.
     * @returns {AxiosInstance} - A pre-configured Axios instance for making API requests.
     *
     * @example
     * // Usage
     * const apiClient = createApiClient("https://api.infigo.com", "yourApiToken");
     * apiClient.get("/some-endpoint")
     *   .then(response => console.log(response.data))
     *   .catch(error => console.error("Request failed", error));
     */

    platformUrl = platformUrl || SessionService.platformUrl;
    apiToken = apiToken || SessionService.apiToken;

    const apiClient = axios.create({
        baseURL: platformUrl || '',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
    });

    // Add a request interceptor to include the authentication token
    apiClient.interceptors.request.use((config) => {
        if (apiToken) {
            config.headers['Authorization'] = `Basic ${apiToken}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return apiClient;
};

export default createApiClient;
