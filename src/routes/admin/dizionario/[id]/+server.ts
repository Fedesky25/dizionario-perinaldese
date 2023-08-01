import type { RequestHandler } from "./$types";
import { words } from "$lib/db";
import { ObjectId } from "mongodb";
import { error, json } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ params, request }) => {
    let _id: ObjectId;
    try { _id = new ObjectId(params.id); } 
    catch { throw error(400, `"${params.id}" non è un ID valido`); } 
    const update = await request.json().catch(msg => {
        throw error(400, {
            message: "The body of the request is not a json",
            details: String(msg)
        });
    });
    const res = await words.updateOne({_id}, update, {checkKeys: true});
    return json({ found: res.matchedCount > 0 }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ params }) => {
    let _id: ObjectId;
    try { _id = new ObjectId(params.id); } 
    catch { return json({deleted: false}, {status: 200}); } 
    const res = await words.deleteOne({_id});
    return json({ deleted: res.deletedCount>0 }, {status: 200});
};