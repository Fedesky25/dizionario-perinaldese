import type { RequestHandler } from "./$types";
import { supabase } from "$lib/db";
import { error, json } from "@sveltejs/kit";
import { getSearchFilter } from "$lib/words/utils";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export const GET: RequestHandler = async ({ url }) => {
    const option = url.searchParams.get("opzione");
    const parameter = url.searchParams.get("parametro");
    let res: PostgrestSingleResponse<any>;
    switch(option) {
        case "riassunto": {
            const salta = +(parameter || 0);
            if(!Number.isInteger(salta) || salta < 0) throw error(400, {
                message: "Richiesta invalida",
                details: "Il parametro deve esse un numero intero positivo"
            });
            res = await supabase.rpc("riassunto", {salta});
            break;
        }
        case "cerca": {
            const filter = getSearchFilter(parameter||'');
            res = await supabase.rpc("ricerca_singola", filter);
            break;
        }
        default:
            throw error(400, {
                message: "Richiesta invalida",
                details: "Opzione non valida"
            });
    }
    if(res.error) throw error(500, {
        message: res.error.message,
        details: res.error.details
    });
    return json(res.data);
}
