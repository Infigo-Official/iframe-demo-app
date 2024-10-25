import { ShoppingCartItem } from "@/types/iframe/infigo-job-response.type";

/**
 * ShoppingCartService manages the shopping cart items for the Infigo application.
 *
 * This service utilizes local storage to persist shopping cart items in a demo context.
 * In a production environment, it's crucial to store shopping cart items in a database
 * to maintain a reference between shopping cart items and the associated Infigo job ID.
 */
class ShoppingCartService {
    private cartItems: Array<ShoppingCartItem> = [];

    // Singleton pattern
    private static instance: ShoppingCartService;

    /**
     * Gets the singleton instance of ShoppingCartService.
     *
     * @returns {ShoppingCartService} - The instance of the ShoppingCartService.
     */
    public static getInstance(): ShoppingCartService {
        if (!ShoppingCartService.instance) {
            ShoppingCartService.instance = new ShoppingCartService();
        }
        return ShoppingCartService.instance;
    }

    /**
     * Retrieves the current items in the shopping cart.
     *
     * @returns {Array<ShoppingCartItem>} - The array of shopping cart items.
     */
    public getCartItems() {
        return this.cartItems;
    }

    /**
     * Adds an item to the shopping cart.
     *
     * @param {ShoppingCartItem} item - The item to be added to the cart.
     */
    public addItem(item: ShoppingCartItem) {
        this.cartItems.push(item);
        this.updateLocalStorage();
    }

    /**
     * Removes an item from the shopping cart by its index.
     *
     * @param {number} index - The index of the item to be removed.
     */
    public removeItem(index: number) {
        this.cartItems.splice(index, 1);
        this.updateLocalStorage();
    }

    /**
     * Clears all items from the shopping cart.
     */
    public clearCart() {
        this.cartItems = [];
        this.updateLocalStorage();
    }

    /**
     * Updates an existing item in the shopping cart by its index.
     *
     * @param {number} index - The index of the item to be updated.
     * @param {ShoppingCartItem} item - The new item to replace the existing one.
     */
    public updateItem(index: number, item: ShoppingCartItem) {
        this.cartItems[index] = item;
        this.updateLocalStorage();
    }

    /**
     * Updates the local storage with the current state of the shopping cart.
     */
    private updateLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }

    /**
     * Loads the shopping cart items from local storage.
     * This method is called to initialize the cart items when the service is created.
     */
    public loadCartFromLocalStorage() {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.cartItems = storedCart;
        return this.cartItems;
    }
}

export default ShoppingCartService.getInstance();
