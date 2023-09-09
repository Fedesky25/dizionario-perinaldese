import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/supabase";
import Result  from "./Result.svelte";
import { getSearchFilter } from "../utils";

export interface SearchResult<S extends boolean> {
    traduzione: string;
    funzione: string;
    parola: string;
    id: number | (S extends true ? never : null);
}

function getSearchAction<S extends boolean>(client: SupabaseClient<Database>, singola: S) {
    const procedure = (singola ? "ricerca_singola" as const : "ricerca_completa" as const);
    return async function (text: string): Promise<SearchResult<S>[]>  {
        const res = await client.rpc(procedure, getSearchFilter(text));
        if(res.error) throw res.error;
        return res.data;
    }
}

export { Result, getSearchAction }