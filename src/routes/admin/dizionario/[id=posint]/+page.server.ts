import type { Actions } from "./$types";
import { postgresError2HTTPError } from "$lib/db";
import { error, redirect } from "@sveltejs/kit";
import { InvalidField } from "$lib/form-utils";

import { getDataFromForm, createWord, updateWord, getCollegamenti, getID, type AllDataDB, updateCollegamenti } from "./logic";

export const actions: Actions = {
    default: async ({ params, request, locals }) => {
        const client = locals.supabase;
        const funzioni = await client.from("funzioni").select("id");
        if(funzioni.error) throw postgresError2HTTPError(funzioni.error);
        const form = await request.formData();
        let data: AllDataDB;
        try { data = getDataFromForm(form, funzioni.data.map(v => v.id)); }
        catch(err) {
            if(err instanceof InvalidField) return err.toFailure();
            else throw error(500, {
                message: "Errore ignoto",
                details: ""+err
            });
        }
        let id: number;
        if(params.id === "crea") id = await createWord(data, client);
        else {
            id = getID(params);
            await updateWord(id, data, client);
        }
        await updateCollegamenti(id, form, client);
        if(params.id === "crea") return { success: true as const };
        else throw redirect(303, "/admin/dizionario");
    }
};