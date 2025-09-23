


// Pindahkan fungsi ini ke dalam file yang sama, atau lebih baik lagi, jadikan method private
import type {Product} from "./models/product.model.js";

function printProductInfo(product: Product): void {
    console.log(`- [${product.category}] ${product.name}, Stok: ${product.quantity}`);
}