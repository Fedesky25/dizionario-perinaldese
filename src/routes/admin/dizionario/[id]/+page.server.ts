import type { Actions, PageServerLoad } from "./$types";
import { postgresError2HTTPError, supabase } from "$lib/db";
import { error, redirect } from "@sveltejs/kit";
import { getID } from "./id";
import type { Complete, CompleteAdmin, ConiugazioneRaw, Declinazione, Esempio, TempiRaw, Voci, VociImperative } from "$lib/words/types";
import { TipoVerbo } from "$lib/words/types"
import { emptyWord } from "$lib/words/utils";
import { datoInvalido, getInt, getIntList, getMandatoryString, getStringOrNull } from "$lib/form-utils";

let fgs: {id: number, nome: string}[] = [];
let last_date = Date.now();

async function getfunzioni() {
    const now = Date.now();
    if(!fgs.length || now > last_date + 86400000) {
        const res = await supabase.from("funzioni").select("id, nome:lungo");
        if(res.error) throw postgresError2HTTPError(res.error);
        fgs = res.data;
        last_date = now;
    }
    return fgs;
}

async function getdoc(id: number) {
    const res = await supabase.rpc("parola_admin", {id_parola: id});
    if(res.error) throw postgresError2HTTPError(res.error);
    if(!Array.isArray(res.data) || res.data.length === 0) throw error(404, `Non esiste nessuna parola con ID = ${id}`);
    return res.data[0] as CompleteAdmin;
}

interface EditorData {
    id: number|null;
    parola: Complete;
    funzioni: {id: number, nome: string}[];
}

export const load: PageServerLoad<EditorData> = async ({ params }) => {
    if(params.id === "crea") return ({
        id: null,
        parola: emptyWord(),
        funzioni: await getfunzioni()
    });
    const id = getID(params);
    const res = await Promise.all([getdoc(id), getfunzioni()]);
    return ({ id, parola: res[0], funzioni: res[1] });
};

function isNonEmptyString<T = any>(v: T): T extends string ? boolean : false {
    //@ts-ignore
    return (typeof v === "string") && v.length > 0;
}

function getEsempi(data: FormData) {
    const originali = data.getAll("esempi.originale");
    const traduzioni = data.getAll("esempi.traduzione");

    const res: Esempio[] = [];
    const len = originali.length;
    if(len !== traduzioni.length) datoInvalido(`Numeri di traduzioni e originali degli esempi non combaciano`);
    for(var i=0; i<len; i++) {
        if(!isNonEmptyString(originali[i])) datoInvalido(`L'originale del ${i+1}-esimo esempio non è una stringa`);
        if(!isNonEmptyString(traduzioni[i])) datoInvalido(`La traduzione del ${i+1}-esimo esempio non è una stringa`);
        //@ts-ignore
        res.push({ originale: originali[i], traduzione: traduzioni[i] });
    }

    return res;
}

function getCollegamenti(data: FormData) {
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

async function addDeclinazione(v: Declinazione) {
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
    throw datoInvalido("Ogni tempo verbale deve essere un array di stringhe");
}

function getConiugazione(data: FormData): ConiugazioneDB {
    const numero = getInt(data, "coniugazione.numero");
    if(numero < 0 || numero > 3) datoInvalido("Numero di coniugazione fuori dal range accettabile");
    const tipo = getInt(data, "coniugaizone.tipo");
    if(!TipoVerbo[tipo]) datoInvalido("Tipo di verbo non valido");
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
        voci: voci.every(v => v === null) ? null : voci,
    }
}

