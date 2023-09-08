import type { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import { error, type SubmitFunction } from "@sveltejs/kit";
import { writable, type Readable } from "svelte/store";

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

    toString() {
        const base = `${this.field} deve essere ${this.expected}`;
        if(this.got) return base + ", ma ottenuto " + this.got;
        else return base;
    }
}

export class PostgrestErrorWrapper implements PostgrestError {
    public readonly message: string;
    public readonly details: string;
    public readonly code: string;
    public readonly hint: string;

    constructor(err: PostgrestError) {
        this.message = err.message;
        this.details = err.details;
        this.code = err.code;
        this.hint = err.hint;
    }
    toString() {
        return `${this.message}: ${this.details} -> ${this.hint}`;
    }
}

export function getDataOrThrow<T>(res: PostgrestSingleResponse<T>): T {
    if(res.error) throw new PostgrestErrorWrapper(res.error);
    return res.data;
}

export function datoInvalido(msg: string): never {
    throw error(400, { message: "Dato non valido", details: msg });
}


type FormError = InvalidField|PostgrestErrorWrapper|string|null;
interface FormStoreData<T> {
    submitting: boolean;
    error: FormError;
    who: T|null;
}
interface FormStore<T> extends Readable<FormStoreData<T>> {
    submit: SubmitFunction;
    get value(): FormStoreData<T>;
    reset(): void;
}
export type ClientFormHandlerCallback<T> = (arg: {formData: FormData, element: HTMLFormElement, who: T}) => Promise<void>

export function clientFormHandler<T = null>(
    get_who: ((arg: {formData: FormData, element: HTMLFormElement}) => T)|null,
    fn: ClientFormHandlerCallback<T>
): FormStore<T>
{
    let submitting = false;
    let error: FormError = null;
    let who: T|null = null;
    const { set, subscribe } = writable<FormStoreData<T>>({submitting, error, who});
    const submit: SubmitFunction = async ({ cancel, formData, formElement: element }) => {
        cancel();
        if(submitting) return;
        submitting = true;
        try {
            who = get_who ? get_who({formData, element}) : null;
            set({submitting, error, who});
            //@ts-ignore
            await fn({formData, element, who});
            error = null;
        }
        catch(err) {
            if(
                err instanceof InvalidField ||
                err instanceof PostgrestErrorWrapper
            ) error = err;
            else {
                console.error(err);
                error = err + '';
            }
        }
        submitting = false;
        who = null;
        set({submitting, error, who});
    }
    return {
        subscribe,
        submit,
        get value() { return {submitting, error, who} },
        reset() {
            error = null;
            set({submitting, error, who});
        }
    }
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
        if(Number.isInteger(v) && v >= 0) return v;
        throw new InvalidField(key, 
            "Lista numeri interi positivi", 
            `${Number.isNaN(v) ? "stringa" : "numero decimale e/o negativo"} al ${i+1}-esimo elemento`
        );
    });
}

export function getStringList(data: FormData, key: string): string[] {
    const res = data.getAll(key);
    for(var i=0; i<res.length; i++) {
        const v = res[i];
        const s = typeof v === "string";
        if(!s || v.length === 0) throw new InvalidField(key, 
            "Lista stringhe", 
            `${s ? "stringa vuota" : v === null ? "niente" : "file"} al ${i+1}-esimo elemento`
        );
    }
    return res as string[];
}