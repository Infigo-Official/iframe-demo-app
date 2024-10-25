// src/services/AddressStateService.ts
import { reactive, toRefs } from 'vue';
import InfigoAddress from "@/types/demo/address";

/**
 * AddressStateService manages the state of billing and shipping addresses.
 *
 * This service utilizes local storage to cache address details, allowing users
 * to avoid entering their addresses for each order in the demo application.
 * It provides methods to get, set, and reset addresses, ensuring a smooth
 * user experience while maintaining the data persistently across sessions.
 */
class AddressStateService {
    private state = reactive({
        billingAddress: this.getBillingAddressFromLocalStorage(),
        shippingAddress: this.getShippingAddressFromLocalStorage(),
    });

    /**
     * Returns a default address object with empty fields.
     *
     * @returns {InfigoAddress} - An object representing a default address.
     */
    public getDefaultAddress(): InfigoAddress {
        return {
            FirstName: '',
            LastName: '',
            CompanyName: '',
            AddressLine1: '',
            AddressLine2: '',
            Town: '',
            ZipPostalCode: '',
            StateProvince: '',
            Country: '',
            Telephone: '',
            FaxNumber: '',
            Email: '',
        };
    }

    /**
     * Retrieves the billing address from local storage or returns a default address if not found.
     *
     * @returns {InfigoAddress} - The billing address or a default address if not set.
     */
    private getBillingAddressFromLocalStorage(): InfigoAddress {
        const address = localStorage.getItem('billingAddress');
        return address ? JSON.parse(address) : this.getDefaultAddress();
    }

    /**
     * Retrieves the shipping address from local storage or returns a default address if not found.
     *
     * @returns {InfigoAddress} - The shipping address or a default address if not set.
     */
    private getShippingAddressFromLocalStorage(): InfigoAddress {
        const address = localStorage.getItem('shippingAddress');
        return address ? JSON.parse(address) : this.getDefaultAddress();
    }

    /**
     * Provides reactive references to the billing address state.
     *
     * @returns {Object} - Reactive references to the billing address properties.
     */
    public getBillingAddress() {
        return toRefs(this.state.billingAddress);
    }

    /**
     * Provides reactive references to the shipping address state.
     *
     * @returns {Object} - Reactive references to the shipping address properties.
     */
    public getShippingAddress() {
        return toRefs(this.state.shippingAddress);
    }

    /**
     * Sets the billing address and updates local storage.
     *
     * @param {InfigoAddress} address - The billing address to set.
     */
    public setBillingAddress(address: InfigoAddress) {
        this.state.billingAddress = { ...address };
        localStorage.setItem('billingAddress', JSON.stringify(this.state.billingAddress));
    }

    /**
     * Sets the shipping address and updates local storage.
     *
     * @param {InfigoAddress} address - The shipping address to set.
     */
    public setShippingAddress(address: InfigoAddress) {
        this.state.shippingAddress = { ...address };
        localStorage.setItem('shippingAddress', JSON.stringify(this.state.shippingAddress));
    }

    /**
     * Resets the billing address to the default address and removes it from local storage.
     */
    public resetBillingAddress() {
        this.state.billingAddress = this.getDefaultAddress();
        localStorage.removeItem('billingAddress'); // Remove from local storage
    }

    /**
     * Resets the shipping address to the default address and removes it from local storage.
     */
    public resetShippingAddress() {
        this.state.shippingAddress = this.getDefaultAddress();
        localStorage.removeItem('shippingAddress'); // Remove from local storage
    }
}

// Create a singleton instance of the service
const addressStateService = new AddressStateService();
export default addressStateService;
