### **Hari 2: Membangun API Profesional & Aman dengan NestJS 🛡️**

**Selamat Datang di Hari Kedua\!**
Kemarin kita telah menguasai TypeScript murni dengan membangun aplikasi CLI. Hari ini, kita akan naik level. Kita akan membawa semua pengetahuan tersebut ke dunia pengembangan web backend profesional dengan **NestJS**.

**Tujuan Hari Ini:**

  * Membangun sebuah API RESTful dari nol menggunakan NestJS CLI.
  * Mengaktifkan dokumentasi API interaktif (**Swagger/OpenAPI**).
  * Memahami arsitektur inti NestJS: *Modules, Controllers, & Services*.
  * Menerapkan validasi input tingkat lanjut, termasuk membuat **validator kustom**.
  * Mengintegrasikan praktik **secure coding** yang proaktif di setiap tahap pengembangan.

-----

### **Jam 1: Proyek NestJS Pertama & Arsitektur Inti**

**Tujuan Jam Ini:** Dari terminal kosong menjadi sebuah *endpoint* API yang berjalan, sambil memahami "cara berpikir" NestJS.

#### **Langkah 1: Instalasi NestJS CLI & Pembuatan Proyek**

NestJS memiliki Command-Line Interface (CLI) yang sangat powerful untuk mempercepat pengembangan.

1.  **Install NestJS CLI secara global:**
    ```bash
    npm install -g @nestjs/cli
    ```
2.  **Buat Proyek API Baru:** CLI akan membuatkan seluruh struktur proyek untuk kita.
    ```bash
    nest new nest-inventory-api
    ```
    Pilih `npm` saat ditanya package manager.
3.  **Jalankan Aplikasi untuk Pertama Kali:**
    ```bash
    cd nest-inventory-api
    npm run start:dev
    ```
    Perintah ini akan menjalankan server dalam *watch mode* (otomatis me-restart saat ada perubahan kode). Buka browser atau Postman Anda dan akses `http://localhost:3000`. Anda akan disambut dengan "Hello World\!".

#### **Langkah 2: Memahami Struktur & Arsitektur Inti NestJS**

Buka proyek di VS Code. Mari kita gunakan **analogi sebuah restoran** untuk memahaminya:

  * `src/main.ts`: 🏢 **Manajer Restoran**. Ini adalah pintu masuk aplikasi. Fungsinya adalah "membuka restoran" (membuat instance aplikasi NestJS) dan mengaturnya untuk "mendengarkan pesanan" di sebuah port.
  * `src/app.module.ts`: 🍳 **Dapur Utama**. *Module* adalah unit organisasi di NestJS yang mendaftarkan semua "stasiun masak" (Controllers) dan "koki" (Services).
  * `src/app.controller.ts`: 🤵 **Pelayan**. *Controller* bertugas menerima "pesanan" dari luar (request HTTP). Ia tahu pesanan apa yang harus diterima (`@Get`, `@Post`) dan ke "koki" mana pesanan itu harus diteruskan.
  * `src/app.service.ts`: 👨‍🍳 **Koki**. *Service* adalah tempat semua pekerjaan dan logika bisnis terjadi. Ia tidak tahu menahu tentang request HTTP; ia hanya menerima perintah dari *Controller* dan mengolah data.

Pemisahan ini (*Separation of Concerns*) adalah kunci untuk membangun aplikasi yang besar dan mudah dikelola.

#### **Langkah 3: Membuat *Resource* Pertama dengan CLI**

Kita akan membuat *resource* untuk `products`.

1.  **Jalankan perintah `resource` dari NestJS CLI:**

    ```bash
    nest generate resource products
    ```

      * Pilih `REST API`.
      * Jawab `y` (yes) untuk "Would you like to generate CRUD entry points?".

2.  **Apa yang Terjadi?** CLI secara ajaib telah membuat:

      * `src/products/`: Folder baru untuk semua hal terkait produk.
      * `products.module.ts`: "Stasiun masak" khusus untuk produk.
      * `products.controller.ts`: "Pelayan" yang siap menerima pesanan untuk `/products`.
      * `products.service.ts`: "Koki" yang siap mengolah data produk.
      * `dto/` dan `entities/`: Folder untuk struktur data kita.

CLI juga otomatis mendaftarkan `ProductsModule` di `app.module.ts`. Jalankan Postman dan coba akses `GET http://localhost:3000/products`. Anda akan mendapatkan respons dari *endpoint* baru Anda\!

**Rekap Jam 1:** Kita berhasil membuat dan menjalankan aplikasi NestJS, memahami arsitektur dasarnya, dan membuat *resource* API lengkap hanya dengan satu perintah.

-----

### **Jam 2: Dokumentasi, Validasi Lanjutan, & Input Aman**

**Tujuan Jam Ini:** Mendokumentasikan API secara otomatis dan menerapkan aturan validasi yang kompleks untuk benteng pertahanan pertama aplikasi kita.

#### **Langkah 4: Mendefinisikan "Kontrak" API dengan DTO & Entity**

DTO (Data Transfer Object) adalah cetak biru untuk data.

