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