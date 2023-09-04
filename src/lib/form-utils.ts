import { error } from "@sveltejs/kit";

export class InvalidField extends Error {
    public readonly field: string;
    public readonly expected: string;
    public readonly got: string|undefined;

    constructor(field: string, expected: string, got?: string) {
        super();
        this.field = field;
        this.expected = expected
        this.got = got;
    }
}

export function datoInvalido(msg: string): never {
    throw error(400, { message: "Dato non valido", details: msg });
}

export function getMandatoryString(data: FormData, key: string) {
    const v = data.get(key);
    if(typeof v === "string" && v.length > 0) return v;
    throw new InvalidField(key, "stringa non vuota");
}

export function getStringOrNull(data: FormData, key: string) {
    const v = data.get(key);
    if(v instanceof File) throw new InvalidField(key, "stringa opzionale", "file");
    return v||null;
}

export function getInt(data: FormData, key: string) {
    const raw = data.get(key);
    if(typeof raw !== "string") throw new InvalidField(key, "numero intero", raw === null ? "niente" : "file");
    const v = +raw;
    if(Number.isInteger(v)) return v;
    throw new InvalidField(key, "numero intero", Number.isNaN(v) ? "stringa" : "numero decimale");
}

export function getIntList(data: FormData, key: string): number[] {
    return data.getAll(key).map((raw, i) => {
        if(typeof raw !== "string") throw new InvalidField(key, 
            "Lista numeri interi positivi", 
            `${raw === null ? "niente" : "file"} al ${i+1}-esimo elemento`
        );
        const v = +raw;
        if(Number.isInteger(v) && v > 0) return v;
        throw new InvalidField(key, 
            "Lista numeri interi positivi", 
            `${Number.isNaN(v) ? "stringa" : "numero decimale e/o negativo"} al ${i+1}-esimo elemento`
        );
    });
}