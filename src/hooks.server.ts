import { redirect, type Handle } from "@sveltejs/kit";
import { isAuthorized } from "$lib/cookies";

export const handle: Handle = async ({ event, resolve }) => {
    if(event.url.pathname.startsWith("/admin")) {
        if(!await isAuthorized(event.cookies)) {
            throw redirect(303, "/login?redirect="+encodeURI(event.url.pathname));
        }
    }
    return resolve(event);
}