import { postgresError2HTTPError } from "$lib/db";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({parent}) => {
    const { supabase } = await parent();
    const res = await supabase.from("proverbi").select("id, originale, letterale").order("creazione", {ascending: false}).range(0, 49);
    if(res.error) throw postgresError2HTTPError(res.error);
    return { proverbi: res.data }
};