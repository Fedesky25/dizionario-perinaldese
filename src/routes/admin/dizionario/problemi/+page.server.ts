import { postgresError2HTTPError } from "$lib/db";
import { getIntList } from "$lib/form-utils";
import type { Actions } from "./$types";

export const actions: Actions = {
    singolo: async ({ request, locals }) => {
        const client = locals.supabase;
        const data = await request.formData()
        const ids = getIntList(data, "id");
        const res = await client.from("parole").update({ordine: 0}).in("id", ids);
        if(res.error) throw postgresError2HTTPError(res.error);
        return { success: true }
    }
};