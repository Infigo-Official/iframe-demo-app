// src/services/StateService.ts

import ShoppingCartItemState from "@/services/cache/shopping-cart-item-state";
import uuidv4 from "@/utils/uuidv4";

/**
 * StateService manages the customer context session and Infigo credentials.
 *
 * This service caches essential information such as platform URL, API token,
 * customer ID, and a setup timestamp using local storage. This approach is
 * primarily intended for demo purposes; in production environments, it is
 * recommended to use a proper database to store sensitive data securely.
 */
class StateService {
    private static instance: StateService;

    private constructor() {
        this.loadFromLocalStorage();
    }

    // State properties
    public platformUrl: string | null = null;
    public apiToken: string | null = null;
    public customerId: string | null = null;
    private setupTimestamp: number | null = null;

    // Singleton instance
    public static getInstance(): StateService {
        if (!StateService.instance) {
            StateService.instance = new StateService();
        }
        return StateService.instance;
    }

    /**
     * Retrieves the customer ID from the shopping cart state or local storage.
     * If no customer ID exists, a new session ID is generated.
     *
     * @returns {string} - The customer ID or a new session ID.
     */
    private getCustomerId() {
        ShoppingCartItemState.loadCartFromLocalStorage();
        const items = ShoppingCartItemState.getCartItems();

        if (items.length > 0) {
            return items[0].Customer.Guid;
        }

        const sessionId = localStorage.getItem('customerId') || uuidv4();
        return sessionId;
    }

    // Load state from localStorage
    private loadFromLocalStorage() {
        this.platformUrl = localStorage.getItem('platformUrl');
        this.apiToken = localStorage.getItem('apiToken');
        this.customerId = this.getCustomerId();
        this.setupTimestamp = parseInt(localStorage.getItem('setupTimestamp') || '0');
    }

    /**
     * Saves the platform URL, API token, and current timestamp to local storage.
     * Also updates the customer ID, creating a new one if necessary.
     *
     * @param {string} platformUrl - The URL of the platform.
     * @param {string} apiToken - The API token for authentication.
     */
    public saveState(platformUrl: string, apiToken: string) {
        this.platformUrl = platformUrl;
        this.apiToken = apiToken;
        this.setupTimestamp = new Date().getTime();

        localStorage.setItem('platformUrl', this.platformUrl);
        localStorage.setItem('apiToken', this.apiToken);
        localStorage.setItem('setupTimestamp', this.setupTimestamp.toString());
        localStorage.setItem('customerId', this.customerId || uuidv4());
    }

    /**
     * Clears the state, resetting all properties and removing data from local storage.
     */
    public clearState() {
        this.platformUrl = null;
        this.apiToken = null;
        this.setupTimestamp = null;
        localStorage.clear();
    }

    /**
     * Checks if the setup is valid based on the setup timestamp.
     * The setup is considered valid for one day (24 hours).
     *
     * @returns {boolean} - True if the setup is valid, false otherwise.
     */
    public isSetupValid(): boolean {
        if (this.setupTimestamp) {
            const now = new Date().getTime();
            return now - this.setupTimestamp <= 60 * 1000 * 60 * 24; // 1 day cache
        }
        return false;
    }
}

export default StateService.getInstance();