async function addConiugazione(data: ConiugazioneDB) {
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

async function createWord(word: ParolaDB, form: FormData) {
    if(word.funzione < 4) {
        const declinazione = getDeclinazione(form, "declinazione");
        if(declinazione === null) datoInvalido("La declinazione deve essere presente");
        word.declinazione = await addDeclinazione(declinazione);
        const res = await supabase.from("parole").insert(word).select("id");
        if(res.error) {
            await supabase.from("declinazioni").delete().eq("id", word.declinazione);
            throw postgresError2HTTPError(res.error);
        }
        return res.data[0].id;
    }
    else if(word.funzione === 4) {
        const coniu = getConiugazione(form);
        const participio = getDeclinazione(form, "coniugazione.participio");
        if(participio) coniu.participio = await addDeclinazione(participio);
        word.coniugazione = await addConiugazione(coniu);
        const res = await supabase.from("parole").insert(word).select("id");
        if(res.error) {
            await supabase.from("coniugazioni").delete().eq("id", word.coniugazione); // participio should be automatically be destroyed on cascade
            throw postgresError2HTTPError(res.error);
        }
        return res.data[0].id;
    }
    else {
        const res = await supabase.from("parole").insert(word).select("id");
        if(res.error) throw postgresError2HTTPError(res.error);
        return res.data[0].id;
    }
}

async function updateWord(id: number, word: ParolaDB, form: FormData) {
    const before_res = await supabase.from("parole").select("funzione, declinazione, coniugazione(id, participio)").eq("id", id);
    if(before_res.error) throw postgresError2HTTPError(before_res.error);
    //@ts-ignore
    const before = before_res.data[0] as {funzione: number, declinazione: number|null, coniugazione: null|{id: number, participio: number}};
    if(!before) throw error(404, {
        message: "Parola inesistente",
        details: "Non esiste alcuna parole con ID = "+id
    });
    word.declinazione = before.declinazione;
    if(before.coniugazione) word.coniugazione = before.coniugazione.id;
    if(word.funzione < 4) {
        const declinazione = getDeclinazione(form, "declinazione");
        if(declinazione === null) datoInvalido("La declinazione deve essere presente");
        if(before.funzione < 4) {
            const res = await supabase.from("declinazioni").update(declinazione).eq("id", before.declinazione);
            if(res.error) throw postgresError2HTTPError(res.error);
        }
        else {
            if(before.coniugazione) supabase.from("coniugazioni").delete().eq("id", before.coniugazione.id);
            word.declinazione = await addDeclinazione(declinazione);
            word.coniugazione = null;
        }
    }
    else if(word.funzione === 4) {
        const participio = getDeclinazione(form, "coniugazione.participio");
        const coniu = getConiugazione(form);
        if(before.coniugazione) {
            const res1 = await supabase.from("declinazioni").update(participio).eq("id", before.coniugazione.participio);
            if(res1.error) throw postgresError2HTTPError(res1.error);
            coniu.participio = before.coniugazione.participio;
            const res2 = await supabase.from("coniugazioni").update(coniu).eq("id", before.coniugazione.id);
            if(res2.error) throw postgresError2HTTPError(res2.error);
        }
        else {
            if(before.declinazione) supabase.from("declinazioni").delete().eq("id", before.declinazione);
            word.declinazione = null;
            if(participio) coniu.participio = await addDeclinazione(participio);
            word.coniugazione = await addConiugazione(coniu);
        }
    }
    else {
        if(before.declinazione) supabase.from("declinazioni").delete().eq("id", before.declinazione);
        if(before.coniugazione) supabase.from("coniugazioni").delete().eq("id", before.coniugazione.id);
        word.declinazione = null;
        word.coniugazione = null;
    }
    const res = await supabase.from("parole").update(word).eq("id", id);
    if(res.error) throw postgresError2HTTPError(res.error);
}

export const actions: Actions = {
    default: async ({ params, request }) => {
        const data = await request.formData()
        const parola = getMandatoryString(data,"parola");
        const traduzione = getMandatoryString(data,"traduzione");
        const funzione = getInt(data,"funzione");
        if(fgs.findIndex(v => v.id === funzione) === -1) datoInvalido('Valore di "funzione" fuori dal range accettato');
        const ordine = getInt(data,"ordine");
        if(ordine < 0) datoInvalido('"ordine" deve essere positivo');
        const descrizione = getStringOrNull(data,"descrizione");
        const radice = funzione > 4 ? null : getMandatoryString(data,"radice");
        const esempi = getEsempi(data);

        const word: ParolaDB = {
            parola, traduzione, ordine, funzione, descrizione, esempi, radice,
            declinazione: null, coniugazione: null
        };

        let id: number;
        if(params.id === "crea") id = await createWord(word, data);
        else {
            id = getID(params);
            await updateWord(id, word, data);
        }

        const collegamenti = getCollegamenti(data);
        collegamenti.riferimento = id;
        const res = await supabase.rpc("aggiorna_collegamenti", collegamenti);
        if(res.error) throw postgresError2HTTPError(res.error);

        if(params.id === "crea") return { success: true };
        else throw redirect(303, "/admin/dizionario");
    }
};