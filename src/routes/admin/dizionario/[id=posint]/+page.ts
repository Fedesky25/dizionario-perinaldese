import { postgresError2HTTPError } from "$lib/db";
import type { Complete, CompleteAdmin } from "$lib/words/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { SupabaseClient } from "@supabase/supabase-js";

let fgs: {id: number, nome: string}[] = [];
let last_date = Date.now();


async function getfunzioni(client: SupabaseClient) {
    const now = Date.now();
    if(!fgs.length || now > last_date + 86400000) {
        const res = await client.from("funzioni").select("id, nome:lungo");
        if(res.error) throw postgresError2HTTPError(res.error);
        fgs = res.data;
        last_date = now;
    }
    return fgs;
}

async function getdoc(id: number, client: SupabaseClient) {
    const res = await client.rpc("parola_admin", {id_parola: id});
    if(res.error) throw postgresError2HTTPError(res.error);
    if(!Array.isArray(res.data) || res.data.length === 0) throw error(404, `Non esiste nessuna parola con ID = ${id}`);
    return res.data[0] as CompleteAdmin;
}

interface EditorData {
    id: number|null;
    parola: Complete;
    funzioni: {id: number, nome: string}[];
}

export const load: PageLoad<EditorData> = async ({ params, parent }) => {
    const { supabase } = await parent();
    const id = +params.id;
    const res = await Promise.all([getdoc(id, supabase), getfunzioni(supabase)]);
    return ({ id, parola: res[0], funzioni: res[1] });
};