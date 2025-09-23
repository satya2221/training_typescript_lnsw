// src/index.ts


import {InventoryManager} from "./services/inventory.service.js";
import {type Product, ProductCategory} from "./models/product.model.js";

async function main() {
    const manager = new InventoryManager();

    const tv: Product = {
        id: 1, name: "Smart TV 55 inch", brand: "Samsung",
        price: 7500000, quantity: 10, category: ProductCategory.ELECTRONICS
    };

    const mouse: Product = {
        id: 2, name: "Wireless Mouse", brand: "Logitech",
        price: 350000, quantity: 50, category: ProductCategory.ACCESSORIES
    };


    await manager.addProduct(tv);
    await manager.addProduct(mouse);

    const allProducts = await manager.listProducts();
    console.log("--- HASIL AKHIR ---");
    allProducts.forEach(p => console.log(`- ${p.name}`));
}

main().catch(console.error);

// src/index.ts (tambahkan di bawah)

type BrandInfo = {
    country: string;
    isPremium: boolean;
};

// Kita ingin memastikan semua brand punya info, TAPI kita juga ingin
// TypeScript tetap tahu bahwa `brandCatalog` punya properti `Samsung` dan `Logitech` secara spesifik.
const brandCatalog = {
    Samsung: { country: "South Korea", isPremium: true },
    Logitech: { country: "Switzerland", isPremium: true },
    // Coba tambahkan brand baru dengan properti yang salah, TypeScript akan error!
    // Xiaomi: { country: "China" } // Error: Property 'isPremium' is missing.
} satisfies Record<string, BrandInfo>;

// Keuntungannya: Kita tetap bisa mengakses properti secara spesifik tanpa error
console.log(brandCatalog.Samsung.country); // Works!