export enum ProductCategory {
    ELECTRONICS = "ELEKTRONIK",
    ACCESSORIES = "AKSESORIS",
    GADGETS = "GAJET",
}

export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    category: ProductCategory;
}