1.  Buat `enum` dan `class` entity di `src/products/entities/product.entity.ts`.
    ```typescript
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
    }
    ```
2.  Definisikan DTO di `src/products/dto/create-product.dto.ts`.
    ```typescript
    // src/products/dto/create-product.dto.ts
    import { ProductCategory } from '../entities/product.entity';

    export class CreateProductDto {
      name: string;
      brand: string;
      price: number;
      quantity: number;
      category: ProductCategory;
    }
    ```

#### **Langkah 5: Mengaktifkan Dokumentasi API Interaktif (Swagger)**

Mari buat API kita bisa "menjelaskan dirinya sendiri".

1.  **Install dependensi Swagger:**
    ```bash
    npm install @nestjs/swagger
    ```
2.  **Konfigurasi di `main.ts`:**
    ```typescript
    // src/main.ts
    import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);

      const config = new DocumentBuilder()
        .setTitle('Inventory API')
        .setDescription('API documentation for the Inventory Management system')
        .setVersion('1.0')
        .addTag('products')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api-docs', app, document); // UI Swagger akan tersedia di /api-docs

      // ... sisa kode
      await app.listen(3000);
    }
    bootstrap();
    ```
3.  **Lihat Hasilnya:** Restart aplikasi, lalu buka `http://localhost:3000/api-docs`. Anda akan melihat UI Swagger yang interaktif.

#### **Langkah 6: Implementasi Validasi Dasar & Kustom (35 menit)**

1.  **Install dependensi:**

    ```bash
    npm install class-validator class-transformer
    ```

2.  **Tambahkan Decorator Validasi Dasar ke DTO:**

    ```typescript
    // src/products/dto/create-product.dto.ts
    import { ApiProperty } from '@nestjs/swagger';
    import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';
    import { ProductCategory } from '../entities/product.entity';

    export class CreateProductDto {
      @ApiProperty({ example: 'Wireless Keyboard', description: 'The name of the product' })
      @IsString() @IsNotEmpty() name: string;
      
      @ApiProperty() @IsString() @IsNotEmpty() brand: string;
      
      @ApiProperty({ example: 500000 })
      @IsNumber() @Min(0) price: number;
      
      @ApiProperty({ example: 10 })
      @IsNumber() @Min(0) quantity: number;
      
      @ApiProperty({ enum: ProductCategory })
      @IsEnum(ProductCategory) category: ProductCategory;
    }
    ```

3.  **Buat Validator Kustom (Cross-Field Validation):**
    Skenario: Kita ingin menambahkan `salePrice` yang *harus* lebih rendah dari `price`.
    a. Buat file validator: `src/products/validators/is-less-than.validator.ts`

    ```typescript
    import {
        ValidatorConstraint,
        ValidatorConstraintInterface,
        ValidationArguments,
        registerDecorator,
        ValidationOptions,
    } from 'class-validator';

    @ValidatorConstraint({ name: 'isLessThan', async: false })
    export class IsLessThanConstraint implements ValidatorConstraintInterface {
    // Method ini dijalankan otomatis oleh class-validator untuk mengecek apakah nilai valid.
    validate(propertyValue: unknown, args: ValidationArguments) {
        // Ambil nama properti pembanding dari daftar constraint yang kita kirim lewat decorator.
        const [relatedPropertyName] = args.constraints as [string];
        // args.object adalah instance DTO yang sedang divalidasi; kita baca nilainya sebagai objek biasa.
        const relatedObject = args.object as Record<string, unknown>;
        // Ambil nilai properti pembanding berdasarkan nama yang sudah kita dapatkan.
        const relatedValue = relatedObject[relatedPropertyName];

        // Jika salah satu bukan number, langsung gagal supaya validasi lebih eksplisit.
        if (typeof propertyValue !== 'number' || typeof relatedValue !== 'number') {
        return false;
        }

        // Bandingkan nilai saat ini dengan nilai properti yang dijadikan patokan.
        return propertyValue < relatedValue;
    }
    defaultMessage(args: ValidationArguments) {
        // Pesan default ketika validasi gagal, menampilkan nama properti terkait untuk memudahkan debugging.
        const [relatedPropertyName] = args.constraints as [string];
        return `"${args.property}" must be less than "${relatedPropertyName}"`;
    }
    }

    export function IsLessThan(
    property: string,
    validationOptions?: ValidationOptions,
    ) {
    // Decorator factory: menghasilkan decorator yang siap dipakai di DTO field.
    return function (object: object, propertyName: string) {
        // registerDecorator mendaftarkan constraint kustom ini ke property target.
        registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [property],
        validator: IsLessThanConstraint,
        });
    };
    }

    ```

    b. Gunakan decorator kustom di `update-product.dto.ts` (karena harga diskon biasanya saat update).

    ```typescript
    // src/products/dto/update-product.dto.ts
    import { PartialType } from '@nestjs/swagger';
    import { CreateProductDto } from './create-product.dto';
    import { IsNumber, IsOptional, Min } from 'class-validator';
    import { IsLessThan } from '../validators/is-less-than.validator';

    export class UpdateProductDto extends PartialType(CreateProductDto) {
      @IsOptional() @IsNumber() @Min(0)
      @IsLessThan('price', { message: 'Sale price must be lower than the regular price' })
      salePrice?: number;
    }
    ```

