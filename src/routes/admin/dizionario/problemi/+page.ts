import type { PageLoad } from "./$types";
import { postgresError2HTTPError } from "$lib/db";

namespace Issue {
    export interface Multiple {
        parola: string;
        significati: {
            id: number, 
            traduzione: string
        }[];
    }
    export interface Single {
        parola: string;
        traduzione: string;
        id: number;
    }
}

function zip(ids: number[], traduzioni: string[]) {
    const len = ids.length;
    const res = new Array<{id: number, traduzione: string}>(len);
    for(var i=0; i<len; i++) res[i] = ({ id: ids[i], traduzione: traduzioni[i] });
    return res;
}

export const load: PageLoad = async ({ parent }) => {
    const { supabase } = await parent();
    const res = await supabase.rpc("problemi");
    if(res.error) throw postgresError2HTTPError(res.error);
    const multiple: Issue.Multiple[] = [];
    const single: Issue.Single[] = [];
    const len = res.data.length;
    for(var i=0; i<len; i++) {
        if(res.data[i].tipo === 1) single.push({
            parola: res.data[i].parola,
            traduzione: res.data[i].traduzioni[0],
            id: res.data[i].ids[0]
        });
        else multiple.push({
            parola: res.data[i].parola,
            significati: zip(res.data[i].ids, res.data[i].traduzioni)
        });
    }
    return { multiple, single }
};