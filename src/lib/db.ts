import type { PostgrestError } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

export const postgresError2HTTPError = (err: PostgrestError) => (
    console.log(err),
    error(500, {
        message: err.message,
        details: err.details
    })
);

export const jsonReq: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "aaplication/json" }
}