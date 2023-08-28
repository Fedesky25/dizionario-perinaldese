import type { RequestHandler } from "./$types";
import { json, error } from "@sveltejs/kit";
import { words } from "$lib/db";
import { getSearchFilterOld, getSearchFilter } from "$lib/words/utils";
import type { Complete } from "$lib/words/types";


const PROJECTION = {
    _id: 0,
    __v: 0,
    "esempi._id": 0,
    "sinonimi._id": 0,
    "contrari._id": 0,
    "declinazione._id": 0,
    "coniugazione._id": 0,
}
const FG_LONG = [
    "null", "nome comune", "aggettivo", "preposizione articolata", "verbo", "preposizione semplice",
    "articolo", "avverbio", "pronome", "esclamazione", "particella morfologica", "coniugazione",
];
const NoKeyError = {
    message: "Richiesta invalida",
    details: "Il parametro di query 'filtro' deve essere una stringa non vuota"
};

function format(res: Complete[]) {
    const len = res.length;
    if(len === 0) return ({voce: null, significati: []});
    else {
        //@ts-ignore
        for(var i=0; i<len; i++) res.funzione = FG_LONG[res.funzione];
        return ({voce: res[0].parola, significati: res});
    }
}

export const GET: RequestHandler = async ({ url, locals }) => {
    const parola = url.searchParams.get("filtro");
    const mode = url.searchParams.get("operazione") || "cerca";
    switch(mode) {
        case "cerca": {
            if(!parola) throw error(400, NoKeyError);
            const filter = getSearchFilter(parola);
            const res = await locals.supabase.rpc("ricerca_completa", filter);
            if(res.error) throw error(500, {
                message: res.error.message,
                details: res.error.details
            });
            return json(res.data);
        }
        case "ottieni": {
            if(!parola) throw error(400, NoKeyError);
            const id = +parola;
            const res = await (
                Number.isInteger(id) && id > 0
                ? locals.supabase.rpc("parola_singola", {id_parola: id})
                : locals.supabase.rpc("parola_multipla", {parola_esatta: parola})
            );
            if(res.error) throw error(500, {
                message: res.error.message,
                details: res.error.details
            });
            if(res.count === 0) throw error(404, {
                message: "Parola inesistente",
                details: "Non esiste alcuna parola " + (
                    Number.isInteger(id) && id > 0
                    ? "avente id "+id
                    : "'"+parola+"'"
                )
            });
            return json(res.data);
        }
        case "casuale": {
            const stages: object[] = [{$sample: {size: 1}},{$projecion: PROJECTION}];
            if(parola) stages.splice(0, 0, getSearchFilterOld(parola));
            let res = await words.aggregate(stages).toArray();
            if(res[0].ordine > 0) res = await words.find({parola: res[0].parola}, {
                projection: PROJECTION,
                sort: {ordine: 1}
            }).toArray();
            //@ts-ignore
            return json(format(res));
        }
        default:
            throw error(400, {
                message: "Richiesta invalida",
                details: "Operazione non riconosciuta"
            });
    }
};