import type { Actions, PageServerLoad } from "./$types";
import { postgresError2HTTPError } from "$lib/db";
import type { Summary } from "$lib/words/types";
import { error } from "@sveltejs/kit";
import { getInt, getMandatoryString } from "$lib/form-utils";


export const load: PageServerLoad = async ({ locals }) => {
    const res = await locals.supabase.rpc("riassunto");
    if(res.error) throw error(500, {
        message: res.error.message,
        details: res.error.details
    });
    const words: Summary[] = res.data;
    return { words }
}

export const actions: Actions = {
    descrizione: async ({ request, locals }) => {
        const data = await request.formData();
        const descrizione = getMandatoryString(data, "descrizione");
        const id = getInt(data, "id");
        const res = await locals.supabase.from("parole").update({descrizione}).eq("id",id);
        if(res.error) throw postgresError2HTTPError(res.error);
        return { success: true }
    },
    rimuovi: async ({ request, locals }) => {
        const data = await request.formData();
        const id = getInt(data, "id");
        const res = await locals.supabase.from("parole").delete().eq("id",id);
        if(res.error) throw postgresError2HTTPError(res.error);
        return { success: true }
    }
};