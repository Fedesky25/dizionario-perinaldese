import { postgresError2HTTPError } from "$lib/db";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Proverbio } from "../logic/";

export const load: PageLoad = async ({ params, parent }) => {
    const id = +params.id;
    const { supabase } = await parent();
    const res = await supabase.rpc("ottieni_proverbio", {id_proverbio: id});
    // const res = await supabase.from("proverbi").select("*, tags(id, nome), parole(id, parola)").eq("id", id);
    if(res.error) throw postgresError2HTTPError(res.error);
    const proverbio = res.data as unknown as Proverbio;
    if(!proverbio.id) throw error(404, {
        message: "Proverbio inesistente",
        details: "Nessun proverbio con id "+id
    }) 
    return { id, proverbio }
};