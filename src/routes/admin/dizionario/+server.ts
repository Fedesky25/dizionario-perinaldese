import type { RequestHandler } from "./$types";
import { supabase, postgresError2HTTPError } from "$lib/db";
import { error, json } from "@sveltejs/kit";
import { getSearchFilter } from "$lib/words/utils";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type { Complete, Declinazione } from "$lib/words/types";

async function addDeclinazione(d: Declinazione) {
    let res = await supabase.from("declinazioni").insert(d).select("id");
    if(res.error) throw postgresError2HTTPError(res.error);
    return res.data[0].id;
}

export const POST: RequestHandler =async ({ request }) => {
    const doc: Omit<Complete, "id"> = await request.json();
    if("id" in doc) delete doc.id;
    let id: number;
    // const sin_con = doc;
    // //@ts-ignore
    // delete doc.sin_con;
    if(doc.funzione < 4) {
        if("coniugazione" in doc) doc.coniugazione = null;
        const declinazione = doc.declinazione;
        if(!declinazione) throw error(400, "Declinazione mancante");
        const decl_id = await addDeclinazione(declinazione);
        doc.declinazione = decl_id;
        const res = await supabase.from("parole").insert(doc).select("id");
        if(res.error) {
            // rollback
            await supabase.from("declinazioni").delete().eq("id",decl_id);
            throw postgresError2HTTPError(res.error);
        }
        id = res.data[0].id;
    }
    else if(doc.funzione === 4) {
        if("declinazione" in doc) doc.declinazione = null;
        const coniugazione = doc.coniugazione;
        if(!coniugazione) throw error(400, "Coniugazione mancante");
        let part_id = null
        const participio = coniugazione.participio;
        if(participio) part_id = await addDeclinazione(participio);
        coniugazione.participio = part_id;
        let res = await supabase.from("coniugazioni").insert(coniugazione).select("id");
        if(res.error) {
            if(part_id) await supabase.from("declinazioni").delete().eq("id",part_id);
            throw postgresError2HTTPError(res.error);
        }
        const coniu_id = res.data[0].id;
        doc.coniugazione = coniu_id;
        res = await supabase.from("parole").insert(doc).select("id");
        if(res.error) {
            // rollback
            await supabase.from("coniugazioni").delete().eq("id",coniu_id);
            throw postgresError2HTTPError(res.error);
        }
        id = res.data[0].id;
    }
    else {
        if("coniugazione" in doc) doc.coniugazione = null;
        if("declinazione" in doc) doc.declinazione = null;
        const res = await supabase.from("parole").insert(doc).select("id");
        if(res.error) throw postgresError2HTTPError(res.error);
        id = res.data[0].id;
    }
    // if(sin_con) {
    //     if(!Array.isArray(sin_con) || !sin_con.every(v => typeof v === "object")) throw error(400, "Sinonimi e contrari invalidi");
    //     const res = await supabase.from("sin_con").insert(sin_con.map(v => ({
    //         contrario: v.contrario,
    //         parola1: id,
    //         parola2: v.id
    //     })));
    //     if(res.error) throw postgresError2HTTPError(res.error);
    // }
    return json({id}, {status: 200});
}

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
    if(res.error) throw postgresError2HTTPError(res.error);
    return json(res.data);
}
