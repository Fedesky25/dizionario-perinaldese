import type { PageServerLoad } from "./$types";
import { postgresError2HTTPError, supabase } from "$lib/db";
import { error } from "@sveltejs/kit";
import { getID } from "./id";
import type { Complete, CompleteAdmin } from "$lib/words/types";
import { emptyWord } from "$lib/words/utils";

let fgs: {id: number, nome: string}[] = [];
let last_date = Date.now();

async function getfunzioni() {
    const now = Date.now();
    if(!fgs.length || now > last_date + 86400000) {
        const res = await supabase.from("funzioni").select("id, nome:lungo");
        if(res.error) throw postgresError2HTTPError(res.error);
        fgs = res.data;
        last_date = now;
    }
    return fgs;
}

async function getdoc(id: number) {
    const res = await supabase.rpc("parola_admin", {id_parola: id});
    if(res.error) throw postgresError2HTTPError(res.error);
    if(!Array.isArray(res.data) || res.data.length === 0) throw error(404, `Non esiste nessuna parola con ID = ${id}`);
    return res.data[0] as CompleteAdmin;
}

interface EditorData {
    id: number|null;
    parola: Complete;
    funzioni: {id: number, nome: string}[];
}

export const load: PageServerLoad<EditorData> = async ({ params }) => {
    if(params.id === "crea") return ({
        id: null,
        parola: emptyWord(),
        funzioni: await getfunzioni()
    });
    const id = getID(params);
    const res = await Promise.all([getdoc(id), getfunzioni()]);
    return ({ id, parola: res[0], funzioni: res[1] });
};