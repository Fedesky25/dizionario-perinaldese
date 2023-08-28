import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
    const goto = url.searchParams.get("redirect");
    return { goto: goto && goto.startsWith("/") ? decodeURI(goto) : "/admin" }
};