import type { RequestHandler } from "./$types";
import { words } from "$lib/db";
import { summary_projection, getSearchFilter } from "$lib/words/utils";
import type { Summary } from "$lib/words/types";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    const search = url.searchParams.get("search") || '';
    const filter = search ? getSearchFilter(search) : {};
    const skip = Math.abs(Math.round(+(url.searchParams.get("skip") || 0)));
    const res = await words.find(filter, {
        limit: 50, skip,
        sort: {_id: -1},
        projection: summary_projection
    }).toArray() as unknown[] as Summary[];
    
    return json(res);
}

