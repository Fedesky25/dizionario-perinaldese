import { error } from "@sveltejs/kit";

export function datoInvalido(msg: string): never {
    throw error(400, { message: "Dato non valido", details: msg });
}

export function getMandatoryString(data: FormData, key: string) {
    const v = data.get(key);
    if(typeof v === "string" && v.length > 0) return v;
    datoInvalido(`"${key}" deve essere una stringa non vuota`);
}

export function getStringOrNull(data: FormData, key: string) {
    const v = data.get(key);
    if(v instanceof File) datoInvalido(`"${key}" non può essere un file`);
    return v||null;
}

export function getInt(data: FormData, key: string) {
    const raw = data.get("key");
    if(typeof raw !== "string") datoInvalido(`"${key}" deve essere un numero intero`);
    const v = +raw;
    if(!Number.isInteger(v)) datoInvalido(`"${key}" deve essere un numero intero`);
    return v;
}

export function getIntList(data: FormData, key: string): number[] {
    return data.getAll(key).map(raw => {
        if(typeof raw !== "string") datoInvalido(`${key} devono essere numeri interi positivi`);
        const v = +raw;
        if(Number.isInteger(v) && v > 0) return v;
        datoInvalido(`${key} devono essere numeri interi positivi`);
    });
}