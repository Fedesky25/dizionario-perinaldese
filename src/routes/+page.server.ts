import type { PageServerLoad } from "./$types";
import type { CompleteDisplay } from "$lib/words/types";

export const load: PageServerLoad = async ({ url, locals }) => {
    const parola = url.searchParams.get("parola");
    if(!parola) return { 
        code: 200,
        error: null,
        words: null
    };
    const id = +parola;
    const res = await (
        Number.isInteger(id) && id > 0
        ? locals.supabase.rpc("parola_singola", {id_parola: id})
        : locals.supabase.rpc("parola_multipla", {parola_esatta: parola})
    );
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
    const words: CompleteDisplay[] = res.data;
    return { code: 200, words, error: null };
};