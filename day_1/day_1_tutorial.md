### **Hari 1: Fondasi TypeScript dari Nol**

**Selamat Datang di Hari Pertama\!**
Hari ini kita akan melupakan NestJS sejenak. Tujuan kita adalah menguasai TypeScript sebagai sebuah bahasa. Kita akan membangun aplikasi **CLI Manajemen Inventaris** sederhana dari awal hingga akhir. Di akhir sesi 3 jam ini, Anda akan memiliki proyek TypeScript yang berjalan dan pemahaman mendalam tentang konsep-konsep intinya.

-----

### **Jam 1: Setup Proyek & Fondasi Tipe Data**

**Tujuan Jam Ini:** Dari folder kosong menjadi sebuah proyek TypeScript yang terstruktur dengan model data yang kuat.

#### **Langkah 0: Persiapan Lingkungan & Proyek**

Kita akan mulai dari nol. Buka terminal Anda.

1.  **Buat Folder Proyek:**

    ```bash
    mkdir ts-inventory-cli
    cd ts-inventory-cli
    ```

2.  **Inisialisasi Proyek Node.js:**

    ```bash
    npm init -y
    ```

3.  **Install TypeScript:**

    ```bash
    npm install --save-dev typescript @types/node
    ```

4.  **Buat File Konfigurasi TypeScript (`tsconfig.json`):**

    ```bash
    npx tsc --init
    ```

    Buka `tsconfig.json` dan mari kita pastikan beberapa pengaturan kunci sudah benar (ini penting untuk proyek modern):

    ```jsonc
    {
      "compilerOptions": {
        "target": "ES2022", // Menggunakan fitur JavaScript modern
        "module": "NodeNext", // Sistem modul modern untuk Node.js
        "moduleResolution": "NodeNext",
        "outDir": "./dist", // Tempat menyimpan file JavaScript hasil kompilasi
        "rootDir": "./src", // Tempat kita menulis kode TypeScript
        "strict": true, // Mengaktifkan semua aturan ketat TypeScript (best practice!)
        "esModuleInterop": true
      }
    }
    ```

5.  **Buat Struktur Folder:**

    ```bash
    mkdir src
    touch src/index.ts
    ```

#### **Langkah 1: Skrip Pertama & Tipe Dasar**

Buka `src/index.ts` dan mari kita tulis kode pertama kita.

```typescript
// src/index.ts

let inventoryName: string = "Gudang Elektronik";
let totalItems: number = 500;
let isOperational: boolean = true;
let availableBrands: string[] = ["Samsung", "LG", "Sony"];

console.log(`Selamat datang di ${inventoryName}!`);

// Coba buat kesalahan!
// totalItems = "lima ratus"; // TypeScript akan langsung error di sini!
```

Untuk menjalankannya:

1.  Buka `package.json` dan tambahkan skrip:
    ```json
    "scripts": {
      "build": "tsc",
      "start": "node dist/index.js"
    },
    ```
2.  Jalankan di terminal:
    ```bash
    npm run build
    npm start
    ```
    Anda akan melihat output "Selamat datang di Gudang Elektronik\!".

#### **Langkah 2: Mendefinisikan Struktur Data dengan `interface`**

Setiap item di inventaris kita butuh struktur yang jelas. Di sinilah `interface` bersinar.

```typescript
// src/index.ts (di bawah kode sebelumnya)

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

const firstProduct: Product = {
  id: 1,
  name: "Smart TV 55 inch",
  brand: "Samsung",
  price: 7500000,
  quantity: 10,
};

function printProductInfo(product: Product): void {
  console.log(`- ${product.name} (${product.brand}), Harga: Rp${product.price}, Stok: ${product.quantity}`);
}

printProductInfo(firstProduct);
```

Sekarang, setiap kali kita bekerja dengan objek `Product`, TypeScript memastikan strukturnya selalu benar.

#### **Langkah 3: Menggunakan `enum` untuk Kategori/Status**

Bagaimana jika produk punya kategori? Menggunakan string biasa (`"elektronik"`, `"aksesoris"`) rawan typo. `enum` adalah solusinya.

```typescript
// src/index.ts (tambahkan di atas interface Product)

export enum ProductCategory {
  ELECTRONICS = "ELEKTRONIK",
  ACCESSORIES = "AKSESORIS",
  GADGETS = "GAJET",
}

// Ubah interface Product untuk menyertakan kategori
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  category: ProductCategory; // Tambahkan ini
}

// Perbarui objek produk kita
const firstProduct: Product = {
  id: 1,
  name: "Smart TV 55 inch",
  brand: "Samsung",
  price: 7500000,
  quantity: 10,
  category: ProductCategory.ELECTRONICS, // Jauh lebih aman!
};
```

**Rekap Jam 1:** Kita sudah punya proyek TypeScript yang berjalan, lengkap dengan struktur data yang kokoh menggunakan `interface` dan `enum`.

-----

### **Jam 2: Class, Modules, dan Fitur Modern**

