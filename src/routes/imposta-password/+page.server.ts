import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = await request.formData();
        const password = data.get("form");
        if(typeof password !== "string" || password.length < 8) return fail(400, { password, msg: "Password troppo corta" });
        const res = await locals.supabase.auth.updateUser({ password });
        if(res.error) return fail(500, {password, msg: res.error.message});
        throw redirect(303, "/admin");
    }
};