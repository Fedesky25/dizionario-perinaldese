import { redirect, type Handle } from "@sveltejs/kit";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from "$env/static/public";
import type { Database } from "$lib/supabase";

export const handle: Handle = async ({ event, resolve }) => {
    const supabase = createSupabaseServerClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_KEY,
        event, 
    });
    event.locals.supabase = supabase;
    event.locals.session = null;

    if(event.url.pathname.startsWith("/admin")) {
        const res = await supabase.auth.getSession();
        event.locals.session = res.data.session;
        if(!event.locals.session) {
            throw redirect(303, "/login?redirect="+encodeURI(event.url.pathname));
        }
    }
    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === "content-range";
        },
    });
}