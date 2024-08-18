import { postgresError2HTTPError } from "$lib/db";
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

export const load: PageLoad = async ({ parent }) => {
    const { supabase } = await parent();
    const funzioni = await getfunzioni(supabase);
    return ({ funzioni });
};