
### **Hari 4: Supercharging API dengan Redis 🚀**

**Selamat Datang di Hari Terakhir\!**
Kita telah membangun API yang solid dengan NestJS dan ORM. Hari ini, kita akan membawanya ke level performa dan skalabilitas berikutnya. Kita akan mengintegrasikan **Redis** untuk mengimplementasikan dua pola arsitektur yang sangat penting: **Caching** untuk respons secepat kilat dan **Background Jobs (Queues)** untuk tugas yang tangguh dan tidak memblokir.

**Prasyarat:**

* Proyek NestJS dengan TypeORM yang sudah berfungsi (seperti yang Anda sediakan).
* Kontainer Docker dari `docker-compose.yml` (terutama `postgres-db` dan `redis-cache`) sedang berjalan.

**Tujuan Hari Ini:**

* Mengkonfigurasi *caching* Redis menggunakan pola modern `registerAsync` dan `@keyv/redis`.
* Menerapkan *caching* global dan manual secara efektif dalam arsitektur TypeORM.
* Menguasai pola `WorkerHost` baru di BullMQ untuk membuat *background jobs*.
* Memastikan API tetap cepat dan responsif bahkan saat menangani tugas yang berat.

-----

### **Jam 1: Redis Fundamentals & Caching Modern**

**Tujuan Jam Ini:** Memahami peran Redis dan mengimplementasikan *caching* di seluruh aplikasi menggunakan pola-pola terbaru.

#### **Langkah 1: Apa itu Redis?**

* **Analogi Etalase Toko:** Bayangkan database PostgreSQL Anda adalah gudang besar. Mengambil barang dari sana butuh waktu. **Redis adalah etalase di depan toko**. Barang yang paling sering dicari ditaruh di sini. Mengambil dari etalase jauh lebih cepat daripada harus pergi ke gudang. \* **Secara Teknis:** Redis adalah **in-memory data store**, artinya data disimpan di RAM, membuatnya super cepat untuk operasi baca/tulis.
* **Fokus Kita Hari Ini:**
    1.  **Caching:** Menyimpan hasil *query* database agar tidak perlu diulang-ulang.
    2.  **Message Queuing:** Menjadi "kotak surat" untuk pekerjaan yang bisa ditunda.

#### **Langkah 2: Setup Caching Module dengan `@keyv/redis` (Async Factory)**

Seperti yang Anda tunjukkan di file `app.module.ts`, pola `registerAsync` adalah cara yang fleksibel dan modern untuk mengkonfigurasi modul.

1.  **Pastikan Dependensi Terinstall:** File `package.json` Anda sudah memiliki semua yang dibutuhkan:

    ```json
    "@nestjs/cache-manager": "^3.0.1",
    "cache-manager": "^7.2.2",
    "@keyv/redis": "^5.1.2"
    ```

2.  **Konfigurasi di `app.module.ts`:**
    Pola ini sangat kuat karena memungkinkan kita meng-inject dependensi lain (seperti `ConfigService`) untuk membangun konfigurasi secara dinamis.

    ```typescript
    // src/app.module.ts
    import { Module } from '@nestjs/common';
    import { CacheModule } from '@nestjs/cache-manager';
    import { createKeyv } from '@keyv/redis';
    // ... import lainnya

    @Module({
      imports: [
        // ... ConfigModule, BullModule, TypeOrmModule
        CacheModule.registerAsync({
            // Pola factory ini memungkinkan konfigurasi dinamis
            useFactory: async () => ({
                // createKeyv adalah fungsi dari @keyv/redis
                stores: [createKeyv('redis://:redispassword123@localhost:6379/0')],
                ttl: 60 * 1000, // TTL default 60 detik
            }),
            isGlobal: true, // Membuat cache manager tersedia di seluruh aplikasi
        }),
        // ...
      ],
      // ...
    })
    export class AppModule {}
    ```

#### **Langkah 3: Implementasi Caching Global dengan `APP_INTERCEPTOR`**

Daripada mendekorasi setiap *endpoint* `GET` dengan `@UseInterceptors(CacheInterceptor)`, kita bisa menerapkannya sekali untuk seluruh aplikasi. Ini adalah praktik yang bersih dan efisien.

