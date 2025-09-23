export function MeasureTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        const start = performance.now(); // Catat waktu mulai
        console.log(`PERF: Memanggil method -> ${propertyKey}`);
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