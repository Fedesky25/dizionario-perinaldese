import { TipoVerbo, type ConiugazioneRaw, type Declinazione, type Esempio, type TempiRaw, type Voci, type VociImperative } from "$lib/words/types";
import { InvalidField, getInt, getIntList, getMandatoryString, getStringOrNull } from "$lib/form-utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { postgresError2HTTPError } from "$lib/db";
import { error } from "@sveltejs/kit";

import type { RouteParams } from "./$types";

export function getID(params: RouteParams) {
    const id = +params.id;
    if(!Number.isInteger(id) || id < 0) throw error(400, `${params.id} non è un ID valido`);
    return id;
}

function isNonEmptyString<T = any>(v: T): T extends string ? boolean : false {
    //@ts-ignore
    return (typeof v === "string") && v.length > 0;
}

function getEsempi(data: FormData) {
    const originali = data.getAll("esempi.originale");
    const traduzioni = data.getAll("esempi.traduzione");

    const res: Esempio[] = [];
    const len = originali.length;
    if(len !== traduzioni.length) throw new InvalidField("esempi", 
        "lista di stringhe per originali e traduzioni", 
        "numeri di traduzioni e originali non combaciano");
    for(var i=0; i<len; i++) {
        if(!isNonEmptyString(originali[i])) throw new InvalidField(`originale del ${i+1}-esimo esempio`, "stringa non vuota", "mancante");
        if(!isNonEmptyString(traduzioni[i])) throw new InvalidField(`traduzione del ${i+1}-esimo esempio`, "stringa non vuota", "mancante");
        //@ts-ignore
        res.push({ originale: originali[i], traduzione: traduzioni[i] });
    }

    return res;
}

export function getCollegamenti(data: FormData) {
    const vedi_anche = getIntList(data,"vedi_anche");
    const sinonimi = getIntList(data,"sinonimi");
    const contrari = getIntList(data,"contrari");
    const tipologie: number[] = Array.prototype.concat.call(
        new Array(vedi_anche.length).fill(0),
        new Array(sinonimi.length).fill(1),
        new Array(contrari.length).fill(2),
    );
    const parole_collegate: number[] = Array.prototype.concat.call(
        vedi_anche, sinonimi, contrari
    );
    return {riferimento: 0, tipologie, parole_collegate};
}

function getDeclinazione(data: FormData, key: string): Declinazione|null {
    if(data.get(key) === "NULL") return null;
    return {
        ms: getStringOrNull(data, key + ".ms"),
        mp: getStringOrNull(data, key + ".mp"),
        fs: getStringOrNull(data, key + ".fs"),
        fp: getStringOrNull(data, key + ".fp"),
    };
}

async function addDeclinazione(v: Declinazione, supabase: SupabaseClient) {
    const res = await supabase.from("declinazioni").insert(v).select("id");
    if(res.error) throw postgresError2HTTPError(res.error);
    return res.data[0].id;
}

type ConiugazioneDB = Omit<ConiugazioneRaw, "participio"> & {
    participio: number | null
}

function getTempo<L extends 5|6>(data: FormData, index: number, len: L) {
    if(data.get(`tempo.${index}.default`)) return null;
    const voci = data.getAll(`tempo.${index}`);
    if(voci.length === len && voci.every(v => (typeof v === "string" && v.length > 0))) return voci as (L extends 6 ? Voci : VociImperative);
    throw new InvalidField(`tempo.${index}`, `lista di ${len} stringhe non vuote`);
}

function getConiugazione(data: FormData): ConiugazioneDB {
    const numero = getInt(data, "coniugazione.numero");
    if(numero < 0 || numero > 3) throw new InvalidField("coniugazione.numero", "valore tra: 0, 1, 2, 3", numero.toString());
    const tipo = getInt(data, "coniugazione.tipo");
    if(!TipoVerbo[tipo]) throw new InvalidField("coniugazione.tipo", "valore tra: 1, 2, 3, 4, 5", tipo.toString());
    const gerundio = getStringOrNull(data, "coniugazione.gerundio");
    const voci: TempiRaw = [
        getTempo(data, 0, 6),
        getTempo(data, 1, 6),
        getTempo(data, 2, 6),
        getTempo(data, 3, 6),
        getTempo(data, 4, 6),
        getTempo(data, 5, 6),
        getTempo(data, 6, 5),
    ];

    return { 
        //@ts-ignore
        numero, 
        tipo, 
        gerundio,
        participio: null,
        tempi: voci.every(v => v === null) ? null : voci,
    }
}

async function addConiugazione(data: ConiugazioneDB, supabase: SupabaseClient) {
    const res = await supabase.from("coniugazioni").insert(data).select("id");
    if(res.error) {
        if(data.participio) supabase.from("declinazioni").delete().eq("id", data.participio);
        throw postgresError2HTTPError(res.error);
    }
    return res.data[0].id;
}

interface ParolaDB {
    parola: string;
    traduzione: string;
    ordine: number;
    funzione: number;
    descrizione: string|null;
    esempi: Esempio[]|null;
    radice: string|null;
    declinazione: number|null;
    coniugazione: number|null;
}

export interface AllDataDB {
    parola: ParolaDB;
    declinazione: Declinazione|null;
    coniugazione: ConiugazioneDB|null;
    participio: Declinazione|null;
}


