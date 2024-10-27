/**
 * This module defines the data structures used for handling
 * shopping cart items in the Infigo application.
 *
 * The interfaces defined here represent the objects that will be
 * retrieved from the Infigo iframe once the "Add to Basket" or
 * "Save" action is triggered, specifically in relation to the
 * Job, Customer, Product, and associated images.
 */

export interface Job {
    Id?: string | null;
    Quantity: number;
    CustomName: string | null;
    Attributes: any[];
    Canvas: string;
    CanvasSize: string;
    NumPages: number;
    OutputType: string;
    SpineWidth: number;
    Weight: number;
    Stock: string;
    Width: number;
    Height: number;
    IsDynamicSize: boolean;
    Price: number;
}

export interface Customer {
    Id: number;
    Email: string;
    Guid: string;
}

export interface Product {
    Id: number;
    Name: string;
    Sku: string | null;
    ExternalIds: any[]; // If you know the structure of external IDs, you can define it here.
    ProductGroupName: string | null;
}

export interface Images {
    Thumbnails: string[];
    Previews: string[];
}

export interface ShoppingCartItem {
    Id: number;
    Job: Job;
    Customer: Customer;
    Product: Product;
    Images: Images;
}
