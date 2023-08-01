import type { PageServerLoad } from "./$types";
import { words } from "$lib/db";
import { ObjectId } from "mongodb";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    let _id: ObjectId
    try { _id = new ObjectId(params.id); } 
    catch { throw error(400, `"${params.id}" non è un ID valido`); } 
    const doc = await words.findOne({_id});
    if(!doc) throw error(404, `Non esiste nessuna parola con id "${params.id}"`);
    //@ts-ignore
    doc._id = doc._id.toString();
    return { doc };
};