4.  **Aktifkan `ValidationPipe` Global di `main.ts`:**

    ```typescript
    // src/main.ts
    import { ValidationPipe } from '@nestjs/common';
    // ...
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    ```

5.  **Uji Coba:** Lakukan `POST` dan `PATCH` dari Postman/Swagger. Coba kirim data yang salah, atau `salePrice` lebih tinggi dari `price`. Anda akan melihat error 400 yang spesifik.

**Rekap Jam 2:** API kita kini memiliki dokumentasi *self-service* dan aturan validasi yang canggih untuk memastikan integritas data.

-----

### **Jam 3: Konfigurasi, Error Handling, & Keamanan Proaktif**

**Tujuan Jam Ini:** Memperkuat aplikasi dengan konfigurasi aman, penanganan error yang baik, dan memperkenalkan tool keamanan modern.

#### **Langkah 7: Manajemen Konfigurasi dengan `.env` (15 menit)**

Menyimpan konfigurasi (port, kredensial DB) di kode itu tidak aman.

1.  **Install:** `npm install @nestjs/config`
2.  **Daftarkan di `app.module.ts`:**
    ```typescript
    // src/app.module.ts
    import { ConfigModule } from '@nestjs/config';
    @Module({
      imports: [ ConfigModule.forRoot({ isGlobal: true }), ProductsModule ],
      // ...
    })
    export class AppModule {}
    ```
3.  **Buat file `.env`** di root proyek:
    ```
    PORT=3333
    ```
4.  **Gunakan di `main.ts`:**
    ```typescript
    // src/main.ts
    import { ConfigService } from '@nestjs/config';
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT');
    await app.listen(port);
    ```

**Poin Secure Coding:** **Selalu tambahkan `.env` ke file `.gitignore` Anda\!**

#### **Langkah 8: Penanganan Error yang Elegan**

Service harus melempar error yang jelas saat data tidak ditemukan.

1.  **Simulasikan data dan logika di `products.service.ts`:**
    ```typescript
    // src/products/products.service.ts
    import { Injectable, NotFoundException } from '@nestjs/common';
    import { Product } from './entities/product.entity';

    @Injectable()
    export class ProductsService {
      private products: Product[] = [];
      private idCounter = 1;
      
      create(createProductDto: CreateProductDto) { /* ... */ }
      findAll() { return this.products; }
      
      findOne(id: number) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
          throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
      }
      // ...
    }
    ```
2.  **Uji Coba:** Coba `GET /products/99`. NestJS akan menangkap `NotFoundException` dan mengirim respons `404 Not Found` yang bersih, tanpa membocorkan detail internal (*stack trace*).

#### **Langkah 9: Praktik Keamanan Proaktif**

`npm audit` adalah langkah reaktif yang bagus. Mari menjadi lebih proaktif.

1.  **Secret Scanning (Pencegahan Kebocoran Kredensial):**

      * **Masalah:** Developer tidak sengaja `commit` API key atau password ke Git.
      * **Solusi:** Gunakan tools seperti **TruffleHog** (open-source) atau **GitGuardian** (SaaS) untuk memindai kode dan riwayat Git Anda dari kredensial yang bocor secara otomatis.

2.  **Static Application Security Testing (SAST):**

      * **Konsep:** Menganalisis kode sumber untuk mencari celah keamanan **tanpa perlu menjalankan aplikasi**. Ini seperti memiliki seorang ahli keamanan yang membaca kode Anda.
      * **Solusi:**
          * **SonarLint (Untuk Developer):** Ekstensi gratis untuk IDE (VS Code, JetBrains). Install di VS Code Anda, ia akan memberikan saran perbaikan keamanan secara *real-time* saat Anda mengetik.
          * **SonarQube (Untuk Tim/CI/CD):** Versi server dari Sonar yang memberikan laporan kesehatan dan keamanan proyek secara keseluruhan, biasanya terintegrasi dalam alur CI/CD.

**Poin Secure Coding:** Dengan mengadopsi *secret scanning* dan SAST, kita memindahkan deteksi keamanan dari "setelah terjadi" menjadi "saat pengembangan", yang jauh lebih murah dan aman.

-----

**Rekap & Penutup Hari ke-2**
Hari ini kita telah melakukan lompatan besar. Kita tidak hanya membangun sebuah API, tapi kita membangunnya dengan cara yang benar:

  * **Terdokumentasi** dengan Swagger/OpenAPI.
  * **Dilindungi** dengan validasi input dasar dan kustom.
  * **Dikonfigurasi** secara aman menggunakan environment variables.
  * **Diperkuat** dengan praktik keamanan proaktif menggunakan tools SAST dan *secret scanning*.

Fondasi ini sangat penting. Besok, kita akan siap untuk menghubungkan API profesional kita ini ke database sungguhan menggunakan ORM.