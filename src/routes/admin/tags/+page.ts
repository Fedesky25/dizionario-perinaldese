import { postgresError2HTTPError } from "$lib/db";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { supabase } = await parent();
    const res = await supabase.from("tags").select("id, nome, parole(id, parola), proverbi(id, originale)");
    if(res.error) throw postgresError2HTTPError(res.error)
    return { tags: res.data };
};