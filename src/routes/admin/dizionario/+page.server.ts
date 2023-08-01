import type { PageServerLoad } from "./$types";
import { words } from "$lib/db";
import { summary_projection, type Summary } from "$lib/word-utils";

async function getDocs(params: URLSearchParams) {
    const raw = params.get("pages");
    const pages = raw ? Math.abs(parseInt(raw)) : 1;
    //@ts-ignore
    const parole = await words.find({}, {
        limit: 50*pages,
        sort: { _id: -1 },
        projection: summary_projection
    }).toArray();
    //@ts-ignore
    parole.forEach(w => {w._id = w._id.toString()}); // to fix mongoDB objectID
    return parole as unknown[] as Summary[]
}

export const load: PageServerLoad = async ({ cookies, url }) => {
    const cached = cookies.get("cached");
    const parole = cached ? [] : await getDocs(url.searchParams);
    return {cached, parole};
}