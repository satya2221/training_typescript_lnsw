import type {Product} from "../models/product.model.js";
import {LogMethodCall} from "../decorators/log.decorator.js";
import {MeasureTime} from "../decorators/mesure-time.decorator.js";

export class InventoryManager {
    private products: Product[] = [];

    constructor() {
        console.log("Inventory Manager diinisialisasi!");
    }

    private simulateDbDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    @MeasureTime
    public async addProduct(product: Product): Promise<void> {
        await this.simulateDbDelay(500); // Tunggu 500ms
        this.products.push(product);
        console.log(`Produk "${product.name}" berhasil ditambahkan ke database.`);
    }

    @MeasureTime
    @LogMethodCall
    public async listProducts(): Promise<Product[]> {
        using db = new DatabaseConnection();
        db.connect();
        await this.simulateDbDelay(1000); // Tunggu 1 detik

        console.log("Mengambil daftar produk dari 'database'...");
        return this.products;
    }
}

// Simulasi koneksi DB yang perlu ditutup
export class DatabaseConnection {
    connect() {
        console.log("LOG: Membuka koneksi database...");
    }

    // Ini adalah method spesial yang akan dipanggil otomatis oleh `using`
    [Symbol.dispose]() {
        console.log("LOG: Koneksi database ditutup secara otomatis!");
    }
}