**Tujuan Jam Ini:** Mengorganisir kode kita ke dalam `class` yang logis, memecah file menggunakan *modules*, dan mencoba fitur-fitur TypeScript modern.

#### **Langkah 4: Mengelola Logika dengan `class`**

Mari kita bungkus semua logika inventaris kita ke dalam sebuah `class` agar lebih terorganisir.

1.  Buat file baru: `src/InventoryManager.ts`.
2.  Pindahkan `interface` dan `enum` ke file baru (atau file `models.ts` terpisah, tapi untuk sekarang kita gabung saja).
3.  Buat `class` `InventoryManager`.

<!-- end list -->

```typescript
// src/InventoryManager.ts

export enum ProductCategory { /* ... enum dari sebelumnya ... */ }
export interface Product { /* ... interface dari sebelumnya ... */ }

export class InventoryManager {
  private products: Product[] = [];

  constructor() {
    console.log("Inventory Manager diinisialisasi!");
  }

  public addProduct(product: Product): void {
    this.products.push(product);
    console.log(`Produk "${product.name}" berhasil ditambahkan.`);
  }

  public listProducts(): void {
    if (this.products.length === 0) {
      console.log("Inventaris masih kosong.");
      return;
    }
    console.log("Daftar Produk di Inventaris:");
    this.products.forEach(p => printProductInfo(p)); // Kita akan pindahkan fungsi ini juga
  }
}

// Pindahkan fungsi ini ke dalam file yang sama, atau lebih baik lagi, jadikan method private
function printProductInfo(product: Product): void {
  console.log(`- [${product.category}] ${product.name}, Stok: ${product.quantity}`);
}
```

4.  Gunakan `class` ini di `src/index.ts`.

<!-- end list -->

```typescript
// src/index.ts (hapus kode lama dan ganti dengan ini)

import { InventoryManager, Product, ProductCategory } from './InventoryManager';

const manager = new InventoryManager();

const tv: Product = {
  id: 1, name: "Smart TV 55 inch", brand: "Samsung",
  price: 7500000, quantity: 10, category: ProductCategory.ELECTRONICS
};

const mouse: Product = {
  id: 2, name: "Wireless Mouse", brand: "Logitech",
  price: 350000, quantity: 50, category: ProductCategory.ACCESSORIES
};

manager.addProduct(tv);
manager.addProduct(mouse);
manager.listProducts();
```

Jalankan lagi dengan `npm run build && npm start`. Kode kita sekarang jauh lebih rapi\!

#### **Langkah 5: Mengetik dengan Aman menggunakan `satisfies`**

Terkadang kita ingin memastikan sebuah objek sesuai dengan sebuah tipe, tapi tanpa kehilangan tipe spesifik dari propertinya. Di sinilah `satisfies` (diperkenalkan di TS 4.9) sangat berguna.

```typescript
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
```

#### **Langkah 6: Manajemen Resource Otomatis dengan `using`**

Fitur dari ES2023 yang didukung penuh di TypeScript 5.2 ke atas. Ini cara modern untuk menangani resource yang perlu ditutup (seperti koneksi database, file, dll) secara otomatis.

1.  Mari kita buat simulasi koneksi database di `InventoryManager.ts`.

<!-- end list -->

```typescript
// src/InventoryManager.ts (tambahkan di paling bawah)

// Simulasi koneksi DB yang perlu ditutup
class DatabaseConnection {
  connect() {
    console.log("LOG: Membuka koneksi database...");
  }

  // Ini adalah method spesial yang akan dipanggil otomatis oleh `using`
  [Symbol.dispose]() {
    console.log("LOG: Koneksi database ditutup secara otomatis!");
  }
}
```

2.  Gunakan `using` di dalam method `listProducts`.

<!-- end list -->

```typescript
// src/InventoryManager.ts
// ... di dalam class InventoryManager ...
public listProducts(): void {
  using db = new DatabaseConnection(); // Deklarasikan dengan `using`
  db.connect(); // Gunakan resource

  if (this.products.length === 0) {
    console.log("Inventaris masih kosong.");
    return; // Saat keluar dari scope ini, `db[Symbol.dispose]()` akan dipanggil
  }
  
  console.log("Daftar Produk di Inventaris (dari 'database'):");
  // ... sisa logika ...
}
// Ketika method ini selesai, koneksi DB akan otomatis ditutup.
// Tidak perlu blok `finally` lagi!
```

Jalankan kembali, dan Anda akan melihat log koneksi dibuka dan ditutup secara otomatis. Ini adalah cara yang sangat bersih dan modern untuk mengelola resource.

-----

### **Jam 3: Asynchronous, Modules & Perkenalan Decorators**

**Tujuan Jam Ini:** Menangani operasi `async`, merapikan struktur proyek, dan melihat pratinjau `decorators` yang menjadi standar baru.

#### **Langkah 7: Bekerja dengan Kode Asinkron (20 menit)**

Di dunia nyata, operasi database atau API tidak instan. Mari kita simulasikan dengan `async/await` dan `Promise`.

1.  Ubah method di `InventoryManager.ts`.

