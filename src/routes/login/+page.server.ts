import type { Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { signin } from "./signin";

export const actions: Actions = {
    default: async ({ request, url, locals }) => {
        const data = await request.formData();
        const res = await signin(data, locals.supabase);
        if(res.success) {
            const goto = url.searchParams.get("redirect");
            throw redirect(303, goto && goto.startsWith("/") ? decodeURI(goto) : "/admin")
        }
        else return fail(400, res.form);
    }
}