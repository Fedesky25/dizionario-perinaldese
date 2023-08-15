import type { PageServerLoad } from "./$types";
import { supabase } from "$lib/db";
import type { Summary } from "$lib/words/types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
    const res = await supabase.rpc("riassunto");
    if(res.error) throw error(500, {
        message: res.error.message,
        details: res.error.details
    });
    const words: Summary[] = res.data;
    return { words }
}