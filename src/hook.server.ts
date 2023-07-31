import { redirect, type Handle } from "@sveltejs/kit";
import { isAuthorized } from "$lib/cookies";

export const handle: Handle = async ({ event, resolve }) => {
    if(event.url.pathname.startsWith("/admin")) {
        if(!isAuthorized(event.cookies)) {
            throw redirect(303, "/login");
        }
    }
    return resolve(event);
}