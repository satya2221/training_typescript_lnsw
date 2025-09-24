// src/products/entities/product.entity.ts
export enum ProductCategory {
    ELECTRONICS = "ELEKTRONIK",
    ACCESSORIES = "AKSESORIS",
    GADGETS = "GAJET",
}

export class Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    category: ProductCategory;
    salePrice?: number;
}