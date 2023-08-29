import type { PageLoad } from "./$types";
import type { CompleteDisplay } from "$lib/words/types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ url, parent }) => {
    const { supabase } = await parent();
    const casuale = url.searchParams.get("casuale");
    if(casuale !== null) {
        const res = await supabase.rpc("casuale");
        if(res.error) {
            console.log(res.error);
            return { code: 500, words: null, error: "Errore interno del server: per favore riprovare più tardi" };
        }
        const row = res.data[0];
        if(!row) throw redirect(303, "/?casuale"); // retry
        throw redirect(303, "/?parola="+(row.id||row.parola));
    }
    const parola = url.searchParams.get("parola");
    if(!parola) return { code: 200, error: null, words: null };
    const id = +parola;
    const res = await (
        Number.isInteger(id) && id > 0
        ? supabase.rpc("parola_singola", {id_parola: id})
        : supabase.rpc("parola_multipla", {parola_esatta: parola})
    );
    if(res.error) {
        console.error(res.error);
        return { code: 500, words: null, error: "Errore interno del server: per favore riprovare più tardi" };
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
    const words = res.data as CompleteDisplay[];
    return { code: 200, words, error: null };
};