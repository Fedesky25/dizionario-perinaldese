import type { PageServerLoad } from "./$types";
import { supabase } from "$lib/db";
import type { Complete } from "$lib/words/types";

export const load: PageServerLoad = async ({ url }) => {
    const parola = url.searchParams.get("parola");
    if(!parola) return { 
        code: 200,
        error: null,
        words: null
    };
    const id = +parola;
    const res = await (
        Number.isInteger(id) && id > 0
        ? supabase.rpc("parola_singola", {id_parola: id})
        : supabase.rpc("parola_multipla", {parola_esatta: parola})
    );
    console.log(res);
    if(res.error) {
        console.error(res.error);
        return {
            code: 500,
            error: "Errore interno del server: per favore riprovare più tardi",
            words: null
        }
    }
    if(res.data.length === 0) return {
        code: 404,
        words: null,
        error: "Non esiste alcuna parola " + (
            Number.isInteger(id) && id > 0
            ? "avente id "+id
            : "'"+parola+"'"
        )
    }
    const words: Complete[] = res.data;
    return { code: 200, words, error: null };
};