* **Konfigurasi di `app.module.ts`:**
  File Anda sudah mengimplementasikan ini dengan benar.
  ```typescript
  // src/app.module.ts
  import { APP_INTERCEPTOR } from '@nestjs/core';
  import { CacheInterceptor } from '@nestjs/cache-manager';

  @Module({
      // ... imports
      controllers: [AppController],
      providers: [
          AppService,
          {
              provide: APP_INTERCEPTOR,
              useClass: CacheInterceptor, // Terapkan CacheInterceptor secara global
          },
      ],
  })
  export class AppModule {}
  ```
  Sekarang, **semua request `GET`** di aplikasi Anda secara otomatis akan di-cache. Untuk mengontrolnya, kita tetap bisa menggunakan decorator `@CacheKey('...')` dan `@CacheTTL(...)` di level controller jika butuh kustomisasi.

#### **Langkah 4: Verifikasi Caching**

1.  **Uji Coba:** Jalankan `GET http://localhost:3000/products`. Panggilan **pertama** akan menjalankan *query* ke database (terlihat di log). Panggilan **kedua** akan instan dan tidak ada *query* baru di log.
2.  **Lihat di Redis:** Gunakan `docker exec -it day3-redis redis-cli` dan `GET "/products"` untuk melihat data cache secara langsung.

**Rekap Jam 1:** Kita telah berhasil mengintegrasikan Redis Cache dengan pola `async factory` yang modern dan menerapkannya secara global ke seluruh aplikasi kita.

-----

### **Jam 2: Caching Manual & Invalidation dengan TypeORM**

**Tujuan Jam Ini:** Mengambil kontrol penuh atas *cache* dengan implementasi manual di level *service* dan menjaga data tetap konsisten saat ada perubahan.

#### **Langkah 5: Implementasi Caching Manual di Service**

Untuk logika yang lebih kompleks seperti pada `findOne`, kita terapkan caching manual di dalam *service*. Kode `products.service.ts` Anda sudah menjadi contoh sempurna.

* **Inject `CACHE_MANAGER`:**

  ```typescript
  // src/products/products.service.ts
  import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

  @Injectable()
  export class ProductsService {
      constructor(
          // ... InjectRepository
          @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
          // ... InjectQueue
      ) {}
  }
  ```

* **Logika di `findOne`:**
  Alur logikanya sangat jelas:

    1.  Cek cache terlebih dahulu dengan `this.cacheManager.get()`.
    2.  Jika ada (*cache hit*), kembalikan data dari cache.
    3.  Jika tidak ada (*cache miss*), ambil dari database menggunakan `this.productRepository.findOne()`.
    4.  Simpan hasilnya ke cache dengan `this.cacheManager.set()` sebelum dikembalikan.

  <!-- end list -->

  ```typescript
  // src/products/products.service.ts
  async findOne(id: number): Promise<Product> {
      const cacheKey = `product_${id}`;
      const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
      if (cachedProduct) {
          console.log(`--- Mengambil data dari CACHE (findOne: ${cacheKey}) ---`);
          return cachedProduct;
      }

      console.log(`--- Mengambil data dari DATABASE (findOne: ${id}) ---`);
      const product = await this.productRepository.findOne({ /* ... */ });
      if (!product) {
          throw new NotFoundException(/* ... */);
      }

      await this.cacheManager.set(cacheKey, product);
      return product;
  }
  ```

#### **Langkah 6: Cache Invalidation yang Benar**

Ini adalah bagian terpenting. Saat data berubah, cache *harus* dihapus. Kode Anda sudah mengimplementasikan ini dengan sangat baik.

1.  **Invalidation saat `update` dan `remove`:**
    Setelah operasi database berhasil, kita hapus *cache* untuk item spesifik (`product_${id}`) dan juga *cache* untuk daftar semua produk (`all_products` atau `"/products"` tergantung kunci yang dibuat interceptor).
    ```typescript
    // src/products/products.service.ts
    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const result = await this.productRepository.update(id, updateProductDto);
        if (result.affected === 0) {
            throw new NotFoundException(/* ... */);
        }
        
        // Hapus cache yang sudah tidak valid
        await this.cacheManager.del(`product_${id}`);
        await this.cacheManager.del('/products'); // Kunci default dari interceptor
        
        return this.productRepository.findOne({/* ... */}) as Promise<Product>;
    }

    async remove(id: number): Promise<{ message: string }> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(/* ... */);
        }

        await this.cacheManager.del(`product_${id}`);
        await this.cacheManager.del('/products');
        
        return { message: `Product with ID ${id} has been successfully removed` };
    }
    ```