export function getDataFromForm(data: FormData, funzioni: number[]) {
    const parola = getMandatoryString(data,"parola");
    const traduzione = getMandatoryString(data,"traduzione");
    const funzione = getInt(data,"funzione");
    if(funzioni.findIndex(v => v === funzione) === -1) throw new InvalidField("funzione", 
        "valore tra: " + funzioni.join(", "), funzione.toString());
    const ordine = getInt(data,"ordine");
    if(ordine < 0) throw new InvalidField("ordine", "numero intero positivo o nullo", "numero intero negativo");
    const descrizione = getStringOrNull(data,"descrizione");
    const radice = funzione > 4 ? null : getMandatoryString(data,"radice");
    const esempi = getEsempi(data);

    const res: AllDataDB = {
        parola: {
            parola, traduzione, ordine, funzione, descrizione, esempi, radice,
            declinazione: null, coniugazione: null
        },
        declinazione: null,
        coniugazione: null,
        participio: null,
    }

    if(funzione < 4) {
        res.declinazione = getDeclinazione(data, "declinazione");
        if(res.declinazione === null) throw new InvalidField("declinazione", "declinazione con almeno una flessione", "nulla");
        if((res.declinazione.ms || res.declinazione.fs || res.declinazione.mp || res.declinazione.fp) === null)
            throw new InvalidField("declinazione", "declinazione con almeno una flessione", "declinazione vuota");
    }
    else if(funzione === 4) {
        res.coniugazione = getConiugazione(data);
        const avere = res.coniugazione.tipo === TipoVerbo.intransitivo_avere || res.coniugazione.tipo === TipoVerbo.impersonale;
        if(avere) {
            const pp = getStringOrNull(data, "coniugazione.participio");
            if(pp) res.participio = {ms: pp, mp: null, fs: null, fp: null};
        }
        else {
            res.participio = getDeclinazione(data, "coniugazione.participio");
            if(res.participio && (!res.participio.ms || !res.participio.mp || !res.participio.fs || !res.participio.fp)) 
                throw new InvalidField("participio passato", "declinazione completa", "una o più flessioni mancanti");
        }
    }
    return res;
}

export async function createWord(data: AllDataDB, supabase: SupabaseClient) {
    if(data.declinazione) data.parola.declinazione = await addDeclinazione(data.declinazione, supabase);
    else if(data.coniugazione) {
        if(data.participio) data.coniugazione.participio = await addDeclinazione(data.participio, supabase);
        data.parola.coniugazione = await addConiugazione(data.coniugazione, supabase);
    }
    const res = await supabase.from("parole").insert(data.parola).select("id");
    if(res.error) {
        if(data.declinazione) await supabase.from("declinazioni").delete().eq("id", data.parola.declinazione);
        else if(data.coniugazione) await supabase.from("coniugazioni").delete().eq("id", data.parola.coniugazione); 
        throw postgresError2HTTPError(res.error);
    }
    return res.data[0].id as number;
}

export async function updateWord(id: number, data: AllDataDB, supabase: SupabaseClient) {
    const before_res = await supabase.from("parole").select("funzione, declinazione, coniugazione(id, participio)").eq("id", id);
    if(before_res.error) throw postgresError2HTTPError(before_res.error);
    //@ts-ignore
    const before = before_res.data[0] as {funzione: number, declinazione: number|null, coniugazione: null|{id: number, participio: number}};
    if(!before) throw error(404, {
        message: "Parola inesistente",
        details: "Non esiste alcuna parole con ID = "+id
    });

    if(data.declinazione) {
        if(before.declinazione) {
            data.parola.declinazione = before.declinazione;
            const res = await supabase.from("declinazioni").update(data.declinazione).eq("id", before.declinazione);
            if(res.error) throw postgresError2HTTPError(res.error);
        }
        else {
            if(before.coniugazione) supabase.from("coniugazioni").delete().eq("id", before.coniugazione.id);
            data.parola.declinazione = await addDeclinazione(data.declinazione, supabase);
        }
    }
    else if(data.coniugazione) {
        if(data.participio) {
            if(before.coniugazione?.participio) {
                data.coniugazione.participio = before.coniugazione.participio;
                const res = await supabase.from("declinazioni").update(data.participio).eq("id", before.coniugazione.participio);
                if(res.error) throw postgresError2HTTPError(res.error);
            }
            else data.coniugazione.participio = await addDeclinazione(data.participio, supabase);
        }
        else if(before.coniugazione?.participio) supabase.from("declinazioni").delete().eq("id", before.coniugazione.participio);
        if(before.coniugazione) {
            data.parola.coniugazione = before.coniugazione.id;
            const res = await supabase.from("coniugazioni").update(data.coniugazione).eq("id", before.coniugazione.id);
            if(res.error) throw postgresError2HTTPError(res.error);
        }
        else {
            if(before.declinazione) supabase.from("declinazioni").delete().eq("id", before.declinazione);
            data.parola.coniugazione = await addConiugazione(data.coniugazione, supabase);
        }
    }
    else {
        if(before.declinazione) supabase.from("declinazioni").delete().eq("id", before.declinazione);
        if(before.coniugazione) {
            if(before.coniugazione.participio) supabase.from("declinazioni").delete().eq("id", before.coniugazione.participio);
            supabase.from("coniugazioni").delete().eq("id", before.coniugazione.id);
        }
    }
    const res = await supabase.from("parole").update(data.parola).eq("id", id);
    if(res.error) throw postgresError2HTTPError(res.error);
}