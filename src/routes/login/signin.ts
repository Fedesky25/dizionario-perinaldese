import { InvalidField, getMandatoryString } from "$lib/form-utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

export async function signin(data: FormData, supabase: SupabaseClient) {
    let email = '';
    try {
        email = getMandatoryString(data, "email");
        const password = getMandatoryString(data, "password");
        const res = await supabase.auth.signInWithPassword({ email, password });
        if(res.error) return ({ 
            success: false as const, 
            form: { email, error: "Credenziali invalide" }
        });
        else return {success: true as const, form: null };
    }
    catch(err) {
        return {
            success: false as const,
            form: {
                email,
                error: (
                    err instanceof InvalidField
                    ? `${err.field} deve essere ${err.expected}`
                    : `Errore ignoto: ${err}`
                )
            }
        };
    }
}