2.  **Invalidation saat `create`:**
    Sama halnya, saat produk baru dibuat, daftar semua produk harus diperbarui.
    ```typescript
    // src/products/products.service.ts
    async create(createProductDto: CreateProductDto): Promise<Product> {
        // ... logika save produk
        await this.cacheManager.del('/products');
        // ... logika add job ke queue
        return savedProductWithRelations;
    }
    ```

**Rekap Jam 2:** Kita berhasil mengimplementasikan strategi caching yang komprehensif, menggabungkan kemudahan interceptor global dengan kekuatan kontrol manual di service, dan yang terpenting, menjaga konsistensi data dengan *cache invalidation*.

-----

### **Jam 3: Background Jobs dengan BullMQ (Pola `WorkerHost`)**

**Tujuan Jam Ini:** Memindahkan proses yang lambat ke latar belakang menggunakan pola `WorkerHost` terbaru agar API tetap responsif.

#### **Langkah 7: Konsep Queues & Setup BullMQ**

* **Konsep:** Saat pengguna membuat produk baru, kita tidak ingin membuatnya menunggu 5 detik sementara kita men-generate laporan. Kita ambil pesanannya, taruh di "antrian" (Queue), dan biarkan "pekerja" (Processor/Worker) di belakang layar yang mengerjakannya.
* **Setup:** Konfigurasi di `app.module.ts` dan `products.module.ts` Anda sudah benar, mendaftarkan koneksi global dan *queue* spesifik bernama `'report-queue'`.

#### **Langkah 8: Membuat Producer & Consumer (Pola `WorkerHost`)**

Ini adalah perubahan besar dari versi lama. Mari kita bedah kode Anda.

1.  **Producer (di `products.service.ts`):**

    * `@InjectQueue('report-queue')` di-inject ke constructor.
    * Setelah produk berhasil disimpan ke database, pekerjaan ditambahkan ke antrian dengan `this.reportQueue.add(...)`. Ini adalah praktik yang baik, memastikan pekerjaan hanya ditambahkan jika transaksi database berhasil.

    <!-- end list -->

    ```typescript
    // src/products/products.service.ts
    async create(createProductDto: CreateProductDto): Promise<Product> {
        // ... logika save
        const savedProduct = await this.productRepository.save(product);
        
        // Tambahkan pekerjaan ke queue
        await this.reportQueue.add('generate-report', {
            productId: savedProduct.id,
            requestedBy: 'admin@example.com',
        });
        
        // ...
        return savedProductWithRelations;
    }
    ```

2.  **Consumer (di `report.processor.ts`):**
    Ini adalah pola `WorkerHost` yang modern.

    * `@Processor('report-queue')` tetap digunakan untuk mengikat kelas ini ke antrian yang benar.
    * Kelasnya `extends WorkerHost`.
    * Tidak ada lagi decorator `@Process`. Logika utama ada di dalam satu method: `async process(job: Job)`.
    * Kita menggunakan `job.name` untuk membedakan jenis pekerjaan jika ada beberapa dalam satu antrian.

    <!-- end list -->

    ```typescript
    // src/products/report.processor.ts
    import { Processor, WorkerHost } from '@nestjs/bullmq';
    import { Job } from 'bullmq';

    @Processor('report-queue')
    export class ReportProcessor extends WorkerHost {
        async process(job: Job, token?: string): Promise<any> {
            if (job.name === 'generate-report') {
                console.log('--- MEMULAI PROSES GENERATE LAPORAN UNTUK JOB:', job.id, '---');
                console.log('Data pekerjaan:', job.data);

                await new Promise<void>((resolve) => setTimeout(resolve, 5000));

                console.log(`✅ Laporan untuk produk #${job.data.productId} SELESAI.`);
                return {};
            } else {
                throw new Error("Tipe job tidak dikenal.");
            }
        }
    }
    ```

3.  **Registrasi:** Pastikan `ReportProcessor` terdaftar sebagai *provider* di `products.module.ts` agar NestJS bisa menemukannya.

#### **Langkah 9: Verifikasi End-to-End**

1.  Jalankan aplikasi.
2.  Gunakan Postman untuk `POST` produk baru ke `/products`. Anda akan mendapatkan respons **cepat**.
3.  Segera lihat terminal. Anda akan melihat log `POST /products 201 ...` selesai, dan beberapa saat kemudian, log `--- MEMULAI PROSES GENERATE LAPORAN... ---` muncul, diikuti oleh log `✅ Laporan ... SELESAI.` setelah 5 detik. Ini adalah bukti nyata bahwa proses berat berjalan secara asinkron di latar belakang.
