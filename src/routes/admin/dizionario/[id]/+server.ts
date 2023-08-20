import type { RequestHandler } from "./$types";
import { postgresError2HTTPError, supabase } from "$lib/db";
import { error, json } from "@sveltejs/kit";
import { getID } from "./id";
import type { WordUpdate } from "$lib/words/types";

async function updateNested(relation: string, id: number|null, data: object|null) {
    if(data === null) {
        if(id === null) return undefined;
        const res = await supabase.from(relation).delete().eq("id",id);
        if(res.error) throw postgresError2HTTPError(res.error);
        return null;
    }
    else if(id === null) {
        const res = await supabase.from(relation).insert(data).select("id");
        if(res.error) throw postgresError2HTTPError(res.error);
        return res.data[0].id;
    }
    else {
        const res = await supabase.from(relation).update(data).eq("id",id);
        if(res.error) throw postgresError2HTTPError(res.error);
        return id;
    }
}

export const PUT: RequestHandler = async ({ params, request }) => {
    const id = getID(params);
    const doc: WordUpdate = await request.json();
    if("id" in doc) delete doc.id;
    const sin_con = doc.sin_con;
    delete doc.sin_con;

    if("declinazione" in doc || "coniugazione" in doc) {
        const res = await supabase.from("parole").select("declinazione, coniugazione(id, participio)").eq("id",id);
        if(res.error) throw postgresError2HTTPError(res.error);
        if(res.data.length === 0) throw error(404, "Parola inesistente");
        if(doc.declinazione !== undefined) doc.declinazione = await updateNested("declinazioni", res.data[0].declinazione, doc.declinazione);
        if(doc.coniugazione !== undefined) {
            const coniu = doc.coniugazione;
            if(coniu !== null && coniu.participio !== undefined) coniu.participio = await updateNested(
                "declinazioni",
                //@ts-ignore
                res.data[0].coniugazione === null ? null : res.data[0].coniugazione.participio,
                coniu.participio
            );
            //@ts-ignore
            doc.coniugazione = await updateNested("coniugazioni", res.data[0].coniugazione.id, coniu);
        }
    }
    const res = await supabase.from("parole").update(doc).eq("id",id).select("id");
    if(res.error) throw postgresError2HTTPError(res.error);
    if(res.data.length === 0) throw error(404, "Parola inesistente");

    if(typeof sin_con === "object") {

    }

    return json(true, {status: 200});
};

export const DELETE: RequestHandler = async ({ params }) => {
    const id = getID(params);
    const res = await supabase.from("parole").delete().eq("id", id);
    if(res.error) throw error(500, {
        message: res.error.message,
        details: res.error.details
    });
    return json({ deleted: !!res.count }, {status: 200});
};