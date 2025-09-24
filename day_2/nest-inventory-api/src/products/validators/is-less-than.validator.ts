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