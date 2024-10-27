import {InfigoProductType} from "@/types/infigo-product.type";

export class BasketItem{
    productId: number;
    productName: string;
    productSKU?: string | null;
    jobId?: string | null;
    productType: InfigoProductType;
    quantity: number;
    thumbnailUrls: Array<string | null>;
    customerGuid: string;
}
