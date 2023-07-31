import { ADMIN_USERNAME, ADMIN_PASSWORD } from "$env/static/private";
import type { Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { authorize } from "$lib/cookies";

export const actions: Actions = {
    default: async ({ cookies, request, url }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");
        if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            await authorize(cookies);
            const goto = url.searchParams.get("redirect") || "/admin";
            throw redirect(303, goto);
        } else {
            return fail(400, {error: true});
        }
    }
}