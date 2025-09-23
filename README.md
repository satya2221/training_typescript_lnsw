### **Modern Backend Development with NestJS, Advanced TypeScript, ORM, and Redis**

**Target Peserta:** Developer (level junior hingga mid) yang sudah memiliki pengalaman dasar dengan NestJS dan JavaScript/TypeScript.

**Tujuan Pelatihan:**
* Memperkuat pemahaman dan penerapan TypeScript tingkat lanjut dalam konteks NestJS.
* Menguasai interaksi database yang *type-safe* menggunakan ORM modern.
* Memahami dan mengimplementasikan Redis untuk meningkatkan performa dan skalabilitas aplikasi NestJS.

**Metodologi:**
* **Sesi Teori (30%):** Penjelasan konsep dasar dan *best practice*.
* **Live Coding & Demo (50%):** Instruktur membangun fitur secara langsung.
* **Sesi Tanya Jawab & Diskusi (20%):** Interaksi aktif dengan peserta.

---

### **Hari 1 & 2: TypeScript Deep Dive for NestJS Developers**

Tujuannya bukan hanya mengajarkan sintaks TypeScript, tapi **bagaimana TypeScript memberdayakan NestJS** untuk membangun aplikasi yang kokoh dan mudah dikelola.

#### **Hari 1: From JavaScript to Type-Safe Code**
* **Jam 1: Fondasi & Tipe Fundamental**
    * **Recap:** Kenapa TypeScript di NestJS? (Type safety, tooling, skalabilitas).
    * **Tipe Dasar & Kompleks:** `string`, `number`, `boolean`, `array`, `tuple`, `enum`.
    * **Type Aliases** vs **Interfaces**: Kapan dan mengapa memilih salah satunya dalam konteks DTO atau entitas.
    * Studi Kasus: Merefaktor *controller* NestJS sederhana dari JavaScript-*style* ke TypeScript yang ketat.

* **Jam 2: Generics & Utility Types**
    * **Konsep Generics:** Membuat komponen (fungsi, class, interface) yang *reusable* dan *type-safe*.
    * Contoh Praktis: Membuat *generic repository/service* dasar di NestJS.
    * **Utility Types yang Wajib Tahu:** `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,T>`.
    * Studi Kasus: Menggunakan `Partial<T>` untuk *update DTO* agar tidak semua properti wajib diisi.

* **Jam 3: Decorators & Metadata Reflection**
    * **Membongkar Sihir NestJS:** Apa itu *Decorator* (`@Controller`, `@Injectable`, `@Get`)? Bagaimana cara kerjanya secara konseptual?
    * Penjelasan singkat tentang *metadata reflection API*.
    * Studi Kasus: Membuat *custom decorator* sederhana, misalnya `@User()` untuk mengambil data user dari *request*.

#### **Hari 2: Building Robust & Scalable APIs**
* **Jam 1: Data Transfer Objects (DTO) & Validasi**
    * Pentingnya DTO sebagai "kontrak" API.
    * Implementasi validasi otomatis menggunakan **`class-validator`** dan **`class-transformer`**.
    * Studi Kasus: Membuat `CreateProductDto` dengan validasi (`@IsString`, `@IsNotEmpty`, `@MinLength`, dll) dan melihat bagaimana NestJS `ValidationPipe` bekerja.

* **Jam 2: Advanced Error Handling & Exception Filters**
    * Pola penanganan error di NestJS.
    * Membuat *custom exception* (misal: `ProductNotFoundException`).
    * Mengimplementasikan *Exception Filter* untuk menangani *exception* secara global dan memberikan respons error yang konsisten.

* **Jam 3: Asynchronous Patterns & Best Practices**
    * Review `async/await` dalam konteks *services* dan *controllers*.
    * Menangani *multiple promises* (`Promise.all`, `Promise.allSettled`).
    * *Best Practice*: Menghindari *race condition* sederhana dan pentingnya konsistensi dalam *return type* (selalu `Promise<T>`).
    * Secure Coding di NestJS/Typescript

---

### **Hari 3: Type-Safe Data Persistence with ORM**

Fokus pada satu ORM modern yang memiliki integrasi TypeScript terbaik. **Prisma** adalah pilihan yang sangat baik di sini, selain **TypeORM** yang juga populer.

* **Jam 1: Pengenalan ORM & Prisma**
    * **Apa itu ORM?** Kelebihan & Kekurangan.
    * **Kenapa Prisma?** (Schema-first approach, auto-generated client, type-safety maksimal).
    * Setup Prisma di proyek NestJS: `schema.prisma`, koneksi ke PostgreSQL & MongoDB (menjelaskan perbedaannya).
    * Menjalankan *migration* pertama kali untuk PostgreSQL.

* **Jam 2: CRUD Operations & Service Integration**
    * **Live Coding:** Membuat `ProductModule` di NestJS.
    * Mengintegrasikan `PrismaClient` ke dalam `ProductService`.
    * Implementasi fungsi `create`, `findAll`, `findOne`, `update`, `delete` dengan Prisma Client yang sepenuhnya *type-safe*.

* **Jam 3: Relasi & Transaksi**
    * Mendefinisikan relasi di `schema.prisma` (misal: User dan Product).
    * *Querying* data dengan relasi (contoh: `include` dan `select`).
    * Pengenalan transaksi untuk memastikan integritas data pada operasi yang melibatkan banyak tabel (`$transaction`).
    * Optimasi Query di ORM

---

### **Hari 4: Supercharging NestJS with Redis**

Membahas Redis dari konsep umum hingga implementasi praktis untuk kasus penggunaan paling umum di backend.

* **Jam 1: Redis Fundamentals**
    * **Apa itu Redis?** (In-memory data store, NoSQL Key-Value).
    * **Struktur Data Utama:** Strings, Hashes, Lists, Sets. Kapan menggunakannya?
    * **Kasus Penggunaan Umum:** Caching, Session Management, Real-time Leaderboards, Message Brokering (Queues).

* **Jam 2: Implementing Caching Strategies**
    * Mengapa *caching* itu penting?
    * **Implementasi Cache Sederhana:** Menggunakan `CacheModule` bawaan NestJS yang dikonfigurasi dengan Redis.
    * **Caching Otomatis:** Menggunakan `CacheInterceptor` untuk *cache* respons dari *endpoint* yang jarang berubah.
    * **Caching Manual:** Menyimpan dan mengambil data secara manual di dalam *service* untuk logika yang lebih kompleks.

* **Jam 3: Introduction to Background Jobs (Queues)**
    * Konsep *Message Queue*: Kenapa kita perlu memproses tugas di *background*? (Contoh: mengirim email, proses video, generate report).
    * Integrasi NestJS dengan **BullMQ**: Pustaka antrian populer yang menggunakan Redis.
    * **Live Coding:** Membuat *job producer* (misal: saat user registrasi, sebuah `send-welcome-email` *job* ditambahkan ke *queue*) dan *job consumer* (sebuah *processor* yang akan mengambil *job* dari *queue* dan "mengirim email").
