import type { RequestHandler } from "./$types";
import { words } from "$lib/db";
import { summary_projection, type Summary } from "$lib/word-utils";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    const page = +(url.searchParams.get("skip") || 0);
    console.log("received: " + page)
    const res = await words.find({}, {
        limit: 50,
        skip: 50*page,
        sort: {_id: -1},
        projection: summary_projection
    }).toArray() as unknown[] as Summary[];
    
    return json(res);
}