<!-- end list -->

```typescript
// src/InventoryManager.ts
// ... di dalam class InventoryManager ...

// Helper untuk simulasi delay
private simulateDbDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

public async addProduct(product: Product): Promise<void> {
  await this.simulateDbDelay(500); // Tunggu 500ms
  this.products.push(product);
  console.log(`Produk "${product.name}" berhasil ditambahkan ke database.`);
}

public async listProducts(): Promise<Product[]> {
  using db = new DatabaseConnection();
  db.connect();
  await this.simulateDbDelay(1000); // Tunggu 1 detik
  
  console.log("Mengambil daftar produk dari 'database'...");
  return this.products;
}
```

2.  Sesuaikan `src/index.ts` untuk menangani `async`.

<!-- end list -->

```typescript
// src/index.ts

import { InventoryManager, Product, ProductCategory } from './InventoryManager';

async function main() {
  const manager = new InventoryManager();

  // ... (definisi produk tv dan mouse) ...

  await manager.addProduct(tv);
  await manager.addProduct(mouse);

  const allProducts = await manager.listProducts();
  console.log("--- HASIL AKHIR ---");
  allProducts.forEach(p => console.log(`- ${p.name}`));
}

main();
```

Sekarang aplikasi kita mensimulasikan alur kerja backend yang lebih realistis.

#### **Langkah 8: Mengorganisir Kode dengan Modules**

Proyek kita mulai besar. Saatnya memecah file agar lebih rapi.

1.  Buat folder baru: `src/models` dan `src/services`.
2.  Pindahkan `enum ProductCategory` dan `interface Product` ke `src/models/product.model.ts`.
3.  Pindahkan `class InventoryManager` dan `DatabaseConnection` ke `src/services/inventory.service.ts`.
4.  Pastikan untuk menggunakan `export` di file-file tersebut dan `import` di mana pun mereka dibutuhkan.

Struktur Proyek Akhir:

```
ts-inventory-cli/
├── src/
│   ├── models/
│   │   └── product.model.ts  (berisi interface & enum)
│   ├── services/
│   │   └── inventory.service.ts (berisi class InventoryManager)
│   └── index.ts (file utama untuk menjalankan aplikasi)
├── package.json
└── tsconfig.json
```

Ini adalah struktur dasar yang sangat skalabel untuk proyek apa pun.

#### **Langkah 9: Pengenalan Decorators**

Sebelum kita melihat `decorators` kompleks di NestJS, mari kita pahami dasarnya. Sejak TypeScript 5.0, `decorators` sudah menjadi fitur standar (bukan eksperimental lagi).

Mari buat *decorator* sederhana untuk mencatat pemanggilan method.

1.  Buat file `src/decorators/log.decorator.ts`.
2.  Tulis kode decorator.

<!-- end list -->

```typescript
// src/decorators/log.decorator.ts

export function LogMethodCall(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    console.log(`LOG: Memanggil method -> ${propertyKey}`);
    const result = await originalMethod.apply(this, args);
    console.log(`LOG: Selesai memanggil -> ${propertyKey}`);
    return result;
  };

  return descriptor;
}
```

3.  Terapkan di `inventory.service.ts`. Anda perlu mengaktifkan decorator di `tsconfig.json` jika belum (meski standar, kadang perlu flag jika konfigurasinya minimal). Pastikan `"experimentalDecorators": true` ada di `compilerOptions`.

<!-- end list -->

```typescript
// src/services/inventory.service.ts
import { LogMethodCall } from '../decorators/log.decorator';
// ...

export class InventoryManager {
  // ...
  
  @LogMethodCall
  public async listProducts(): Promise<Product[]> {
    // ... isi method tetap sama
  }
}
```

Jalankan lagi proyek Anda. Sekarang setiap kali `listProducts` dipanggil, Anda akan melihat log tambahan secara otomatis\!

#### Ide Lain: Decorator `@MeasureTime` (Pengukur Waktu)

Selain untuk logging, decorator juga sangat berguna untuk *profiling* atau mengukur performa. Berikut adalah contoh decorator sederhana untuk mengukur berapa lama sebuah method dieksekusi.

##### Kode Decorator `@MeasureTime`

Decorator ini akan mencatat waktu sebelum method dijalankan dan sesudahnya, lalu menghitung selisihnya.

```typescript
export function MeasureTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        const start = performance.now(); // Catat waktu mulai
        const result = originalMethod.apply(this, args);

        // Cek apakah method-nya asynchronous (mengembalikan Promise)
        if (result instanceof Promise) {
            return result.then(res => {
                const end = performance.now(); // Catat waktu selesai setelah promise selesai
                console.log(`PERF: Waktu eksekusi '${propertyKey}' adalah ${(end - start).toFixed(2)} ms`);
                return res;
            });
        }

        // Jika method-nya synchronous
        const end = performance.now(); // Catat waktu selesai
        console.log(`PERF: Waktu eksekusi '${propertyKey}' adalah ${(end - start).toFixed(2)} ms`);
        return result;
    };

    return descriptor;
}
```